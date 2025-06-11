from fastapi import APIRouter, Query
from typing import Optional
from DMS_goa.hive_connector import hive_connecter_execution
from io import BytesIO
import pandas as pd
from admin_web.models import *
from fastapi.responses import StreamingResponse
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/incident_closure_report_daywise/")
def incident_report_daywise(
    from_date: Optional[str] = Query(..., description="Start date in YYYY-MM-DD format"),
    to_date: Optional[str] = Query(..., description="End date in YYYY-MM-DD format")):
    try:
        query = f"SELECT incident_id, disaster_type_id, closure_acknowledge, closure_start_base_location, closure_at_scene, closure_from_scene, closure_back_to_base, closure_remark FROM closure_report where closure_added_date between '{from_date}' and '{to_date}'"
        data = hive_connecter_execution(query)  
        dt=[] 
        for i in data:
            dstss = DMS_Disaster_Type.objects.get(disaster_id=i['disaster_type_id'])
            print(dstss,'dstssdstssdstssdstss')
            nn={
                "incident_id": i['incident_id'],
                "disaster_type": dstss.disaster_name,
                "closure_acknowledge": i['closure_acknowledge'],
                "closure_start_base_location": i['closure_start_base_location'],
                "closure_at_scene": i['closure_at_scene'],
                "closure_from_scene": i['closure_from_scene'],
                "closure_back_to_base": i['closure_back_to_base'],
                "closure_remark": i['closure_remark']
            }
            dt.append(nn)
        return dt
    except Exception as e:
        return {"status": "error","message": str(e)}




@router.get("/download_incident_closure_report_daywise/")
def incident_report_daywise(
    from_date: Optional[str] = Query(..., description="Start date in YYYY-MM-DD format"),
    to_date: Optional[str] = Query(..., description="End date in YYYY-MM-DD format")
):
    try:
        to_date_obj = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)
        to_date_plus_one = to_date_obj.strftime("%Y-%m-%d")
        query = f"""
            SELECT incident_id, disaster_type_id, alert_id_id, inc_added_date, closure_acknowledge, closure_start_base_location, 
                   closure_at_scene, closure_from_scene, closure_back_to_base, closure_remark 
            FROM closure_report 
            WHERE closure_added_date BETWEEN '{from_date}' AND '{to_date_plus_one}'
        """
        data = hive_connecter_execution(query)
        dt=[] 
        for i in data:
            dstss = DMS_Disaster_Type.objects.get(disaster_id=i['disaster_type_id'])
            print(dstss,'dstssdstssdstssdstss')
            # alrt = Weather_alerts.objects.get(pk_id=i['alert_id_id'] if i['alert_id_id'] else 0)
            alrt_qs = Weather_alerts.objects.filter(pk_id=i['alert_id_id'])
            if alrt_qs.exists():
                alrt = alrt_qs.first()
            else:
                alrt = None  
            
            nn={
                "incident_id": i['incident_id'],
                "disaster_type": dstss.disaster_name,
                "alart_time":alrt.alert_datetime.replace(tzinfo=None) if alrt else "",
                "dispatch_time":i['inc_added_date'],
                "closure_acknowledge": i['closure_acknowledge'],
                "incident_create_time":i['inc_added_date'],
                # "alart_time":alrt_dt.alert_datetime if alrt_dt else None,
                "closure_start_base_location": i['closure_start_base_location'],
                "closure_at_scene": i['closure_at_scene'],
                "closure_from_scene": i['closure_from_scene'],
                "closure_back_to_base": i['closure_back_to_base'],
                "closure_remark": i['closure_remark']
            }
            dt.append(nn)
        df = pd.DataFrame(dt)
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