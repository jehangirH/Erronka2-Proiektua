FROM php:8.3-apache

# mysqli gehitu eta .htaccess fitxategiak aktibatu
RUN docker-php-ext-install mysqli \
 && sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf
