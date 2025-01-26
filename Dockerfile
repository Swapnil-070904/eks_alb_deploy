FROM ubuntu:latest

RUN apt update && apt install -y apache2

RUN rm /var/www/html/index.html

COPY . /var/www/html

EXPOSE 80

CMD [ "apache2ctl" , "-D", "FOREGROUND" ]