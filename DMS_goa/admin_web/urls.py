from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    #===================================Kirti==================================================
    path('department_post/',DMS_department_post_api.as_view(),name='department_post'),
    path('department_put/<int:dep_id>/',DMS_department_put_api.as_view(),name='department_put'),
    path('department_delete/<int:dep_id>/',DMS_department_delete_api.as_view(),name='department_delete'),


    path('group_post/',DMS_Group_post_api.as_view(),name='group_post'),
    path('group_put/<int:grp_id>/',DMS_Group_put_api.as_view(),name='group_put'),
    path('group_delete/<int:grp_id>/',DMS_Group_delete_api.as_view(),name='group_delete'),


    path('employee_get/',DMS_Employee_get_api.as_view(), name='employee_get'),
    path('employee_post/',DMS_Employee_post_api.as_view(),name='employee_post'),
    path('employee_put/<int:emp_id>/',DMS_Employee_put_api.as_view(),name='employee_put'),
    path('employee_delete/<int:emp_id>/',DMS_Employee_delete_api.as_view(),name='employee_delete'),

    path('employee_changepasswordput/<int:emp_id>/',DMS_ChangePassword_put_api.as_view(),name='employee_put'),

    path('sop_get',DMS_Sop_get_api.as_view(),name='sop_get'),
    path('sop_post',DMS_Sop_post_api.as_view(),name='sop_post'),
    path('sop_put/<int:sop_id>/',DMS_Sop_put_api.as_view(),name='sop_put'),
    path('sop_delete/<int:sop_id>/',DMS_Sop_delete_api.as_view(),name='sop_delete'),
    #===================================Kirti==================================================
    
    
    #===================================Mohin==================================================
    path('state_get/',DMS_state_get_api.as_view(), name='state_get'),
    path('state_get_idwise/<int:state_id>/',DMS_state_idwise_get_api.as_view(), name='state_get_idwise'),
    
    path('district_get/',DMS_district_get_api.as_view(), name='district_get'),
    path('district_get_idwise/<int:dis_id>/',DMS_district_idwise_get_api.as_view(), name='district_get_idwise'),
    
    path('Tahsil_get/',DMS_Tahsil_get_api.as_view(), name='Tahsil_get'),
    path('Tahsil_get_idwise/<int:tah_id>/',DMS_Tahsil_idwise_get_api.as_view(), name='Tahsil_get_idwise'),
    
    path('City_get/',DMS_City_get_api.as_view(), name='City_get'),
    path('City_get_idwise/<int:cit_id>/',DMS_City_idwise_get_api.as_view(), name='City_get'),
    
    path('Group_get/',DMS_Group_get_api.as_view(), name='Group_get'),
    path('Group_get_idwise/<int:grp_id>/',DMS_Group_idwise_get_api.as_view(), name='Group_get_idwise'),
    
    path('Department_get/',DMS_Department_get_api.as_view(), name='Department_get'),
    path('Department_get_idwise/<int:dep_id>/',DMS_Department_idwise_get_api.as_view(), name='Department_get_idwise'),
    
    path('DMS_Disaster_Type_Get/',DMS_Disaster_Type_Get_API.as_view(), name='DMS_Disaster_Type_Get'),
    path('DMS_Disaster_Type_Get_Idwise/<int:disaster_id>/',DMS_Disaster_Type_Idwise_Get_API.as_view(), name='DMS_Disaster_Type_Get_Idwise'),
    
    
    #===================================Mohin==================================================
    


    #=============================== Mayank =========================================================
    path('combined/', CombinedAPIView.as_view(), name='combined-api'),
    #=============================== Mayank =========================================================



    #=============================== Nikita =========================================================
    # path('login/', CustomTokenObtainPairView.as_view(), name='loin'),
    # path('api/token/', CaptchaTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/captcha/', CaptchaAPIView.as_view(), name='get_captcha'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('alert/', DMS_Alert_idwise_get_api.as_view(), name='DMS_Alert_idwise'),
    #=============================== Nikita =========================================================
]
