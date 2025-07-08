from django.urls import path
from .views import *


urlpatterns = [
    path('Register_veh/', Register_veh.as_view()),
    path('VehicleLogin/', VehicleLogin.as_view()),
    path('VehicleLogout/', VehicleLogout.as_view()),
]
