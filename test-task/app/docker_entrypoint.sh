#!/bin/bash

# Collect static files
echo """
*
*
Collect static files
======================================================================
"""
python webblog/manage.py collectstatic --noinput


# Apply database migrations
echo """
*
*
Apply database migrations
======================================================================
"""
python webblog/manage.py makemigrations && webblog/manage.py migrate

# Run Main service
echo """
*
*
Start Gunicorn
======================================================================
"""
gunicorn --config ./gunicorn_config.py webblog.wsgi:application

