from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, get_db
from app.routes import pipelines, audit
from app.routes.websocket import websocket_endpoint
from app.models import Pipeline
import structlog

logger = structlog.get_logger()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Rubiscape ML Pipeline Tracker", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pipelines.router)
app.include_router(audit.router)

@app.websocket("/ws/{role}")
async def websocket_route(websocket: WebSocket, role: str):
    await websocket_endpoint(websocket, role)

@app.get("/")
async def root():
    return {
        "message": "Rubiscape ML Pipeline Tracker API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/api/v1/execute", "/api/v1/state/{id}", "/api/v1/transition", "/api/v1/audit/{id}", "/ws/{role}"]
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "rubiscape-tracker"}

@app.get("/api/v1/dashboard/summary")
async def dashboard_summary(db = Depends(get_db)):
    total = db.query(Pipeline).count()
    running = db.query(Pipeline).filter(Pipeline.current_state == "RUNNING").count()
    completed = db.query(Pipeline).filter(Pipeline.current_state == "COMPLETED").count()
    failed = db.query(Pipeline).filter(Pipeline.current_state == "FAILED").count()
    
    return {
        "total": total,
        "green": running + completed,
        "red": failed,
        "green_percentage": round(((running + completed) / total) * 100, 1) if total > 0 else 0,
        "state_breakdown": {"RUNNING": running, "COMPLETED": completed, "FAILED": failed}
    }

# 2. State endpoint - Get current state
@app.get("/api/v1/state/{pipeline_id}")
async def get_state(pipeline_id: str):
    """Get current state of a pipeline"""
    if pipeline_id not in pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    return pipelines[pipeline_id]

# 3. Transition endpoint - Update state
@app.post("/api/v1/transition")
async def transition_state(pipeline_id: str, to_state: str, reason: str = None):
    """Update pipeline state (FSM validated)"""
    if pipeline_id not in pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    current = pipelines[pipeline_id]
    from_state = current["state"]
    
    # FSM Validation - Valid transitions
    valid_transitions = {
        "PENDING": ["RUNNING", "CANCELLED"],
        "RUNNING": ["COMPLETED", "FAILED", "CANCELLED"],
        "FAILED": ["PENDING"],  # Retry
        "COMPLETED": [],  # Terminal
        "CANCELLED": []   # Terminal
    }
    
    if to_state not in valid_transitions.get(from_state, []):
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid transition: {from_state} → {to_state}"
        )
    
    # Update state
    current["state"] = to_state
    current["updated_at"] = datetime.utcnow().isoformat()
    
    # Add to audit log
    audit_logs.append({
        "pipeline_id": pipeline_id,
        "action": "TRANSITION",
        "from_state": from_state,
        "to_state": to_state,
        "reason": reason,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Broadcast update
    await manager.broadcast(json.dumps({
        "type": "state_change",
        "pipeline_id": pipeline_id,
        "from_state": from_state,
        "to_state": to_state,
        "timestamp": datetime.utcnow().isoformat()
    }))
    
    logger.info(f"State transition", pipeline_id=pipeline_id, from_state=from_state, to_state=to_state)
    return {"status": "success", "from": from_state, "to": to_state}

# 4. Audit endpoint - Get deployment proof
@app.get("/api/v1/audit/{pipeline_id}")
async def get_audit(pipeline_id: str):
    """Get audit trail for a pipeline"""
    logs = [log for log in audit_logs if log["pipeline_id"] == pipeline_id]
    if not logs:
        raise HTTPException(status_code=404, detail="No audit logs found")
    
    return {
        "pipeline_id": pipeline_id,
        "audit_trail": logs,
        "total_transitions": len(logs)
    }

# 5. WebSocket endpoint - Real-time updates
@app.websocket("/ws/{role}")
async def websocket_endpoint(websocket: WebSocket, role: str):
    """WebSocket connection for real-time updates"""
    if role not in ["engineer", "manager", "client"]:
        await websocket.close(code=1008, reason="Invalid role")
        return
    
    await manager.connect(websocket)
    logger.info(f"WebSocket connected", role=role)
    
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            logger.info(f"Received", message=data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info(f"WebSocket disconnected", role=role)

# Dashboard summary for managers
@app.get("/api/v1/dashboard/summary")
async def dashboard_summary():
    """Get overall pipeline health summary"""
    total = len(pipelines)
    if total == 0:
        return {"total": 0, "green": 0, "red": 0, "pipelines": {}}
    
    state_counts = {}
    for pipeline in pipelines.values():
        state = pipeline["state"]
        state_counts[state] = state_counts.get(state, 0) + 1
    
    green_states = ["COMPLETED", "RUNNING"]
    red_states = ["FAILED"]
    
    green_count = sum(state_counts.get(s, 0) for s in green_states)
    red_count = sum(state_counts.get(s, 0) for s in red_states)
    
    return {
        "total": total,
        "green": green_count,
        "red": red_count,
        "green_percentage": round((green_count/total)*100, 1) if total > 0 else 0,
        "state_breakdown": state_counts,
        "pipelines": pipelines
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)