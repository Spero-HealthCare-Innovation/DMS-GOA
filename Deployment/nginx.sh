#!/bin/bash

NGINX_CONF_PATH="/var/www/html/DMS_goa/"
if [ -f "/etc/nginx/sites-available/dms_django_6003.conf" ]; then
    sudo nginx -t
    echo "nginx conf already present"
else
    echo "Copying Nginx conf dms_django_6003 file..."
    sudo cp -rf  "${NGINX_CONF_PATH}"/Deployment/nginx_proxy/dms_django_6003.conf /etc/nginx/sites-available/dms_django_6003.conf
    chmod 777 /var/www/html/DMS_goa/
    echo "Nginx Conf copied successfully."
    sudo ln -s /etc/nginx/sites-available/dms_django_6003.conf /etc/nginx/sites-enabled
    sudo nginx -t 
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "Nginx has been started"
fi


if [ -f "/etc/nginx/sites-available/dms_goa_react_7000.conf" ]; then
    sudo nginx -t
    echo "nginx conf already present"
else
    echo "Copying Nginx conf dms_goa_react_7000 file..."
    sudo cp -rf  "${NGINX_CONF_PATH}"/Deployment/nginx_proxy/dms_goa_react_7000.conf /etc/nginx/sites-available/dms_goa_react_7000.conf
    chmod 777 /var/www/html/DMS_goa/
    echo "Nginx Conf copied successfully."
    sudo ln -s /etc/nginx/sites-available/dms_goa_react_7000.conf /etc/nginx/sites-enabled
    sudo nginx -t 
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "Nginx has been started"
fi


sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl restart dms_uvicorn_fastapi
sudo systemctl status dms_gunicorn_django