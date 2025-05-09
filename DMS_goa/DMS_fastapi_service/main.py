from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import socketio
from pydantic import BaseModel
from fastapi import FastAPI, BackgroundTasks
import requests
import json
import time
import asyncio
from kafka import KafkaProducer
from kafka import KafkaConsumer
import threading

#==================================Send Data to Kafka===(Mayank)========================================#

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# Create FastAPI app
app = FastAPI()

# Create the ASGI application by mounting the Socket.IO app and the FastAPI app
socket_app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=app,
    socketio_path='socket.io'
)

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



producer = KafkaProducer(
    bootstrap_servers='192.168.1.133:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

API_KEY = '959e8b3d77615bcdb1659ff5bd74e791'
CITY = 'Goa'
URL = f'https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric'

async def fetch_and_send():
    while True:
        try:
            response = requests.get(URL)
            data = response.json()
            temp = data['main']['temp']

            if temp > 20.0:
                print(f"[✔] Temp is {temp}°C > 20°C — sending to Kafka")
                producer.send('weather_alerts', data)
            else:
                print(f"[ ] Temp is {temp}°C ≤ 20°C — not sending")

        except Exception as e:
            print("Error:", e)
        await asyncio.sleep(120)  # 2 minutes

@app.on_event("startup")
async def start_background_task():
    asyncio.create_task(fetch_and_send())
    
    
#============================ MAYANK =========================================================================#
"""" Note:- *This command should always remain at the end. Any new code must be added above it.* """

""" Run the FastAPI Project
1. Navigate to the project directory:
cd Spero-DMS\DMS_goa\DMS_fastapi_service

2. Run the FastAPI server:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload """



# ------------------------------------------------------------------------------------------------------------#

from fastapi import FastAPI
from websocket_router import router as websocket_router

app = FastAPI()
app.include_router(websocket_router)