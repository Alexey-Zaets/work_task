FROM postgres:10.5

# set up usefull staff
RUN apt-get update
RUN apt-get install -y coreutils net-tools htop iotop less nano

# run init script
ADD init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
