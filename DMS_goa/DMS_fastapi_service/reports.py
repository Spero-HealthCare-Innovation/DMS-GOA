from fastapi import APIRouter, Query
from typing import Optional
from DMS_goa.hive_connector import hive_connecter_execution
from io import BytesIO
import pandas as pd
from admin_web.models import *
from fastapi.responses import StreamingResponse
from datetime import datetime, timedelta
import pytz

india_tz = pytz.timezone('Asia/Kolkata')


router = APIRouter()

@router.get("/incident_closure_report_daywise/")
def incident_report_daywise(
    from_date: Optional[str] = Query(..., description="Start date in YYYY-MM-DD format"),
    to_date: Optional[str] = Query(..., description="End date in YYYY-MM-DD format")):
    try:
        to_date_obj = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)
        to_date_plus_one = to_date_obj.strftime("%Y-%m-%d")
        query = f"SELECT incident_id, disaster_type_id, closure_acknowledge, closure_start_base_location, closure_at_scene, closure_from_scene, closure_back_to_base, closure_remark FROM final_closure_report where closure_added_date between '{from_date}' and '{to_date_plus_one}'"
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
            SELECT incident_id, disaster_type_id, alert_id_id, inc_added_date, mode, alert_type,caller_id_id, location, latitude, longitude, closure_acknowledge, closure_start_base_location, 
                   closure_at_scene, closure_from_scene, closure_back_to_base, closure_remark, closure_added_date 
            FROM final_closure_report 
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
            
            caller_dtls = DMS_Caller.objects.filter(caller_pk_id=i['caller_id_id'])
            print(caller_dtls,'caller_dtlscaller_dtlscaller_dtls')
            if caller_dtls.exists():
                caller=caller_dtls.first()
            else:
                caller=None
            
            nn={"Incident Id": i['incident_id'],
                "Alert Source":"System Alert" if  i['mode'] == 2 else "Manual Calls",
                "Disaster Type": dstss.disaster_name,
                "Alert Type": "High" if i['alert_type'] == 1 else "Medium" if i['alert_type'] == 2 else "Low" if i['alert_type'] == 3 else "Very Low" if i['alert_type'] == 4 else "Unknown",
                "Alert Time" : alrt.alert_datetime.astimezone(india_tz).replace(tzinfo=None) if alrt else "",
                "Incident Dispatch Time" : i['inc_added_date'],
                "Closure Time": i['closure_added_date'],
                "Closure Acknowledge" : i['closure_acknowledge'],
                "Closure Start Base location" : i['closure_start_base_location'],
                "Closure At Scene" : i['closure_at_scene'],
                "Closure From Scene" : i['closure_from_scene'],
                "Closure Back To Base" : i['closure_back_to_base'],
                "Closure Remark" : i['closure_remark'],
                "Caller Number" : caller.caller_no if caller else None,
                "Caller Name" : caller.caller_name if caller else None,
                "Address" : i['location'],
                "Lattitude" : i['latitude'],
                "Longitude" : i['longitude']
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