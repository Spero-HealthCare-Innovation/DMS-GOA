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

class DMS_department_post_api(APIView):
    def post(self,request):
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

class DMS_Employee_post_api(APIView):
    def post(self,request):
        serializers=DMS_Employee_serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST) 

class DMS_Employee_put_api(APIView):
    def get(self, request, emp_id):
        snippet = DMS_Employee.objects.filter(emp_id=emp_id,emp_is_deleted=False)
        serializers = DMS_Employee_serializer(snippet, many=True)
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

        
        grouped_modules = {}
        for module_data in modules_serializer.data:
            r_m_id = module_data["mod_group_id"]
            if r_m_id not in grouped_modules:
                grouped_modules[r_m_id] = {
                    "department_id": module_data["department_id"],
                    "department_name": module_data["department_name"],
                    "group_id": r_m_id,
                    "group_name": module_data["grp_name"],
                    "modules": []
                }
            grouped_modules[r_m_id]["modules"].append({
                "module_id": module_data["mod_id"],
                "name": module_data["mod_name"],
                "submodules": []
            })

        
        for submodule_data in permission_serializer.data:
            module_id = submodule_data["mod_id"]
            for group_data in grouped_modules.values():
                for module in group_data["modules"]:
                    if module["module_id"] == module_id:
                        module["submodules"].append(submodule_data)

        final_data = list(grouped_modules.values())

        return Response(final_data)

