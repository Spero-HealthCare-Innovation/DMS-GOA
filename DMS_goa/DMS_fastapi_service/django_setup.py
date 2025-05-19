# import os
# import django

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DMS_goa.settings")
# django.setup()


import os
import sys
import django

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DMS_goa.settings")
django.setup()
