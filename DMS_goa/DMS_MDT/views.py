from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *  
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

class Register_veh(APIView):
    def post(self, request):
        data=UserRegistrationSerializer(data=request.data)
        if data.is_valid():
            data.save()
            return Response(data.data)
        return Response(data.errors)
    
class VehicleLogin(APIView):
    def post(self, request):
        vehicle = vehicleserializer(data = request.data)
        if vehicle.is_valid():
            user = request.data.get('veh_number')
            password = request.data.get('veh_default_mobile')
            data=authenticate(user_username=user, password=password)
            if data is not None:
                vehi = DMS_User.objects.filter(user_username=user,user_is_deleted=False).last()
                if vehi:
                    if vehi.user_is_login == False:
                        vehi.user_is_login = True
                        vehi.save()
                        token = RefreshToken.for_user(data)
                        print('12')
                        pre = vehicle_login_info.objects.filter(veh_id=vehi.user_id, status=1)
                        print('13')
                        for p in pre:
                            p.status=2
                            p.veh_logout_time = now()
                            p.save()
                        seria = vehi_login_info_serializer(data = {'veh_login_time':now(), 'veh_id':vehi.user_id})
                        if seria.is_valid():
                            # print(seria.data)
                            seria.save()
                            return Response({'refresh':str(token), 'access':str(token.access_token)})
                        else: return Response(seria.errors, status=status.HTTP_400_BAD_REQUEST)
                    else:return Response({"status":'user already login'}, status=status.HTTP_200_OK)
                else:return Response({"status":'user not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(vehicle.errors, status=status.HTTP_400_BAD_REQUEST)
    
class VehicleLogout(APIView):
    def post(self, request):
        token = request.data.get('refresh_token')
        user=request.data.get('veh_number')
        users = DMS_User.objects.filter(user_username=user).last()
        if users:
            if users.user_is_login:
                users.user_is_login=False
                users.save()
                token = RefreshToken(token)
                token.blacklist()
                pre = vehicle_login_info.objects.filter(veh_id=users.user_id, status=1)
                print('13')
                for p in pre:
                    p.status=2
                    p.veh_logout_time = now()
                    p.save()
                return Response({'status' : 'user logout sucessfully'})
            else:
                return Response({'status':'user already logout'})
        else:return Response({'status': 'user is not exist'})
        
class employee_list(APIView):
    def get(self,request):
        # user = DMS_User.objects.filter(user_is_deleted=False, grp_id=)
        pass