from fastapi import APIRouter, Query
from typing import Optional
from DMS_goa.hive_connector import hive_connecter_execution
from io import BytesIO
import pandas as pd
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.get("/incident_closure_report_daywise/")
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




@router.get("/download_incident_closure_report_daywise/")
def incident_report_daywise(
    from_date: Optional[str] = Query(..., description="Start date in YYYY-MM-DD format"),
    to_date: Optional[str] = Query(..., description="End date in YYYY-MM-DD format")
):
    try:
        query = f"""
            SELECT incident_id, closure_acknowledge, closure_start_base_location, 
                   closure_at_scene, closure_from_scene, closure_back_to_base, closure_remark 
            FROM closure_report 
            WHERE closure_added_date BETWEEN '{from_date}' AND '{to_date}'
        """
        data = hive_connecter_execution(query)

        # Convert list of dicts to DataFrame
        df = pd.DataFrame(data)

        # Write to Excel in memory using openpyxl
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Incident Report')
        output.seek(0)

        filename = f"incident_report_{from_date}_to_{to_date}.xlsx"
        headers = {
            'Content-Disposition': f'attachment; filename="{filename}"'
        }

        return StreamingResponse(output, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers=headers)

    except Exception as e:
        return {"status": "error", "message": str(e)}