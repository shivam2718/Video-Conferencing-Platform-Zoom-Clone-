from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    host_name: str = "Default User"

class ScheduleMeetingRequest(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_time: datetime
    duration: int = 60  # Duration in minutes

class JoinMeetingRequest(BaseModel):
    display_name: str

class MeetingResponse(BaseModel):
    id: int
    meeting_id: str
    title: str
    host_name: str
    invite_link: str
    is_scheduled: bool
    scheduled_time: Optional[datetime] = None
    duration: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ParticipantResponse(BaseModel):
    id: int
    name: str
    joined_at: datetime
    left_at: Optional[datetime] = None
    is_host: bool
    
    class Config:
        from_attributes = True