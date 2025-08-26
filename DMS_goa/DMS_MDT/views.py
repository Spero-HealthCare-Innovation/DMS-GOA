from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *  
from .models import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework import status
from rest_framework.decorators import api_view
from django.utils import timezone
from admin_web.models import *

class Register_veh(APIView):
    def post(self, request):
        data=UserRegistrationSerializer(data=request.data)
        if data.is_valid():
            data.save()
            return Response(data.data)
        return Response(data.errors)
    
class VehicleLogin(APIView):
    def post(self, request):
        print('one')
        vehiseri={
            "veh_number" : request.data.get('vehicleNumber'),
            "veh_default_mobile" : request.data.get('password')
        }
        print('on2e')
        lat = request.data.get('lat')
        long = request.data.get('lng')
        
        # vehicle_serializer = vehicleserializer(data=vehiseri)
        # if not vehicle_serializer.is_valid():
        #     return Response(vehicle_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        print('12')
        veh_number = request.data.get('vehicleNumber')
        password = request.data.get('password')
        employee_ids = list(request.data.get('pilotid').replace('[','').replace(']','').replace(',',''))
        # print(employee_ids, 'ids')
        employee_photo = request.FILES.getlist('photo')
        # print(employee_photo, 'photos')
        user = authenticate(user_username=veh_number, password=password)
        if not user:
            return Response({'status': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        user_obj = DMS_User.objects.filter(user_username=veh_number, user_is_deleted=False).last()
        if not user_obj:
            return Response({'status': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if user_obj.user_is_login:
            return Response({'status': 'User already logged in'}, status=status.HTTP_200_OK)
        vehicle_obj = Vehical.objects.filter(user=user_obj).last()
        if not vehicle_obj:
            return Response({'status': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)
        active_employees = employee_clockin_info.objects.filter(emp_id__in=employee_ids, clock_out_in_status =1,status=1)
        if active_employees.exists():
            conflict_messages = [
                f"Employee '{e.emp_id.emp_name}' is already logged in on vehicle '{e.veh_id.veh_number}'"
                for e in active_employees
            ]
            return Response(conflict_messages, status=status.HTTP_400_BAD_REQUEST)
        # emp_data = [{'emp_clockin_time': now(),'emp_id': emp_id,'veh_id': vehicle_obj.veh_id} for emp_id in employee_ids]
        emp_data = [{'emp_clockin_time': timezone.now(),'emp_id': emp_id,'veh_id': vehicle_obj.veh_id, 'emp_image':emp_image} for emp_id, emp_image in zip(employee_ids,employee_photo)]
        # print(emp_data, 'datas')
        emp_serializer = emp_clockin_serializer(data=emp_data, many=True)
        if not emp_serializer.is_valid():
            return Response(emp_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        emp_serializer.save()
        user_obj.user_is_login = True
        user_obj.save()
        previous_sessions = vehicle_login_info.objects.filter(veh_id=vehicle_obj.veh_id, status=1)
        for session in previous_sessions:
            session.status = 2
            session.veh_logout_time = timezone.now()
            session.save()
        login_data = {
            'veh_login_time': timezone.now(),
            'veh_id': vehicle_obj.veh_id,
            'latitude':lat,
            'longitude':long,
        }
        print(login_data)
        login_serializer = vehi_login_info_serializer(data=login_data)
        if not login_serializer.is_valid():
            return Response(login_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        login_serializer.save()
        token = RefreshToken.for_user(user)
        return Response({'refresh': str(token),'access': str(token.access_token)}, status=status.HTTP_200_OK)
    
class VehicleLogout(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        veh_number = request.data.get('veh_number')
        user_obj = DMS_User.objects.filter(user_username=veh_number).last()
        if not user_obj:
            return Response({'status': 'User does not exist'}, status=404)
        if not user_obj.user_is_login:
            return Response({'status': 'User already logged out'}, status=200)
        try:
            token_obj = RefreshToken(refresh_token)
            token_obj.blacklist()
        except TokenError:
            return Response({'status': 'Invalid or expired refresh token'}, status=400)
        vehicle_obj = Vehical.objects.filter(veh_number=veh_number).last()
        if not vehicle_obj:
            return Response({'status': 'Vehicle not found'}, status=404)
        active_vehicle_sessions = vehicle_login_info.objects.filter(veh_id=vehicle_obj.veh_id, status=1)
        for session in active_vehicle_sessions:
            session.clock_out_in_status = 2
            session.veh_logout_time = timezone.now()
            session.save()
        active_employee_sessions = employee_clockin_info.objects.filter(veh_id=vehicle_obj.veh_id, clock_out_in_status=1, status=1)
        for emp in active_employee_sessions:
            emp.clock_out_in_status = 2
            emp.emp_clockout_time = timezone.now()
            emp.save()
        user_obj.user_is_login = False
        user_obj.save()

        return Response({'status': 'User logged out successfully'}, status=200)
        
class employee_list(APIView):
    def get(self,request):
        user = DMS_Employee.objects.filter(emp_is_deleted=False)
        return Response('done')
    
class add_device(APIView):
    def post(self,request):
        device = add_device_serializer(data=request.data)
        if device.is_valid():
            return Response(device.data, status=status.HTTP_201_CREATED)
        else:
            return Response (device.errors, status=status.HTTP_400_BAD_REQUEST)
        
class get_base_location_vehicle(APIView):
    def get(self, request):
        veh_base = Vehical_base_location.objects.filter(status=1)
        veh_base_serializer = base_location_vehicle_serializer(veh_base, many=True)
        return Response(veh_base_serializer.data, status=status.HTTP_200_OK)
    
class get_vehicle(APIView):
    def get(self, request):
        veh_base_location = request.GET.get("veh_base_loc")
        responder = request.GET.get("responder")

        veh = Vehical.objects.filter(status=1)

        if veh_base_location:
            veh = veh.filter(veh_base_location=veh_base_location)

        if responder:
            veh = veh.filter(responder=responder)

        veh_serializer = vehicle_serializer(veh, many=True)
        return Response(veh_serializer.data, status=status.HTTP_200_OK)

    
    
class emp_clockinout(APIView):
    def post(self, request):
        data={}
        # request.data['latitude']=request.data.pop('lat')
        # request.data['longitude']=request.data.pop('lng')
        # data['veh_login_time']=request.data.get('veh_login_time')
        # data['veh_logout_time']=request.data.get('veh_logout_time')
        # data['veh_login_time']=request.data.get('clockTime') if request.data.get('clockTime')=='in' else data['veh_logout_time']=request.data.get('veh_logout_time') if request.data.get('clock_out_in_status') else None
        if request.data.get('clockTime') == 'in':
            data['veh_login_time'] = request.data.get('clockTime')
        elif request.data.get('clock_out_in_status'):
            data['veh_logout_time'] = request.data.get('veh_logout_time')
        else:
            data['veh_logout_time'] = None
 
        data['veh_id']=Vehical.objects.filter(veh_number=request.data.get('vehicleNumber')).last().veh_id if request.data.get('vehicleNumber') else None
        data['latitude']=request.data.get('lat')
        data['longitude']=request.data.get('lng')
        data['device_id']=request.data.get('device_id')
        employee = emp_clockin_serializer(data=data)
        if employee.is_valid():
            employee.save()
            return Response(employee.data, status=status.HTTP_201_CREATED)
        return Response(employee.errors, status=status.HTTP_400_BAD_REQUEST)

class Vehical_department_wise(APIView):
    def get(self, request):
        # vehicle_number = request.data.get('vehicleNumber')
        vehicle_responder = request.data.get('responder')
        inc_veh = Vehical.objects.filter(dep_id=vehicle_responder,status=1)
        vehicles = Vehical_department_wise_serializer(inc_veh, many=True)
        return Response({'data':vehicles.data})
 

# vehicleNumber:MH-14-CL-0463
# userId:297
# lat:18.595993
# lng:73.7587962
# clockTime:2025-05-22 14:32:19
# clock_out_in_status:in

@api_view(["POST"])
def update_pcr_report(request):
    data = request.data

    inc_id = data.get("inc_id")
    status_code = int(data.get("status"))
    ambulance_no = data.get("ambulance_no")
    lat = data.get("lat")
    lng = data.get("lng")
    at_scene_remark = data.get("at_scene_remark")
    from_scene_remark = data.get("from_scene_remark")
    at_scene_photo = request.FILES.get("at_scene_photo")
    from_scene_photo = request.FILES.get("from_scene_photo")

    try:
        # ✅ record get or create (based on incident id)
        report, created = PcrReport.objects.get_or_create(
            incident_id=inc_id,
            defaults={"pcr_id": inc_id, "amb_no": ambulance_no}
        )

        report.status = status_code
        report.amb_no = ambulance_no

        # ✅ Enum wise updates
        if status_code == PcrStatusEnum.Acknowledge.value:
            report.acknowledge_time = timezone.now()
            report.acknowledge_lat = lat
            report.acknowledge_lng = lng

        elif status_code == PcrStatusEnum.StartedFromBase.value:
            report.start_from_base_time = timezone.now()
            report.start_fr_bs_loc_lat = lat
            report.start_fr_bs_loc_lng = lng

        elif status_code == PcrStatusEnum.AtScene.value:
            report.at_scene_time = timezone.now()
            report.at_scene_lat = lat
            report.at_scene_lng = lng
            if at_scene_remark:
                report.at_scene_remark = at_scene_remark
            if at_scene_photo:
                report.at_scene_photo = at_scene_photo

        elif status_code == PcrStatusEnum.DepartedFromScene.value:
            report.from_scene_time = timezone.now()
            report.from_scene_lat = lat
            report.from_scene_lng = lng
            if from_scene_remark:
                report.from_scene_remark = from_scene_remark
            if from_scene_photo:
                report.from_scene_photo = from_scene_photo

        elif status_code == PcrStatusEnum.BackToBase.value:
            report.back_to_base_time = timezone.now()
            report.back_to_bs_loc_lat = lat
            report.back_to_bs_loc_lng = lng

        elif status_code == PcrStatusEnum.Abandoned.value:
            report.abandoned_time = timezone.now()
            report.abandoned_lat = lat
            report.abandoned_lng = lng

        # ✅ Extra handling for incident_vehicles
        if status_code == 1:  # Acknowledge
            incident_vehicles.objects.filter(incident_id=inc_id).update(pcr_status=2)

        elif status_code == 6:  # Back to Base
            incident_vehicles.objects.filter(incident_id=inc_id).update(pcr_status=3)

        report.save()

        return Response(
            {"message": "PCR Report updated successfully", "status": "success"},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"message": f"Error: {str(e)}", "status": "failed"},
            status=status.HTTP_400_BAD_REQUEST
        )



class get_assign_inc_calls(APIView):
    def get(self, request):
        user_id = request.GET.get("userId")
        inc_veh = incident_vehicles.objects.filter(veh_id__user = user_id, status=1)
        inc_veh_serializer = incident_veh_serializer(inc_veh, many=True)
        return Response(inc_veh_serializer.data, status=status.HTTP_200_OK)
