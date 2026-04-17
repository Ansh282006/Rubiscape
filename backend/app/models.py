from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Text, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Pipeline(Base):
    __tablename__ = "pipelines"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    current_state = Column(Enum('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', name='pipeline_state'), nullable=False, default='PENDING')
    pipeline_type = Column(String(50))
    created_by = Column(String(255), nullable=False)
    assigned_to = Column(String(255))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    metadata = Column(JSON)

class PipelineStateHistory(Base):
    __tablename__ = "pipeline_state_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("pipelines.id", ondelete="CASCADE"), nullable=False)
    from_state = Column(Enum('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', name='pipeline_state'))
    to_state = Column(Enum('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', name='pipeline_state'), nullable=False)
    triggered_by = Column(String(255), nullable=False)
    reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("pipelines.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(50), nullable=False)
    actor = Column(String(255), nullable=False)
    changes = Column(JSON, nullable=False)
    ip_address = Column(String(45))
    previous_hash = Column(String(64))
    current_hash = Column(String(64), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
