from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db, ScanHistory
from typing import List
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/{user_id}")
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    history = db.query(ScanHistory).filter(ScanHistory.user_id == user_id).order_by(ScanHistory.timestamp.desc()).all()
    return {"history": history}

@router.get("/graph/{user_id}")
def get_graph_data(user_id: int, db: Session = Depends(get_db)):
    # Aggregate data by day for the graph
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)
    
    # We want to show a graph of average confidence scores strictly for abnormal conditions over time
    data = db.query(
        func.date(ScanHistory.timestamp).label("date"),
        func.avg(ScanHistory.confidence).label("avg_confidence"),
        func.count(ScanHistory.id).label("scan_count")
    ).filter(
        ScanHistory.user_id == user_id,
        ScanHistory.timestamp >= start_date
    ).group_by(
        func.date(ScanHistory.timestamp)
    ).order_by(
        func.date(ScanHistory.timestamp)
    ).all()
    
    graph_data = [{"date": row.date, "avg_confidence": round(row.avg_confidence, 2), "scan_count": row.scan_count} for row in data]
    return {"graph_data": graph_data}
