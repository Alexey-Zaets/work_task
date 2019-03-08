FROM nginx:1.15

RUN apt-get update
RUN apt-get install -y coreutils wget htop iotop less

# set up usefull staff
RUN apt-get update
RUN apt-get install -y curl coreutils wget net-tools htop iotop less iputils-ping
RUN apt-get install -y nginx

# COPY default.conf /etc/nginx/sites-enabled/default
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
