from asgiref.sync import sync_to_async
from django.db import connection  # Add this
from admin_web.models import Weather_alerts
import logging

logger = logging.getLogger(__name__)

@sync_to_async
def get_old_weather_alerts():
    try:
        alerts = Weather_alerts.objects.order_by("-time")[:10]
        return [
            {
                "pk_id": alert.pk_id,
                "latitude": alert.latitude,
                "longitude": alert.longitude,
                "elevation": alert.elevation,
                "time": alert.time.isoformat() if alert.time else None,
                "temperature_2m": alert.temperature_2m,
                "rain": alert.rain,
                "precipitation": alert.precipitation,
                "weather_code": alert.weather_code,
                "triger_status": alert.triger_status,
            }
            for alert in alerts
        ]
    except Exception as e:
        logger.error(f"Error in get_old_weather_alerts: {e}")
        return []


