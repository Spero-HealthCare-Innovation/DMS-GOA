from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# from .permissions import IsAdmin, IsManager, IsERO
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from .serializers import *
from rest_framework import status
from admin_web.renders import UserRenderer
from django.contrib.auth import authenticate
from captcha.models import CaptchaStore
from captcha.helpers import captcha_image_url
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail

class DMS_department_post_api(APIView):
    def post(self,request):
        data = request.data
        dep_name = data.get('dep_name')


        if DMS_Department.objects.filter(dep_name=dep_name).exists():
            return Response(
                {"detail": "Department with this dep_name already exists."},
                status=status.HTTP_409_CONFLICT
            )

        serializers=DMS_department_serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST) 

class DMS_department_put_api(APIView):
    def get(self, request, dep_id):
        snippet = DMS_Department.objects.filter(dep_id=dep_id,dep_is_deleted=False)
        serializers = DMS_department_serializer(snippet, many=True)
        return Response(serializers.data)

    def put(self, request, dep_id):
        try:
            instance = DMS_Department.objects.get(dep_id=dep_id)
        except DMS_Department.DoesNotExist:
            return Response({"error": "Department not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DMS_department_serializer(instance, data=request.data, partial=True)  # partial=True allows partial updates

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DMS_department_delete_api(APIView):
    def get(self, request, dep_id):
        try:
            instance = DMS_Department.objects.get(dep_id=dep_id, dep_is_deleted=False)
        except DMS_Department.DoesNotExist:
            return Response({"error": "Department not found or already deleted."}, status=status.HTTP_404_NOT_FOUND)
        serializer = DMS_department_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, dep_id):
        try:
            instance = DMS_Department.objects.get(dep_id=dep_id, dep_is_deleted=False)
        except DMS_Department.DoesNotExist:
            return Response({"error": "Department not found or already deleted."}, status=status.HTTP_404_NOT_FOUND)

        instance.dep_is_deleted = True
        instance.save()
        return Response({"message": "Department soft deleted successfully."}, status=status.HTTP_200_OK)


class DMS_Group_post_api(APIView):
    def post(self,request):
        data = request.data
        grp_name = data.get('grp_name')


        if DMS_Group.objects.filter(grp_name=grp_name).exists():
            return Response(
                {"detail": "Group with this grp_name already exists."},
                status=status.HTTP_409_CONFLICT
            )


        serializers=DMS_Group_serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST) 

class DMS_Group_put_api(APIView):
    def get(self, request, grp_id):
        snippet = DMS_Group.objects.filter(grp_id=grp_id,grp_is_deleted=False)
        serializers = DMS_Group_serializer(snippet, many=True)
        return Response(serializers.data)

    def put(self, request, grp_id):
        try:
            instance = DMS_Group.objects.get(grp_id=grp_id)
        except DMS_Group.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DMS_Group_serializer(instance, data=request.data, partial=True)  # partial=True allows partial updates

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DMS_Group_delete_api(APIView):
    def get(self, request, grp_id):
        try:
            instance = DMS_Group.objects.get(grp_id=grp_id, grp_is_deleted=False)
        except DMS_Group.DoesNotExist:
            return Response({"error": "Group not found or already deleted."}, status=status.HTTP_404_NOT_FOUND)
        serializer = DMS_Group_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, grp_id):
        try:
            instance = DMS_Group.objects.get(grp_id=grp_id, grp_is_deleted=False)
        except DMS_Group.DoesNotExist:
            return Response({"error": "Group not found or already deleted."}, status=status.HTTP_404_NOT_FOUND)

        instance.grp_is_deleted = True
        instance.save()
        return Response({"message": "Group soft deleted successfully."}, status=status.HTTP_200_OK)

class DMS_Employee_get_api(APIView):
    def get(self,request):
        snippet = DMS_Employee.objects.filter(emp_is_deleted=False)
        serializers = DMS_Employee_GET_serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class DMS_Employee_post_api(APIView):
    def post(self,request):
        data = request.data
        emp_name = data.get('emp_name')


        if DMS_Employee.objects.filter(emp_name=emp_name).exists():
            return Response(
                {"detail": "Employee with this emp_name already exists."},
                status=status.HTTP_409_CONFLICT
            )
        serializers=DMS_Employee_serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST) 

class DMS_Employee_put_api(APIView):
    def get(self, request, emp_id):
        snippet = DMS_Employee.objects.filter(emp_id=emp_id,emp_is_deleted=False)
        serializers = DMS_Employee_GET_serializer(snippet, many=True)
        return Response(serializers.data)

    def put(self, request, emp_id):
        try:
            instance = DMS_Employee.objects.get(emp_id=emp_id)
        except DMS_Employee.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DMS_Employee_serializer(instance, data=request.data, partial=True)  # partial=True allows partial updates

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DMS_Employee_delete_api(APIView):
    def get(self, request, emp_id):
        try:
            instance = DMS_Employee.objects.get(emp_id=emp_id, emp_is_deleted=False)
        except DMS_Employee.DoesNotExist:
            return Response({"error": "Employee not found or already deleted."}, status=status.HTTP_404_NOT_FOUND)
        serializer = DMS_Employee_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, emp_id):
        try:
            instance = DMS_Employee.objects.get(emp_id=emp_id, emp_is_deleted=False)
        except DMS_Employee.DoesNotExist:
            return Response({"error": "Employee not found or already deleted."}, status=status.HTTP_404_NOT_FOUND)

        instance.emp_is_deleted = True
        instance.save()
        return Response({"message": "Employee soft deleted successfully."}, status=status.HTTP_200_OK)

 
class DMS_state_get_api(APIView):
    
    def get(self,request):
        snippet = DMS_State.objects.filter(state_is_deleted=False)
        serializers = DMS_State_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class DMS_state_idwise_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,state_id):
        snippet = DMS_State.objects.filter(state_id=state_id,state_is_deleted=False)
        serializers = DMS_State_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class DMS_district_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = DMS_District.objects.filter(dis_is_deleted=False)
        serializers = DMS_District_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class DMS_district_idwise_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,dis_id):
        snippet = DMS_District.objects.filter(dis_id=dis_id,dis_is_deleted=False)
        serializers = DMS_District_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class DMS_Tahsil_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = DMS_Tahsil.objects.filter(tah_is_deleted=False)
        serializers = DMS_Tahsil_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)   


class DMS_Tahsil_idwise_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,tah_id):
        snippet = DMS_Tahsil.objects.filter(tah_id=tah_id,tah_is_deleted=False)
        serializers = DMS_Tahsil_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class DMS_City_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = DMS_City.objects.filter(cit_is_deleted=False)
        serializers = DMS_City_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class DMS_City_idwise_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,cit_id):
        snippet = DMS_City.objects.filter(cit_id=cit_id,cit_is_deleted=False)
        serializers = DMS_City_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class DMS_Group_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = DMS_Group.objects.filter(grp_is_deleted=False)
        serializers = DMS_Group_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class DMS_Group_idwise_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,grp_id):
        snippet = DMS_Group.objects.filter(grp_id=grp_id,grp_is_deleted=False)
        serializers = DMS_Group_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class DMS_Department_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = DMS_Department.objects.filter(dep_is_deleted=False)
        serializers = DMS_Department_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class DMS_Department_idwise_get_api(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,dep_id):
        snippet = DMS_Department.objects.filter(dep_id=dep_id,dep_is_deleted=False)
        serializers = DMS_Department_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
 


# class CaptchaTokenObtainPairView(TokenObtainPairView):
#     serializer_class = CaptchaTokenObtainPairSerializer


class CaptchaAPIView(APIView):
    def get(self, request):
        new_captcha = CaptchaStore.generate_key()
        image_url = captcha_image_url(new_captcha)
        return Response({
            'captcha_key': new_captcha,
            'captcha_image_url': image_url,
        })



def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    group = str(user.grp_id)
    print("group---", group)
    permissions_data = []
    # if group:
    #         incs= DMS_Group.objects.get(grp_id=group)
    #         pers = DMS_Permission.objects.filter(grp_id=group)
    #         group = incs.grp_name
    #         for permission in pers:
    #             permission_info = {
    #                 'modules_submodule': permission.mod_submod_per,
    #                 'permission_status': permission.per_is_deleted,
    #                 # 'source_id': permission.source.source_pk_id,
    #                 # 'source_name': permission.source.source,  
    #                 'group_id': permission.grp_id.grp_id,
    #                 'group_name': permission.grp_id.grp_name,  
    # }   
    #             permissions_data.append(permission_info)
    # else:
    #     group = None
            
    return {
        "refresh" : str(refresh),
        "access" : str(refresh.access_token),
        # "permissions": permissions_data,
        "colleague": {
                'id': user.emp_id,
                'emp_name': user.emp_name,
                'email': user.emp_email,
                'phone_no': user.emp_contact_no,
                'user_group': group,
            },
        "user_group" :group,
    } 


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        # Validate using the CAPTCHA + credential serializer
        serializer1 = CaptchaTokenObtainPairSerializer(data=request.data)
        serializer1.is_valid(raise_exception=True)


        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            emp_username = serializer.data.get('emp_username')
            password = serializer.data.get('password')
            print("=========", emp_username, password)
            user = authenticate(emp_username=emp_username, password=password)
            print("user--", user)
            if user is not None:
                emp = DMS_Employee.objects.get(emp_username=user.emp_username)
                if emp.emp_is_deleted != False:
                    return Response({'msg':'Login access denied. Please check your permissions or reach out to support for help.'},status=status.HTTP_401_UNAUTHORIZED)
                if emp.emp_is_login is False: 
                    # emp.emp_is_login = True
                    # emp.save()
                    token = get_tokens_for_user(user)
                    return Response({'token':token,'msg':'Logged in Successfully'},status=status.HTTP_200_OK)
                else:
                    return Response({'msg':'User Already Logged In. Please check.'},status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors':['UserId or Password is not valid']}},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Only logged-in users can log out

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # Blacklist the token
                return Response({"message": "Logged out successfully"}, status=200)
            return Response({"error": "Refresh token is required"}, status=400)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=400)
        
        
class CombinedAPIView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        permission_modules = DMS_Module.objects.filter()
        modules_serializer = Mmoduleserializer(permission_modules, many=True)

        permission_objects = DMS_SubModule.objects.filter()
        permission_serializer = permission_sub_Serializer(permission_objects, many=True)

        
        combined_data = []
        for module_data in modules_serializer.data:
            module_id = module_data["mod_id"]
            module_name = module_data["mod_name"]
            group_id = module_data["mod_group_id"]
            group_name = module_data["grp_name"]
            

            submodules = [submodule for submodule in permission_serializer.data if submodule["mod_id"] == module_id]

            formatted_data = {
                "group_id": group_id,
                "group_name": group_name,
                "module_id": module_id,
                "name": module_name,
                "submodules": submodules
            }

            combined_data.append(formatted_data)

        final_data = combined_data

        return Response(final_data)


    
    
class DMS_Group_put_api(APIView):
    def get(self, request, grp_id):
        snippet = DMS_Group.objects.filter(grp_id=grp_id,grp_is_deleted=False)
        serializers = DMS_Group_Serializer(snippet, many=True)
        return Response(serializers.data)

    def put(self, request, grp_id):
        try:
            instance = DMS_Group.objects.get(grp_id=grp_id)
        except DMS_Group.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DMS_Group_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DMS_ChangePassword_put_api(APIView):
    def get(self, request, emp_id):
        snippet = DMS_Employee.objects.filter(emp_id=emp_id,emp_is_deleted=False)
        serializers = ChangePasswordGetSerializer(snippet, many=True)
        return Response(serializers.data)

    def put(self, request, emp_id):
        try:
            instance = DMS_Employee.objects.get(emp_id=emp_id)
        except DMS_Employee.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ChangePasswordputSerializer(instance, data=request.data, partial=True)  # partial=True allows partial updates


        plain_password = request.data['password']
        hashed_password = make_password(plain_password)
        print("++++++++", hashed_password, plain_password)
        request.data['password'] = hashed_password
        request.data['password2'] = hashed_password
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DMS_ChangePassword_api(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("here--------------------")
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = DMS_Employee.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
            # Or send as POST URL: /api/accounts/reset-confirm/{uid}/{token}/

            send_mail(
                "Password Reset",
                f"Click the link to reset your password: {reset_link}",
                "noreply@yourapp.com",
                [email],
                fail_silently=False,
            )
            return Response({"detail": "Password reset link sent."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# accounts/views.py
class PasswordResetConfirmView(APIView):
    def post(self, request, uid, token):
        data = {
            "uid": uid,
            "token": token,
            "new_password": request.data.get("new_password"),
        }
        serializer = PasswordResetConfirmSerializer(data=data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password has been reset successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DMS_Sop_get_api(APIView):
    def get(self,request):
        snippet = DMS_SOP.objects.all()
        serializers = SopSerializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class DMS_Sop_post_api(APIView):
    def post(self,request):
        serializers=SopSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)

class DMS_Sop_put_api(APIView):
    def get(self, request, sop_id):
        snippet = DMS_SOP.objects.filter(sop_id=sop_id)
        serializers = SopSerializer(snippet, many=True)
        return Response(serializers.data)

    def put(self, request, sop_id):
        try:
            instance = DMS_SOP.objects.get(sop_id=sop_id)
        except DMS_SOP.DoesNotExist:
            return Response({"error": "Sop not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SopSerializer(instance, data=request.data, partial=True)  # partial=True allows partial updates

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
class DMS_Sop_delete_api(APIView):
    def get(self, request, sop_id):
        try:
            instance = DMS_SOP.objects.get(sop_id=sop_id, sop_is_deleted=False)
        except DMS_SOP.DoesNotExist:
            return Response({"error": "Sop not found or already deleted."}, status=status.HTTP_404_NOT_FOUND)
        serializer = SopSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, sop_id):
        try:
            instance = DMS_SOP.objects.get(sop_id=sop_id, sop_is_deleted=False)
        except DMS_SOP.DoesNotExist:
            return Response({"error": "Sop not found or already deleted."}, status=status.HTTP_404_NOT_FOUND)

        instance.sop_is_deleted = True
        instance.save()
        return Response({"message": "Sop soft deleted successfully."}, status=status.HTTP_200_OK)

 
class DMS_Disaster_Type_Get_API(APIView):
    def get(self,request):
        snippet = DMS_Disaster_Type.objects.filter(disaster_is_deleted=False)
        serializers = DMS_Disaster_Type_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class DMS_Disaster_Type_Idwise_Get_API(APIView):
    def get(self,request,disaster_id):
        snippet = DMS_Disaster_Type.objects.filter(disaster_is_deleted=False,disaster_id=disaster_id)
        serializers = DMS_Disaster_Type_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    

class DMS_Alert_idwise_get_api(APIView):
    def get(self,request):
        alert_id = request.GET.get('id')
        alert_obj = Weather_alerts.objects.get(pk_id=alert_id)
        alert_obj.triger_status = 2
        alert_obj.save()
        serializers = WeatherAlertSerializer(alert_obj,many=False)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class DMS_Incident_Post_api(APIView):
    def post(self,request):
        serializers=Incident_Serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)


class DMS_Comments_Post_api(APIView):
    def post(self,request):
        serializers=Comments_Serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)

class alerts_get_api(APIView):
    def get(self, request, disaster_id):
        sop_responses = DMS_SOP.objects.filter(disaster_id=disaster_id)
        sop_serializer = Sop_Response_Procedure_Serializer(sop_responses, many=True)
        return Response(sop_serializer.data, status=status.HTTP_200_OK)
