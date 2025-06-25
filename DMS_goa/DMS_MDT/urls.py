from django.urls import path
from .views import *


urlpatterns = [
    path('login/', VehicleLoginView.as_view()),
    path('logout/', VehicleLogoutView.as_view()),
]
