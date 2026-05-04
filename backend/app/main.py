from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import events, registrations

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EventHub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(registrations.router)


@app.get("/")
def root():
    return {"message": "EventHub API is running"}
