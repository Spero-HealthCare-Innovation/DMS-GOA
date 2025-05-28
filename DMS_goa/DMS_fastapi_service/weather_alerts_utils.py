# ------------------------------Nikita---------------------------------------
from asgiref.sync import sync_to_async
from admin_web.models import Weather_alerts
import logging
import asyncio
import asyncpg
import urllib.parse
from django.conf import settings
import json
# ----------------------------###Nikita###-------------------------------------



# -------------------------------NIKITA-----------------------------------------
connected_clients_trigger2 = set()

logger = logging.getLogger(__name__)

@sync_to_async
def get_old_weather_alerts():
    try:
        alerts = Weather_alerts.objects.order_by("-time")
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
                "disaster_id": alert.disaster_id.disaster_id,
                "disaster_name": alert.disaster_id.disaster_name
            }
            for alert in alerts
        ]
    except Exception as e:
        logger.error(f"Error in get_old_weather_alerts: {e}")
        return []


connected_clients = set()

# Build DSN from Django settings
db_settings = settings.DATABASES['default']
# Safely encode password
password = urllib.parse.quote_plus(db_settings['PASSWORD'])
PG_DSN = f"postgresql://{db_settings['USER']}:{password}@{db_settings['HOST']}:{db_settings['PORT']}/{db_settings['NAME']}"



async def pg_listener(conn, pid, channel, payload):
    print(f"Received from PostgreSQL: {payload}")
    for ws in connected_clients.copy():
        try:
            await ws.send_text(payload)
        except Exception as e:
            print(f"Error sending to WebSocket: {e}")
            connected_clients.remove(ws)



async def on_notify(conn, pid, channel, payload):
    # print("New payload:", payload)

    data = json.loads(payload)
    # Broadcast to all clients (if you want old behavior)
    for ws in connected_clients.copy():
        try:
            await ws.send_text(payload)
        except Exception as e:
            print(f"Error sending to client: {e}")
            connected_clients.discard(ws)

    # Send only if triger_status == 2 to trigger2 clients
    if data.get("triger_status") == 2:
        for ws in connected_clients_trigger2.copy():
            try:
                await ws.send_text(payload)
            except Exception as e:
                print(f"Error sending to trigger2 client: {e}")
                connected_clients_trigger2.discard(ws)


async def listen_to_postgres():
    while True:
        try:
            conn = await asyncpg.connect(PG_DSN)

            await conn.add_listener('weather_alerts_channel', on_notify)
            print("Listening to PostgreSQL channel...")

            while True:
                # await asyncio.sleep(1)
                await asyncio.sleep(60)

        except Exception as e:
            print(f"PostgreSQL listen error: {e}")
            await asyncio.sleep(10)  # wait and retry
        finally:
            # if 'conn' in locals():
            #     await conn.close()
            if conn:
                try:
                    await conn.remove_listener('weather_alerts_channel', on_notify)
                    await conn.close()
                    print("🔌 PostgreSQL connection closed and listener removed.")
                except Exception as cleanup_error:
                    print(f"⚠️ Cleanup error: {cleanup_error}")

# -------------------------------###NIKITA###-----------------------------------------