from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class RegistrationBase(BaseModel):
    name: str
    email: str


class RegistrationCreate(RegistrationBase):
    pass


class Registration(RegistrationBase):
    id: int
    event_id: int
    registered_at: datetime

    class Config:
        from_attributes = True


class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    date: datetime
    capacity: int = 100


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    date: Optional[datetime] = None
    capacity: Optional[int] = None


class Event(EventBase):
    id: int
    created_at: datetime
    registrations: List[Registration] = []
    spots_left: Optional[int] = None

    class Config:
        from_attributes = True
