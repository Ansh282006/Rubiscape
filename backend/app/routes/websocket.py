from fastapi import WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager
import structlog

logger = structlog.get_logger()

async def websocket_endpoint(websocket: WebSocket, role: str):
    if role not in ["engineer", "manager", "client"]:
        await websocket.close(code=1008, reason="Invalid role")
        return
    
    await manager.connect(websocket, role)
    logger.info(f"WebSocket connected", role=role)
    
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received message", message=data)
            await manager.broadcast({"type": "echo", "data": data}, roles=[role])
    except WebSocketDisconnect:
        manager.disconnect(websocket, role)
        logger.info(f"WebSocket disconnected", role=role)
