from rest_framework import serializers
from .models import *

# class vehical_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = Vehical
#         fields = ['veh_id','veh_number','veh_default_mobile']
class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehical
        fields = ['veh_number', 'veh_default_mobile']
    
    def create(self, validated_data):
        print(validated_data['veh_number'])
        print(validated_data['veh_default_mobile'])
        if Vehical.objects.filter(veh_number=validated_data['veh_number']).exists():
            raise serializers.ValidationError("Vehicle with this number already exists.")
        try:
            username = validated_data['veh_number']
            mobile = validated_data['veh_default_mobile']
        except ValueError:
            return serializers.ValidationError("enter proper user name and mobile number")
        if not username: 
            raise serializers.ValidationError("please enter vehicle no")
        if not mobile: 
            raise serializers.ValidationError("please enter vehicle contact number")
        user = DMS_User.objects.create_user(
            user_username=username,
            password=mobile,
            grp_id=1
        )
        print(user.user_id)
        Vehicals = Vehical.objects.create(
            veh_number=username,
            veh_default_mobile=mobile,
            user=user.user_id
            )
        return Vehicals

class vehicleserializer(serializers.ModelSerializer):
    class Meta: 
        model = Vehical
        fields = ['veh_number', 'veh_default_mobile']

class vehi_login_info_serializer(serializers.ModelSerializer):
    class Meta:
        model = vehicle_login_info
        fields = ['veh_login_id','veh_login_time','veh_logout_time','veh_id']