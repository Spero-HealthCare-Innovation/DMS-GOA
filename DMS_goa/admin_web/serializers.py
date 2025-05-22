from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from captcha.models import CaptchaStore
from .models import *

class DMS_department_serializer(serializers.ModelSerializer):
    class Meta:
        model=DMS_Department
        fields='__all__'

class DMS_Group_serializer(serializers.ModelSerializer):
    class Meta:
        model=DMS_Group
        fields='__all__'

class DMS_Employee_serializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    # grp_id = serializers.PrimaryKeyRelatedField(queryset=DMS_Group.objects.all(),many=False)
    
    class Meta:
        model  = DMS_Employee
        fields = ['emp_id', 'emp_username', 'grp_id', 'emp_name', 'emp_email', 'emp_contact_no', 'emp_dob', 'emp_doj', 'emp_is_login', 'state_id', 'dist_id', 'tahsil_id', 'city_id', 'emp_is_deleted', 'emp_added_by', 'emp_modified_by', 'password','password2' ]

        extra_kwargs = {
            'password':{'write_only':True}
        }
        
    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise serializers.ValidationError('Password and Confirm Password does not match')

        return data
    
    def create(self, validated_data):
        group_data = validated_data.pop('grp_id')
        validated_data['grp_id'] = group_data

        # Hash the password before creating the user
        password = validated_data.pop('password')
        user = DMS_Employee.objects.create_user(**validated_data)
        user.set_password(password)  # hashes and sets it correctly
        user.save()
        return user


class DMS_District_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_District
        fields = '__all__'
    
class DMS_Tahsil_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_Tahsil
        fields = '__all__'

class DMS_City_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_City
        fields = '__all__'

class DMS_State_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_State
        fields = '__all__'
        
class DMS_Group_Serializer(serializers.ModelSerializer):
    dep_name = serializers.CharField(source='dep_id.dep_name', read_only=True)
    class Meta:
        model = DMS_Group
        fields = ['grp_id','grp_code','permission_status','grp_name','grp_is_deleted','grp_added_date','grp_added_by','grp_modified_date','grp_modified_by','dep_id','dep_name']
        
class DMS_Department_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_Department
        fields = '__all__'
        
class DMS_Disaster_Type_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_Disaster_Type
        fields = '__all__'
              

# ============= Permission Module Serializer ============================

class Mmoduleserializer(serializers.ModelSerializer):
    #  grp_name = serializers.CharField(source='mod_group_id.grp_name', allow_null=True)
    #  department_id = serializers.CharField(source='mod_group_id.dep_id.dep_id', allow_null=True)
    #  department_name = serializers.CharField(source='mod_group_id.dep_id.dep_name', allow_null=True)

     class Meta:
          model = DMS_Module
          fields = ['mod_id', 'mod_name', 'mod_group_id', 'grp_name']


class permission_sub_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_SubModule
        fields = '__all__'




class CaptchaTokenObtainPairSerializer(TokenObtainPairSerializer):
    captcha_key = serializers.CharField(write_only=True)
    captcha_value = serializers.CharField(write_only=True)

    def validate(self, attrs):
        key = attrs.pop('captcha_key', '')
        value = attrs.pop('captcha_value', '')

        # Validate CAPTCHA
        try:
            captcha = CaptchaStore.objects.get(hashkey=key)
            if captcha.response != value.lower():
                raise serializers.ValidationError("Invalid CAPTCHA.")
            captcha.delete()  # optional: one-time use
        except CaptchaStore.DoesNotExist:
            raise serializers.ValidationError("Invalid CAPTCHA key.")

        return super().validate(attrs)
        

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['group'] = user.grp_id  # Add role to JWT payload
        return token
    

class UserLoginSerializer(serializers.ModelSerializer):
    emp_username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})
    class Meta:
        model = DMS_Employee
        fields = ['emp_username', 'password']


class ChangePasswordGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_Employee
        fields = [ 'emp_id','emp_username','password']

class ChangePasswordputSerializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_Employee
        fields = ['password']

class SopSerializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_SOP
        fields = '__all__'

class WeatherAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weather_alerts
        fields = '__all__'

# class Incident_Serializer(serializers.ModelSerializer):
#     class Meta:
#         model = DMS_Incident
#         fields = '__all__' 


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_Comments
        exclude = ['incident_id','alert_id','comm_modified_by','comm_modified_date']

class Incident_Serializer(serializers.ModelSerializer):
    comments = CommentsSerializer(write_only=True)

    class Meta:
        model = DMS_Incident
        fields = '__all__'  
        extra_fields = ['comments']

    def create(self, validated_data):
        comments_data = validated_data.pop('comments')
        incident = DMS_Incident.objects.create(**validated_data)

        DMS_Comments.objects.create(
            alert_id=incident.alert_id,
            incident_id=incident,
            **comments_data
        )

        return incident

        
class Comments_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DMS_Comments
        fields = '__all__' 
        
        
