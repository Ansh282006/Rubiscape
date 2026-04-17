from enum import Enum
from typing import Dict, Set

class PipelineState(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class PipelineFSM:
    _transitions: Dict[PipelineState, Set[PipelineState]] = {
        PipelineState.PENDING: {PipelineState.RUNNING, PipelineState.CANCELLED},
        PipelineState.RUNNING: {PipelineState.COMPLETED, PipelineState.FAILED, PipelineState.CANCELLED},
        PipelineState.FAILED: {PipelineState.PENDING},
        PipelineState.COMPLETED: set(),
        PipelineState.CANCELLED: set(),
    }
    
    @classmethod
    def can_transition(cls, from_state: PipelineState, to_state: PipelineState) -> bool:
        return to_state in cls._transitions.get(from_state, set())
    
    @classmethod
    def get_allowed_transitions(cls, current_state: PipelineState) -> Set[PipelineState]:
        return cls._transitions.get(current_state, set())
