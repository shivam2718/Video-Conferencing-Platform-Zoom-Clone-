from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Meeting, Participant
from schemas import MeetingCreate, MeetingResponse, JoinMeetingRequest, ScheduleMeetingRequest
import uuid
from datetime import datetime, timedelta
from typing import List
import uvicorn

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Zoom Clone API",
    description="A video conferencing platform API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Zoom Clone API is running!"}

@app.post("/meetings/instant", response_model=MeetingResponse)
def create_instant_meeting(db: Session = Depends(get_db)):
    """Create an instant meeting"""
    meeting_id = str(uuid.uuid4())[:8].upper()
    invite_link = f"http://localhost:3000/meeting/{meeting_id}"
    
    meeting = Meeting(
        meeting_id=meeting_id,
        title="Instant Meeting",
        host_name="Default User",
        invite_link=invite_link,
        is_scheduled=False,
        created_at=datetime.utcnow()
    )
    
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    return MeetingResponse(
        id=meeting.id,
        meeting_id=meeting.meeting_id,
        title=meeting.title,
        host_name=meeting.host_name,
        invite_link=meeting.invite_link,
        is_scheduled=meeting.is_scheduled,
        scheduled_time=meeting.scheduled_time,
        duration=meeting.duration,
        created_at=meeting.created_at
    )

@app.post("/meetings/schedule", response_model=MeetingResponse)
def schedule_meeting(meeting_data: ScheduleMeetingRequest, db: Session = Depends(get_db)):
    """Schedule a meeting for later"""
    meeting_id = str(uuid.uuid4())[:8].upper()
    invite_link = f"http://localhost:3000/meeting/{meeting_id}"
    
    meeting = Meeting(
        meeting_id=meeting_id,
        title=meeting_data.title,
        description=meeting_data.description,
        host_name="Default User",
        invite_link=invite_link,
        is_scheduled=True,
        scheduled_time=meeting_data.scheduled_time,
        duration=meeting_data.duration,
        created_at=datetime.utcnow()
    )
    
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    return MeetingResponse(
        id=meeting.id,
        meeting_id=meeting.meeting_id,
        title=meeting.title,
        host_name=meeting.host_name,
        invite_link=meeting.invite_link,
        is_scheduled=meeting.is_scheduled,
        scheduled_time=meeting.scheduled_time,
        duration=meeting.duration,
        created_at=meeting.created_at
    )

@app.get("/meetings/upcoming", response_model=List[MeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    """Get upcoming scheduled meetings"""
    now = datetime.utcnow()
    meetings = db.query(Meeting).filter(
        Meeting.is_scheduled == True,
        Meeting.scheduled_time > now
    ).order_by(Meeting.scheduled_time.asc()).all()
    
    return [
        MeetingResponse(
            id=meeting.id,
            meeting_id=meeting.meeting_id,
            title=meeting.title,
            host_name=meeting.host_name,
            invite_link=meeting.invite_link,
            is_scheduled=meeting.is_scheduled,
            scheduled_time=meeting.scheduled_time,
            duration=meeting.duration,
            created_at=meeting.created_at
        )
        for meeting in meetings
    ]

@app.get("/meetings/recent", response_model=List[MeetingResponse])
def get_recent_meetings(db: Session = Depends(get_db)):
    """Get recent meetings (last 30 days)"""
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    meetings = db.query(Meeting).filter(
        Meeting.created_at >= thirty_days_ago
    ).order_by(Meeting.created_at.desc()).limit(10).all()
    
    return [
        MeetingResponse(
            id=meeting.id,
            meeting_id=meeting.meeting_id,
            title=meeting.title,
            host_name=meeting.host_name,
            invite_link=meeting.invite_link,
            is_scheduled=meeting.is_scheduled,
            scheduled_time=meeting.scheduled_time,
            duration=meeting.duration,
            created_at=meeting.created_at
        )
        for meeting in meetings
    ]

@app.get("/meetings/{meeting_id}")
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    """Get meeting details by meeting ID"""
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    return MeetingResponse(
        id=meeting.id,
        meeting_id=meeting.meeting_id,
        title=meeting.title,
        host_name=meeting.host_name,
        invite_link=meeting.invite_link,
        is_scheduled=meeting.is_scheduled,
        scheduled_time=meeting.scheduled_time,
        duration=meeting.duration,
        created_at=meeting.created_at
    )

@app.post("/meetings/{meeting_id}/join")
def join_meeting(meeting_id: str, join_data: JoinMeetingRequest, db: Session = Depends(get_db)):
    """Join a meeting"""
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Check if participant already exists
    existing_participant = db.query(Participant).filter(
        Participant.meeting_id == meeting.id,
        Participant.name == join_data.display_name
    ).first()
    
    if existing_participant:
        return {"message": "Already joined", "participant_id": existing_participant.id}
    
    participant = Participant(
        meeting_id=meeting.id,
        name=join_data.display_name,
        joined_at=datetime.utcnow()
    )
    
    db.add(participant)
    db.commit()
    db.refresh(participant)
    
    return {"message": "Successfully joined meeting", "participant_id": participant.id}

@app.get("/meetings", response_model=List[MeetingResponse])
def get_all_meetings(db: Session = Depends(get_db)):
    """Get all meetings"""
    meetings = db.query(Meeting).order_by(Meeting.created_at.desc()).all()
    
    return [
        MeetingResponse(
            id=meeting.id,
            meeting_id=meeting.meeting_id,
            title=meeting.title,
            host_name=meeting.host_name,
            invite_link=meeting.invite_link,
            is_scheduled=meeting.is_scheduled,
            scheduled_time=meeting.scheduled_time,
            duration=meeting.duration,
            created_at=meeting.created_at
        )
        for meeting in meetings
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)