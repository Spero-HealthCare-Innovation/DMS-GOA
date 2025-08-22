from django.urls import path
from .views import *


urlpatterns = [
    path('Register_veh/', Register_veh.as_view()),
    path('VehicleLogin/', VehicleLogin.as_view()),
    path('VehicleLogout/', VehicleLogout.as_view()),
    path('employee_list/', employee_list.as_view()),
    path('add_device/', add_device.as_view()),
    path('get_incident_wise_vehicle',get_incident_wise_vehicle.as_view()),
    path('Vehical_department_wise/',Vehical_department_wise.as_view()),
    
]
 