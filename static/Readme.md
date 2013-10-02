## Как завести фронтовые тулзы ##

1.	Нужно подключить unstable репозитории и установить Ruby (http://www.ruby-lang.org/), Node.js (http://nodejs.org/), PhantomJS (http://phantomjs.org/)

		apt-get install rubygems
		
	Node.js ставить из сырцов и после этого:
	
		ln -s /usr/local/bin/node /usr/sbin/node
		curl https://npmjs.org/install.sh | sh

		https://sekati.com/etc/install-nodejs-on-debian-squeeze

2.	Устанавливаем Compass:

		gem update --system (в случае с дебианом эта строка будет не нужна)
		gem install compass
		ln -s /var/lib/gems/1.8/bin/compass /usr/sbin/compass

3.	Устанавливаем плагин normalize.css:

		gem install compass-normalize

4.	Устанавливаем grunt:

		npm install -g grunt-cli

5.	Заходим в папку статики `static` и выполняем

		npm install

6.	Выполняем `grunt`. Вся статика пересобирается, запускается watcher изменений исходников.
	
	a.	для билд-скриптов на тестовом сервере достаточно выполнить команду `grunt build`. Можно даже внести её в конфиг Continuous Integration.
	
	b.	_TODO: подготовить grunt-задачу для сборки приложения под продакшн._
