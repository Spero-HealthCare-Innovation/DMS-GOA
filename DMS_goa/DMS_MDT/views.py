from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password

class login_veh(APIView):
    def post(self, request):
        hashs = make_password('this is my passwoed')
        print(hashs)
        is_valid = check_password("this is my passwoed", hashs)
        print(is_valid)
        return Response(hashs)