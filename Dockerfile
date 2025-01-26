FROM ubuntu:latest

# Install Apache
RUN apt update && apt install -y apache2

# Remove the default index file
RUN rm /var/www/html/index.html

# Copy your app files into the container
COPY . /var/www/html

# Disable directory listing
RUN echo "Options -Indexes" >> /etc/apache2/apache2.conf

# Restrict access to everything except game.html
RUN echo "<Files ~ \"^(?!game.html$).*\">" >> /etc/apache2/apache2.conf && \
    echo "  Order Deny,Allow" >> /etc/apache2/apache2.conf && \
    echo "  Deny from all" >> /etc/apache2/apache2.conf && \
    echo "</Files>" >> /etc/apache2/apache2.conf

# Expose port 80 and start Apache
EXPOSE 80

CMD [ "apache2ctl", "-D", "FOREGROUND" ]
