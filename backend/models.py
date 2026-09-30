from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    host_name = Column(String, nullable=False)
    invite_link = Column(String, nullable=False)
    is_scheduled = Column(Boolean, default=False)
    scheduled_time = Column(DateTime, nullable=True)
    duration = Column(Integer, default=60)  # Duration in minutes
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with participants
    participants = relationship("Participant", back_populates="meeting")

class Participant(Base):
    __tablename__ = "participants"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    name = Column(String, nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    left_at = Column(DateTime, nullable=True)
    is_host = Column(Boolean, default=False)
    
    # Relationship with meeting
    meeting = relationship("Meeting", back_populates="participants")