from rest_framework import serializers
from .models import *
from admin_web.models import *
from django.contrib.auth.hashers import make_password

class vehical_serializer(serializers.ModelSerializer):
    class Meta:
        model = Vehical
        fields = ['veh_id','veh_number','veh_default_mobile']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = DMS_Employee
        fields = ['emp_id', 'emp_username', 'password']

    def create(self, validated_data):
        # Secure password handling
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class userRegister(serializers.ModelSerializer):
    class Meta:
        model = DMS_User
        fields = ['user_id', 'user_username', 'user_contact_no']
        
    def create(self, request):
        request['password'] = make_password('user_contact_no')
        user = DMS_User.objects.create_user(**request)
        user.save()
        return user