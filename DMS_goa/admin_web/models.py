from django.db import models
from django.contrib.auth.models import(
	BaseUserManager,AbstractBaseUser
)

class DMS_State(models.Model):
    state_id = models.AutoField(primary_key=True)
    state_name = models.CharField(max_length=255)
    state_is_deleted = models.BooleanField(default=False)
    state_added_by = models.CharField(max_length=255, null=True, blank=True)
    state_added_date = models.DateTimeField(auto_now=True)
    state_modified_by = models.CharField(max_length=255, null=True, blank=True)
    state_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)

class DMS_District(models.Model):
    dis_id = models.AutoField(primary_key=True)
    state_id = models.ForeignKey(DMS_State, on_delete=models.CASCADE)
    dis_name = models.CharField(max_length=255)
    dis_is_deleted = models.BooleanField(default=False)
    dis_added_by = models.CharField(max_length=255, null=True, blank=True)
    dis_added_date = models.DateTimeField(auto_now=True,)
    dis_modified_by = models.CharField(max_length=255, null=True, blank=True)
    dis_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)

class DMS_Tahsil(models.Model):
    tah_id = models.AutoField(primary_key=True)
    dis_id = models.ForeignKey(DMS_District, on_delete=models.CASCADE)
    tah_name = models.CharField(max_length=255)
    tah_is_deleted = models.BooleanField(default=False)
    tah_added_by = models.CharField(max_length=255, null=True, blank=True)
    tah_added_date = models.DateTimeField(auto_now=True,)
    tah_modified_by = models.CharField(max_length=255, null=True, blank=True)
    tah_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)

class DMS_City(models.Model):
    cit_id = models.AutoField(primary_key=True)
    tah_id = models.ForeignKey(DMS_Tahsil, on_delete=models.CASCADE)
    cit_name = models.CharField(max_length=255)
    cit_is_deleted = models.BooleanField(default=False)
    cit_added_by = models.CharField(max_length=255, null=True, blank=True)
    cit_added_date = models.DateTimeField(auto_now=True,)
    cit_modified_by = models.CharField(max_length=255, null=True, blank=True)
    cit_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)

class DMS_Department(models.Model):
    dep_id = models.AutoField(primary_key=True)
    dep_name = models.CharField(max_length=255)
    dep_is_central = models.BooleanField(default=False)
    state_id = models.ForeignKey(DMS_State, on_delete=models.CASCADE)
    dis_id = models.ForeignKey(DMS_District, on_delete=models.CASCADE)
    tah_id = models.ForeignKey(DMS_Tahsil, on_delete=models.CASCADE)
    cit_id = models.ForeignKey(DMS_City, on_delete=models.CASCADE)
    dep_is_deleted = models.BooleanField(default=False)
    dep_added_by = models.CharField(max_length=255, null=True, blank=True)
    dep_added_date = models.DateTimeField(auto_now=True)
    dep_modified_by = models.CharField(max_length=255, null=True, blank=True)
    dep_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)
    

class DMS_Group(models.Model):
    grp_id = models.AutoField(primary_key=True)
    grp_code = models.CharField(max_length=100)
    permission_status = models.IntegerField(null=True, blank=True)
    grp_name = models.CharField(max_length=255)
    grp_is_deleted = models.BooleanField(default=False)
    grp_added_date = models.DateTimeField(auto_now=True)
    grp_added_by = models.CharField(max_length=255, null=True, blank=True)
    grp_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)
    grp_modified_by = models.CharField(max_length=255, null=True, blank=True)
    

class DMS_Module(models.Model):
    mod_id = models.AutoField(primary_key=True)
    mod_code = models.CharField(max_length=100)
    mod_name = models.CharField(max_length=255)
    mod_group_id = models.ForeignKey(DMS_Group, on_delete=models.CASCADE)
    mod_is_deleted = models.BooleanField(default=False)
    mod_added_date = models.DateTimeField(auto_now=True)
    mod_added_by = models.CharField(max_length=255, null=True, blank=True)
    mod_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)
    mod_modified_by = models.CharField(max_length=255, null=True, blank=True)
    

class DMS_SubModule(models.Model):
    sub_mod_id = models.AutoField(primary_key=True)
    mod_id = models.ForeignKey(DMS_Module, on_delete=models.CASCADE)
    sub_mod_name = models.CharField(max_length=255)
    sub_mod_is_deleted = models.BooleanField(default=False)
    sub_mod_added_date = models.DateTimeField(auto_now=True)
    sub_mod_added_by = models.CharField(max_length=255, null=True, blank=True)
    sub_mod_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)
    sub_mod_modified_by = models.CharField(max_length=255, null=True, blank=True)

class DMS_Action(models.Model):
    ac_id = models.AutoField(primary_key=True)
    ac_name = models.CharField(max_length=255)
    sub_mod_id = models.ForeignKey(DMS_SubModule, on_delete=models.CASCADE)
    ac_is_deleted = models.BooleanField(default=False)
    ac_added_by = models.CharField(max_length=255, null=True, blank=True)
    ac_added_date = models.DateTimeField(auto_now=True)
    ac_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)
    ac_modified_by = models.CharField(max_length=255, null=True, blank=True)

class DMS_Permission(models.Model):
    per_id = models.AutoField(primary_key=True)
    grp_id = models.ForeignKey(DMS_Group, on_delete=models.CASCADE)
    mod_submod_per = models.TextField()  
    screen_no = models.CharField(max_length=100)
    per_is_deleted = models.BooleanField(default=False)
    per_added_date = models.DateTimeField(auto_now=True)
    per_added_by = models.CharField(max_length=255, null=True, blank=True)
    per_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)
    per_modified_by = models.CharField(max_length=255, null=True, blank=True)
    


# Custom User Manager
class DMS_Employee_Manager(BaseUserManager):

    def create_user(self, emp_username, grp_id, emp_name, emp_email, emp_contact_no, emp_dob, emp_doj, emp_is_login, state_id, dist_id, tahsil_id, city_id, emp_is_deleted, emp_added_by, emp_modified_by, password=None, password2=None):

        """
        Creates and saves a User with the given email, name, tc and password.
        """
        if not emp_username:
            raise ValueError('User must have an user id')

        user = self.model(
            emp_email=self.normalize_email(emp_email),
            emp_username = emp_username,
            emp_name = emp_name,
            emp_contact_no = emp_contact_no,
            emp_dob = emp_dob,
            emp_doj = emp_doj,
            emp_is_login = emp_is_login,
            state_id = state_id, 
            dist_id = dist_id,
			tahsil_id = tahsil_id,
            grp_id = grp_id,
            city_id = city_id,
            emp_is_deleted = emp_is_deleted,
            emp_added_by = emp_added_by,
            emp_modified_by = emp_modified_by,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, emp_username, grp_id, emp_name, emp_email, emp_contact_no, emp_dob, emp_doj, emp_is_login, state_id, dist_id, tahsil_id, city_id, emp_is_deleted, emp_added_by, emp_modified_by, password=None):

        """Creates and saves a superuser with the given email, name, tc and password."""
        user = self.create_user(
            password=password,
            emp_email=emp_email,
            emp_username = emp_username,
            emp_name = emp_name,
            emp_contact_no = emp_contact_no,
            emp_dob = emp_dob,
            emp_doj = emp_doj,
            emp_is_login = emp_is_login,
            state_id = state_id, 
            dist_id = dist_id,
			tahsil_id = tahsil_id,
            grp_id = grp_id,
            city_id = city_id,
            emp_is_deleted = emp_is_deleted,
            emp_added_by = emp_added_by,
            emp_modified_by = emp_modified_by,
        )

        user.is_admin = True
        user.save(using=self._db)
        return user



class DMS_Employee(AbstractBaseUser):
    emp_id = models.AutoField(primary_key=True, auto_created=True)
    emp_username = models.CharField(max_length=100,unique=True, null=True, blank=True)
    emp_name = models.CharField(max_length=255, null=True, blank=True)
    emp_contact_no = models.CharField(max_length=15, null=True, blank=True)
    emp_email = models.EmailField(max_length=255,unique=True,null= True,blank=True)
    emp_dob = models.DateField(null=True, blank=True)
    emp_doj = models.DateField(null=True, blank=True)
    emp_is_login = models.BooleanField(default=False, null=True, blank=True)
    # grp_id = models.ForeignKey(DMS_Group,on_delete=models.CASCADE)
    # state_id = models.ForeignKey(DMS_State, on_delete=models.CASCADE)
    # dis_id = models.ForeignKey(DMS_District, on_delete=models.CASCADE)
    # tah_id = models.ForeignKey(DMS_Tahsil, on_delete=models.CASCADE)
    # cit_id = models.ForeignKey(DMS_City, on_delete=models.CASCADE)

    grp_id = models.CharField(max_length=255, null=True, blank=True)
    state_id = models.CharField(max_length=255, null=True, blank=True)
    dist_id = models.CharField(max_length=255, null=True, blank=True)
    tahsil_id = models.CharField(max_length=255, null=True, blank=True)
    city_id = models.CharField(max_length=255, null=True, blank=True)
    is_admin = models.BooleanField(default=False, blank=True)
    emp_is_deleted = models.BooleanField(default=False)
    emp_added_by = models.CharField(max_length=255, null=True, blank=True)
    emp_added_date = models.DateTimeField(auto_now_add=True,null=True)
    emp_modified_by = models.CharField(max_length=255, null=True, blank=True)
    emp_modified_date = models.DateTimeField(auto_now=True,null=True, blank=True)
    emp_plain_password=models.CharField(max_length=255,null=True,blank=True)


    username = None
    email = None

    objects = DMS_Employee_Manager()

    EMAIL_FIELD = 'emp_email'
    GROUP_FIELD = 'grp_id'


    USERNAME_FIELD = 'emp_username'


    REQUIRED_FIELDS = ['grp_id', 'emp_name', 'emp_email', 'emp_contact_no', 'emp_dob', 'emp_doj', 'emp_is_login', 'state_id', 'dist_id', 'tahsil_id', 'city_id', 'emp_is_deleted', 'emp_added_by', 'emp_modified_by']

    def __str__(self):
        return str(self.emp_username)

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


    
class DMS_WebLogin(models.Model):
    log_id = models.AutoField(primary_key=True)
    emp_id = models.ForeignKey(DMS_Employee, on_delete=models.CASCADE)
    emp_login_time = models.DateTimeField(auto_now=True)
    emp_logout_time = models.DateTimeField(null=True, blank=True)
    log_status = models.CharField(max_length=50) 
    log_added_date = models.DateTimeField(auto_now=True)
    log_added_by = models.CharField(max_length=255, null=True, blank=True)
    log_modified_by = models.CharField(max_length=255, null=True, blank=True)




class DMS_Disaster_Type(models.Model):
    disaster_id = models.AutoField(primary_key=True)
    disaster_name = models.CharField(max_length=255)
    disaster_rng_high = models.IntegerField(null=True, blank=True)
    disaster_rng_medium = models.IntegerField(null=True, blank=True)
    disaster_rng_low = models.IntegerField(null=True, blank=True)
    disaster_is_deleted = models.BooleanField(default=False)
    disaster_added_date = models.DateTimeField(auto_now=True,null=True, blank=True)
    disaster_added_by = models.CharField(max_length=255, null=True, blank=True)
    disaster_modified_by = models.CharField(max_length=255, null=True, blank=True)
    disaster_modified_date = models.DateTimeField(null=True, blank=True)



class DMS_Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    dep_id = models.ForeignKey(DMS_Department, on_delete=models.CASCADE)
    grp_id = models.ForeignKey(DMS_Group, on_delete=models.CASCADE)
    role_is_deleted = models.BooleanField(default=False)
    role_added_by = models.CharField(max_length=255, null=True, blank=True)
    role_added_date = models.DateTimeField(auto_now=True)
    role_modified_by = models.CharField(max_length=255, null=True, blank=True)
    role_modified_date = models.DateTimeField(null=True, blank=True)