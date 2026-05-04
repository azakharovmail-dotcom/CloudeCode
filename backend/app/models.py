from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    location = Column(String(300))
    date = Column(DateTime, nullable=False)
    capacity = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)

    registrations = relationship("Registration", back_populates="event", cascade="all, delete")


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    registered_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="registrations")
