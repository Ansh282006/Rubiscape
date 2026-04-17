import hashlib
import json
from sqlalchemy.orm import Session
from app.models import AuditLog
from app.schemas import AuditResponse
from datetime import datetime
import uuid

class AuditService:
    def __init__(self, db: Session):
        self.db = db
    
    def _get_last_hash(self, pipeline_id) -> str:
        last_log = self.db.query(AuditLog).filter_by(pipeline_id=pipeline_id).order_by(AuditLog.created_at.desc()).first()
        return last_log.current_hash if last_log else None
    
    def create_audit_entry(self, pipeline_id, action, actor, changes, ip_address=None):
        previous_hash = self._get_last_hash(pipeline_id)
        
        audit_data = {
            "pipeline_id": str(pipeline_id),
            "action": action,
            "actor": actor,
            "changes": changes,
            "timestamp": datetime.utcnow().isoformat(),
            "previous_hash": previous_hash
        }
        
        audit_string = json.dumps(audit_data, sort_keys=True)
        current_hash = hashlib.sha256(audit_string.encode()).hexdigest()
        
        audit_log = AuditLog(
            id=uuid.uuid4(),
            pipeline_id=pipeline_id,
            action=action,
            actor=actor,
            changes=changes,
            ip_address=ip_address,
            previous_hash=previous_hash,
            current_hash=current_hash
        )
        
        self.db.add(audit_log)
        self.db.commit()
        self.db.refresh(audit_log)
        return audit_log
    
    def verify_chain(self, pipeline_id) -> bool:
        logs = self.db.query(AuditLog).filter_by(pipeline_id=pipeline_id).order_by(AuditLog.created_at).all()
        previous_hash = None
        for log in logs:
            audit_data = {
                "pipeline_id": str(log.pipeline_id),
                "action": log.action,
                "actor": log.actor,
                "changes": log.changes,
                "timestamp": log.created_at.isoformat(),
                "previous_hash": previous_hash
            }
            audit_string = json.dumps(audit_data, sort_keys=True)
            calculated_hash = hashlib.sha256(audit_string.encode()).hexdigest()
            if calculated_hash != log.current_hash:
                return False
            previous_hash = log.current_hash
        return True
