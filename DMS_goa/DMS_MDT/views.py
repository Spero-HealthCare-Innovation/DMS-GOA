from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from .serializers import *  

# class login_veh(APIView):
#     def post(self, request):
#         pass

