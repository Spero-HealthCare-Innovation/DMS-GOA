from fastapi import APIRouter, Query
from typing import Optional
from DMS_goa.hive_connector import hive_connecter_execution

router = APIRouter()

@router.get("/incident_report_daywise/")
def incident_report_daywise(
    from_date: Optional[str] = Query(..., description="Start date in YYYY-MM-DD format"),
    to_date: Optional[str] = Query(..., description="End date in YYYY-MM-DD format")):
    try:
        query = f"SELECT incident_id, closure_acknowledge, closure_start_base_location, closure_at_scene, closure_from_scene, closure_back_to_base, closure_remark FROM closure_report where closure_added_date between '{from_date}' and '{to_date}'"
        # print("Running query:", query)s
        data = hive_connecter_execution(query)
        return data
    except Exception as e:
        return {"status": "error","message": str(e)}
