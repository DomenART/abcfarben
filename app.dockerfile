FROM php:7.2.6-fpm-stretch

RUN dpkg --configure -a && apt-get -f install && apt-get clean & apt-get update && apt-get install -y \
        gnupg \
        curl \
        wget \
        git \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
    && docker-php-ext-install -j$(nproc) iconv mbstring mysqli pdo_mysql zip exif \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ADD php.ini /usr/local/etc/php/conf.d/40-custom.ini

WORKDIR /var/www

VOLUME /var/www

RUN usermod -u 1000 www-data

EXPOSE 9000

CMD ["php-fpm"]