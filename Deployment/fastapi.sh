#!/bin/bash

PJ_BASE_PATH="/var/www/html/DMS_goa/Deployment"
# Activate virtual environment
echo "Runining Fastapi Config sh file"
pwd
echo "current dir"

# source vvenv/bin/activate


if [ -d "vvenv" ]; then
    echo "Python virtual environment exists." 
    source vvenv/bin/activate
else
    python3 -m venv vvenv
    echo "Current Directory: $PWD"
    pip install -r requirnment.txt
fi



# Copy Fastapi Gunicorn - Uvicorn not present
if [ -f "/etc/systemd/system/dms_uvicorn_fastapi.service" ]; then
    echo "Fastapi Nginx conf already present"
else
    echo "Copying Fastapi Gunicorn - Uvicorn service file..."
    sudo cp -rf "$PJ_BASE_PATH/gunicorn_proxy/dms_uvicorn_fastapi.service" /etc/systemd/system/
    echo "Fastapi Gunicorn - Uvicorn service copied successfully."

fi


# Copy Fastapi Nginx conf not present
if [ -f "/etc/nginx/sites-available/dms_goa_fastapi_7777.conf" ]; then
    echo "Fastapi Nginx conf already present"
else
    echo "Copying Fastapi Nginx Conf file..."
    sudo cp -rf "$PJ_BASE_PATH/nginx_proxy/dms_goa_fastapi_7777.conf" /etc/nginx/sites-available
    echo "Fastapi Nginx Conf file copied successfully."
    # Enable the site by creating a symlink
    sudo ln -s /etc/nginx/sites-available/dms_goa_fastapi_7777.conf /etc/nginx/sites-enabled/

fi

# Show user and current directory
echo "Current User: $USER"
echo "Current Directory: $PWD"
 
# Reload systemd and restart Gunicorn
sudo systemctl daemon-reload
sudo systemctl enable dms_uvicorn_fastapi
sudo systemctl start dms_uvicorn_fastapi
 
# Check Gunicorn status
sudo systemctl status dms_uvicorn_fastapi
sudo systemctl restart dms_uvicorn_fastapi