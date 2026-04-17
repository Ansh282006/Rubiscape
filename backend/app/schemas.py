from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

class PipelineCreate(BaseModel):
    name: str
    pipeline_type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class PipelineResponse(BaseModel):
    id: UUID
    name: str
    current_state: str
    pipeline_type: Optional[str]
    created_by: str
    assigned_to: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

class TransitionRequest(BaseModel):
    pipeline_id: UUID
    to_state: str
    reason: Optional[str] = None

class AuditResponse(BaseModel):
    id: UUID
    pipeline_id: UUID
    action: str
    actor: str
    changes: Dict
    ip_address: Optional[str]
    current_hash: str
    created_at: datetime
