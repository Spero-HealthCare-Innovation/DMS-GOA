from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from .serializers import *  
from rest_framework_simplejwt.tokens import RefreshToken

# class register_veh(APIView):
#     def post(self, request):
#         user = request.data.get('veh_number')
#         password = request.data.get('password')
#         data=UserCreateSerializer(data=)
#             # return Response(data.data)
#         return Response(data.errors)
class Register_veh(APIView):
    def post(self, request):
        serializers = userRegister(data=request.data)
        if serializers.is_valid():
            user=serializers.save()
            refresh=RefreshToken.for_user(user)
            data = {'refresh token':str(refresh), 'access token': str(refresh.access_token), 'data':serializers.data}
            return Response(data)
        else: 
            return Response({'status':'something went wrong'})