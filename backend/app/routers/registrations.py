from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/events/{event_id}/registrations", tags=["registrations"])


@router.get("/", response_model=List[schemas.Registration])
def list_registrations(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event.registrations


@router.post("/", response_model=schemas.Registration, status_code=201)
def register(event_id: int, reg: schemas.RegistrationCreate, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if len(event.registrations) >= event.capacity:
        raise HTTPException(status_code=400, detail="Event is fully booked")

    existing = db.query(models.Registration).filter(
        models.Registration.event_id == event_id,
        models.Registration.email == reg.email
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered with this email")

    db_reg = models.Registration(event_id=event_id, **reg.model_dump())
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg


@router.delete("/{registration_id}", status_code=204)
def cancel_registration(event_id: int, registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(models.Registration).filter(
        models.Registration.id == registration_id,
        models.Registration.event_id == event_id
    ).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    db.delete(reg)
    db.commit()
