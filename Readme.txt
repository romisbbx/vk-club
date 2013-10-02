1. Хостинг

http://37.143.12.204/

Информация о конфигурации Виртуального Выделенного Сервера:
OS: Debian 6.0 + панель ISPmanager
Пользователь: root
Пароль: FZiVMDAE6c
IP-адреса, выделенные под ваш VPS: 37.143.12.204

Для входа в ISPmanager используйте эту ссылку:
https://37.143.12.204/manager/ispmgr?func=auth&username=root&password=FZiVMDAE6c&checkcookie=no
Логин: root
Пароль: FZiVMDAE6c

2. База данных

https://37.143.12.204/myadmin/
Логин: admin
Пароль: FZiVMDAE6c

В таблице setting лежат настройки коэффициентов

3. Приложение для парснга

https://vk.com/app3844646_4394894?ref=9

Открываем (не в Firefox) и ждем
По окончании парсинга выскакивает ALERT: Complete
В консоль браузера выводятся логи

Вызов его из консоли сервера:
phantomjs /var/www/admin/data/www/vk-club.ru/phantom/rasterize.js https://vk.com/app3844646 /var/www/admin/data/www/vk-club.ru/phantom/screen.png

4. Вызов из консоли сервера приложения для создания скриншотов

phantomjs /var/www/admin/data/www/vk-club.ru/phantom/rasterize.js http://37.143.12.204/post.php /var/www/admin/data/www/vk-club.ru/phantom/top-100.png /var/www/admin/data/www/vk-club.ru/phantom/top-active.png

5. Ссылки на скрины на сервере

http://37.143.12.204/phantom/top-100.png
http://37.143.12.204/phantom/top-active.png
