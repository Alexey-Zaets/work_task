FROM python:3.7.0

# set up usefull staff
RUN apt-get update
RUN apt-get install -y curl coreutils wget net-tools htop iotop less iputils-ping

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

WORKDIR /usr/src/app
ADD . /usr/src/app/

RUN pip install -r requirements/requirements.txt

# RUN chmod +x  /usr/src/app/docker_entrypoint.sh
# ENTRYPOINT /usr/src/app/docker_entrypoint.sh
# RUN python webblog/manage.py collectstatic --noinput

EXPOSE 80
