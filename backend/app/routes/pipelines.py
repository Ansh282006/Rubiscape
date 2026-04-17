from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Pipeline, PipelineStateHistory
from app.schemas import PipelineCreate, PipelineResponse, TransitionRequest
from app.fsm import PipelineFSM, PipelineState
from app.services.audit_service import AuditService
from app.services.websocket_manager import manager
from app.auth import verify_token
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/v1", tags=["pipelines"])

@router.post("/execute", response_model=PipelineResponse)
async def execute_pipeline(
    pipeline: PipelineCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    if current_user["role"] not in ["engineer", "admin"]:
        raise HTTPException(status_code=403, detail="Only engineers can execute pipelines")
    
    db_pipeline = Pipeline(
        id=uuid.uuid4(),
        name=pipeline.name,
        current_state=PipelineState.PENDING,
        pipeline_type=pipeline.pipeline_type,
        created_by=current_user["email"],
        metadata=pipeline.metadata
    )
    db.add(db_pipeline)
    db.commit()
    db.refresh(db_pipeline)
    
    audit_service = AuditService(db)
    audit_service.create_audit_entry(
        pipeline_id=db_pipeline.id,
        action="EXECUTE",
        actor=current_user["email"],
        changes={"state": "PENDING", "pipeline_name": pipeline.name},
        ip_address=request.client.host
    )
    
    await manager.broadcast({
        "type": "pipeline_created",
        "pipeline_id": str(db_pipeline.id),
        "state": "PENDING"
    })
    
    return db_pipeline

@router.get("/state/{pipeline_id}", response_model=PipelineResponse)
async def get_state(pipeline_id: uuid.UUID, db: Session = Depends(get_db)):
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return pipeline

@router.post("/transition")
async def transition_state(
    request: TransitionRequest,
    req: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    pipeline = db.query(Pipeline).filter(Pipeline.id == request.pipeline_id).first()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    from_state = pipeline.current_state
    to_state = PipelineState(request.to_state)
    
    if not PipelineFSM.can_transition(from_state, to_state):
        raise HTTPException(status_code=400, detail=f"Invalid transition: {from_state.value} → {to_state.value}")
    
    old_state = pipeline.current_state
    pipeline.current_state = to_state
    if to_state == PipelineState.RUNNING and not pipeline.started_at:
        pipeline.started_at = datetime.utcnow()
    elif to_state == PipelineState.COMPLETED:
        pipeline.completed_at = datetime.utcnow()
    
    history = PipelineStateHistory(
        id=uuid.uuid4(),
        pipeline_id=pipeline.id,
        from_state=old_state,
        to_state=to_state,
        triggered_by=current_user["email"],
        reason=request.reason
    )
    db.add(history)
    
    audit_service = AuditService(db)
    audit_service.create_audit_entry(
        pipeline_id=pipeline.id,
        action="STATE_CHANGE",
        actor=current_user["email"],
        changes={"from_state": old_state.value, "to_state": to_state.value, "reason": request.reason},
        ip_address=req.client.host
    )
    
    db.commit()
    
    await manager.broadcast({
        "type": "state_change",
        "pipeline_id": str(pipeline.id),
        "from_state": old_state.value,
        "to_state": to_state.value
    })
    
    return {"status": "success", "from": old_state.value, "to": to_state.value}
