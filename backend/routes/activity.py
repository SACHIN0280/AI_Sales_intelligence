from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/activity", tags=["activity"])

@router.get("", response_model=List[schemas.ActivityResponse])
def get_activities(db: Session = Depends(get_db)):
    return db.query(models.Activity).order_by(models.Activity.created_at.desc()).limit(50).all()
