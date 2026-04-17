from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditLog
from app.services.audit_service import AuditService
import uuid

router = APIRouter(prefix="/api/v1", tags=["audit"])

@router.get("/audit/{pipeline_id}")
async def get_audit(pipeline_id: uuid.UUID, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).filter(AuditLog.pipeline_id == pipeline_id).order_by(AuditLog.created_at).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No audit logs found")
    
    audit_service = AuditService(db)
    is_verified = audit_service.verify_chain(pipeline_id)
    
    return {
        "pipeline_id": str(pipeline_id),
        "verified": is_verified,
        "audit_trail": [
            {
                "id": str(log.id),
                "action": log.action,
                "actor": log.actor,
                "changes": log.changes,
                "timestamp": log.created_at.isoformat(),
                "hash": log.current_hash
            }
            for log in logs
        ]
    }

@router.get("/audit/export/{pipeline_id}")
async def export_audit(pipeline_id: uuid.UUID, format: str = "json", db: Session = Depends(get_db)):
    logs = db.query(AuditLog).filter(AuditLog.pipeline_id == pipeline_id).order_by(AuditLog.created_at).all()
    if format == "json":
        return {"audit_logs": [log.changes for log in logs]}
    else:
        # Simple text format for PDF-like output
        output = f"Audit Report for Pipeline: {pipeline_id}\n\n"
        for log in logs:
            output += f"[{log.created_at}] {log.action} by {log.actor}: {log.changes}\n"
        return {"text_report": output}
