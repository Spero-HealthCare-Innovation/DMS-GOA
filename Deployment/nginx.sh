#!/bin/bash

NGINX_CONF_PATH="/var/www/html/DMS_goa/"
if [ -f "/etc/nginx/sites-available/dms_django_9001.conf" ]; then
    sudo nginx -t
    echo "nginx conf already present"
else
    echo "Copying Nginx conf dms_django_9001 file..."
    sudo cp -rf  "${NGINX_CONF_PATH}"/Deployment/nginx_proxy/dms_django_9001.conf /etc/nginx/sites-available/dms_django_9001.conf
    chmod 777 /var/www/html/DMS_goa/
    echo "Nginx Conf copied successfully."
    sudo ln -s /etc/nginx/sites-available/dms_django_9001.conf /etc/nginx/sites-enabled
    sudo nginx -t 
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "Nginx has been started"
fi


if [ -f "/etc/nginx/sites-available/dms_goa_react_9002.conf" ]; then
    sudo nginx -t
    echo "nginx conf already present"
else
    echo "Copying Nginx conf dms_goa_react_9002 file..."
    sudo cp -rf  "${NGINX_CONF_PATH}"/Deployment/nginx_proxy/dms_goa_react_9002.conf /etc/nginx/sites-available/dms_goa_react_9002.conf
    chmod 777 /var/www/html/DMS_goa/
    echo "Nginx Conf copied successfully."
    sudo ln -s /etc/nginx/sites-available/dms_goa_react_9002.conf /etc/nginx/sites-enabled
    sudo nginx -t 
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "Nginx has been started"
fi


sudo systemctl status nginx
sudo systemctl restart nginx