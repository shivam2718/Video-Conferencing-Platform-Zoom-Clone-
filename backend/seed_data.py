from database import SessionLocal, engine, Base
from models import Meeting, Participant
from datetime import datetime, timedelta
import uuid

# Create tables
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Participant).delete()
        db.query(Meeting).delete()
        
        # Create sample meetings
        now = datetime.utcnow()
        
        # Recent meetings
        recent_meetings = [
            Meeting(
                meeting_id="ABC12345",
                title="Team Standup",
                description="Daily team standup meeting",
                host_name="John Doe",
                invite_link="http://localhost:3000/meeting/ABC12345",
                is_scheduled=False,
                created_at=now - timedelta(hours=2)
            ),
            Meeting(
                meeting_id="XYZ67890",
                title="Client Presentation",
                description="Quarterly business review with client",
                host_name="Jane Smith",
                invite_link="http://localhost:3000/meeting/XYZ67890",
                is_scheduled=False,
                created_at=now - timedelta(days=1)
            ),
            Meeting(
                meeting_id="DEF54321",
                title="Project Review",
                description="Weekly project status review",
                host_name="Mike Johnson",
                invite_link="http://localhost:3000/meeting/DEF54321",
                is_scheduled=False,
                created_at=now - timedelta(days=3)
            )
        ]
        
        # Upcoming scheduled meetings
        upcoming_meetings = [
            Meeting(
                meeting_id="FUT11111",
                title="All Hands Meeting",
                description="Monthly company all hands meeting",
                host_name="CEO",
                invite_link="http://localhost:3000/meeting/FUT11111",
                is_scheduled=True,
                scheduled_time=now + timedelta(days=2),
                duration=60,
                created_at=now
            ),
            Meeting(
                meeting_id="FUT22222",
                title="Design Review",
                description="UI/UX design review session",
                host_name="Design Team",
                invite_link="http://localhost:3000/meeting/FUT22222",
                is_scheduled=True,
                scheduled_time=now + timedelta(days=5),
                duration=90,
                created_at=now
            ),
            Meeting(
                meeting_id="FUT33333",
                title="Sprint Planning",
                description="Next sprint planning meeting",
                host_name="Scrum Master",
                invite_link="http://localhost:3000/meeting/FUT33333",
                is_scheduled=True,
                scheduled_time=now + timedelta(weeks=1),
                duration=120,
                created_at=now
            )
        ]
        
        all_meetings = recent_meetings + upcoming_meetings
        
        for meeting in all_meetings:
            db.add(meeting)
        
        db.commit()
        
        # Add some participants to recent meetings
        for meeting in recent_meetings:
            db.refresh(meeting)
            participants = [
                Participant(
                    meeting_id=meeting.id,
                    name="John Doe",
                    joined_at=meeting.created_at + timedelta(minutes=1),
                    is_host=True
                ),
                Participant(
                    meeting_id=meeting.id,
                    name="Jane Smith",
                    joined_at=meeting.created_at + timedelta(minutes=2)
                ),
                Participant(
                    meeting_id=meeting.id,
                    name="Bob Wilson",
                    joined_at=meeting.created_at + timedelta(minutes=3)
                )
            ]
            
            for participant in participants:
                db.add(participant)
        
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()