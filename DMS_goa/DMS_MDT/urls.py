from django.urls import path
from .views import *


urlpatterns = [
    path('Register_veh/', Register_veh.as_view()),
    # path('logout/', VehicleLogoutView.as_view()),
]
