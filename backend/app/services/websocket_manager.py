from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {
            "engineer": [],
            "manager": [],
            "client": []
        }
    
    async def connect(self, websocket: WebSocket, role: str):
        await websocket.accept()
        if role in self.active_connections:
            self.active_connections[role].append(websocket)
    
    def disconnect(self, websocket: WebSocket, role: str):
        if role in self.active_connections and websocket in self.active_connections[role]:
            self.active_connections[role].remove(websocket)
    
    async def broadcast(self, message: dict, roles: list = None):
        roles_to_send = roles or ["engineer", "manager", "client"]
        message_str = json.dumps(message)
        for role in roles_to_send:
            for connection in self.active_connections.get(role, []):
                try:
                    await connection.send_text(message_str)
                except:
                    pass

manager = ConnectionManager()
