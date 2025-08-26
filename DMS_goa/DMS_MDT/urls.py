from django.urls import path
from .views import *


urlpatterns = [
    path('Register_veh/', Register_veh.as_view()),
    path('VehicleLogin/', VehicleLogin.as_view()),
    path('VehicleLogout/', VehicleLogout.as_view()),
    path('employee_list/', employee_list.as_view()),
    path('api/device/', add_device.as_view()),
    path('Vehical_department_wise/',Vehical_department_wise.as_view()),
    path('vehical_base_loc/',get_base_location_vehicle.as_view()),
    path('vehical/',get_vehicle.as_view()),
    path('Spero_DMS/api/listassignincidentcalls/',get_assign_inc_calls.as_view()),
    path("parametersdetails/", update_pcr_report, name="update_pcr_report"),
    
]
 