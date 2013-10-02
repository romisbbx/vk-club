WebApp.App = Backbone.Marionette.Application.extend({
	config: window.WebApp.config,

	init: function () {
		console.log('App init');

		this.views = {};

		this.layouts = {
			'window': $(window),
			'document': $(document),
			'wrapper': $('body'),
			'htmlBody': $('body, html'),
			'header': $('#js-header'),
			'footer': $('#js-footer'),
			'panelTop': $('#js-panel-top'),
			'panelMid': $('#js-panel-mid'),
			'panelBottom': $('#js-panel-bottom'),
			'panelNavigation': $('#js-panel-navigation'),
			'content': $('#js-content')
		};

		// Следим за кликами по ajax ссылками
		this.layouts.wrapper
			.addClass('app_is_ready')
			.on('click', '.js-ajax', function(event) {
				App.router.navigate(event.currentTarget.getAttribute('href'), {
					trigger: true,
					replace: true
				});
				return false;
			});

		window.onerror = this._bind(this.errorHandler, this);

		this.getAppVars();
	},

	getAppVars: function () {
		var url = App.layouts.document[0].URL,
			params = url.split('?')[1] || '';

		this.appVars = App.unserialize(params);

		if (!parseInt(this.appVars['user_id'], 10)) {
			this.appVars['user_id'] = this.appVars['viewer_id'];
		}
	},



	renderTemplate: function (name, data, callback) {
		data = _.extend(data, {
			'page_params': App.getHashUrl(),
			'is_js': true
		});

		var template = twig({ ref: name });

		if (template) {
			if (callback && typeof(callback) === 'function') {
				callback(template.render(data));
			}
		} else {
			twig({
				id: name,
				href: '/tpl/' + name + '.twig',
				load: function (template) {
					if (callback && typeof(callback) === 'function') {
						callback(template.render(data));
					}
				}
			});
		}
	},

	// Метод который полностью подменяет контекст вызова у переданной функции на тот что был передан
	// в параметрах.
	// Более быстрая альтернатива универсальному `fn.bind(context)` (http://jsperf.com/bind-experiment-2)
	//
	// __Пример:__
	//
	//         var a = {
	//             handler: core._bind(fn, context)
	//         }
	_bind: function(fn, context) {
		context || (context = window);

		if (typeof(fn) === 'function') {
			return function() {
				return fn.apply(context, arguments);
			};
		}
		return false;
	},

	// XSS filter
	xssCorrect: function(value) {
		return value.replace(/[<>(){};]/g, '');
	},

	// Метод который получает текущий роутинг и выдает его в более удобном формате для работы
	// разбивая на:
	//
	// * `section` - основная часть роута
	// * `subsection` - дополнительная часть роута
	// * `data` - остальная часть роута
	//
	getHashUrl: function() {
		var fragment = decodeURIComponent(Backbone.history.getFragment() || 'index'),
			correctFragment = this.xssCorrect(fragment), // XSS filter
			data = correctFragment.split('/') || [];

		return {
			section: data[0] || '',
			subsection: data[1] || '',
			data: data[2] || ''
		};
	},

	// Кастомный обработчик ошибок с указанием режима дебага или продакшна
	errorHandler: function(message, file, lineNum) {
		if (!this.config.debugMode) {
			return true;
		} else {
			alert('"' + message + '" on line: ' + lineNum + ' in ' + file);
			return false;
		}
	},

	// Делит массив @array на @count подмассивов
	splitArray: function (array, count) {
		var returnData = {},
			groupeLen, // количество элементов в группе
			index = 0, // индекс групп
			groupeI = 0; // счетчик внутри группы

		if (array && array.length) {
			count = Math.min(count, array.length);
			groupeLen = Math.ceil(array.length / count);

			for (var i = 0, max = array.length; i < max; i++) {
				if (!groupeI) {
					returnData[index] = [];
				}

				returnData[index].push(array[i]);

				if (groupeI >= groupeLen - 1) {
					groupeI = 0;
					index++;
				} else {
					groupeI++;
				}
			}

			return returnData;
		} else {
			return false;
		}
	},

	// Метод получает ширину скролбара
	getScrollBarWidth: function() {
		var inner = document.createElement('p'),
			outer = document.createElement('div'),
			w1, w2;

		inner.style.width = '100%';
		inner.style.height = '200px';

		outer.style.position = 'absolute';
		outer.style.top = '0px';
		outer.style.left = '0px';
		outer.style.visibility = 'hidden';
		outer.style.width = '200px';
		outer.style.height = '150px';
		outer.style.overflow = 'hidden';

		outer.appendChild(inner);
		document.body.appendChild(outer);

		w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		w2 = inner.offsetWidth;

		if (w1 == w2) {
			w2 = outer.clientWidth;
		}

		document.body.removeChild(outer);

		return (w1 - w2);
	},

	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	DateUTC: function(time, format, asArray) {
		var d = new Date(),
			splitReg = /[:.]/,
			date = {},
			formatDate = function(d) {
				return ('0' + d).slice(-2);
			};

		time && d.setTime(time);
		date.HH = (function(d) {
			return (d.getUTCFullYear()).toString();
		})(d);
		date.MM = (function(d) {
			return formatDate(d.getUTCMonth() + 1);
		})(d);
		date.WD = (function(d) {
			return formatDate(d.getUTCDay());
		})(d);
		date.DD = (function(d) {
			return formatDate(d.getUTCDate());
		})(d);
		date.H = (function(d) {
			return formatDate(d.getUTCHours());
		})(d);
		date.M = (function(d) {
			return formatDate(d.getUTCMinutes());
		})(d);
		date.S = (function(d) {
			return formatDate(d.getUTCSeconds());
		})(d);
		date.MS = (function(d) {
			var d = d.getUTCMilliseconds();

			return ('00' + d).slice(-3);
		})(d);

		date.hh = (function(d) {
			return d.getUTCFullYear();
		})(d);
		date.mm = (function(d) {
			return d.getUTCMonth();
		})(d);
		date.wd = (function(d) {
			return d.getUTCDay();
		})(d);
		date.dd = (function(d) {
			return d.getUTCDate();
		})(d);
		date.h = (function(d) {
			return d.getUTCHours();
		})(d);
		date.m = (function(d) {
			return d.getUTCMinutes();
		})(d);
		date.s = (function(d) {
			return d.getUTCSeconds();
		})(d);
		date.ms = (function(d) {
			return d.getUTCMilliseconds();
		})(d);

		date.timestamp = (function(d) {
			return d.valueOf();
		})(d);

		if (format) {
			var partialDate = format.split(splitReg),
				symbolResult = splitReg.exec(format),
				delimeterSymbol = symbolResult ? symbolResult[0] : '',
				formatedDate = [];

			$.each(partialDate, function(i, item) {
				formatedDate.push(date[item]);
			});
			return asArray ? formatedDate : formatedDate.join(delimeterSymbol);
		}
		return date;
	},

	// Функция которая по числу выдает правильное склонение слова из трех представленых
	// Пример использования:
	//      App.declension(5, ['комментарий', 'комментария', 'комментариев'])
	//
	declension: function (num, strArr) {
		var plural = (num%10 == 1 && num%100 != 11) ? 0 : (num%10 >= 2 && num%10 <= 4 && (num%100 < 10 || num%100 >= 20) ? 1 : 2);

		return strArr[plural] || '';
	},

	// Метод unserialize
	//
	// Принимает строку в формате "param1=value1&param2=value2" и возвращает объект { param1: 'value1', param2: 'value2' }.
	// Если "param1" заканчивается "[]" параметр рассматривается как массив.
	//
	// Пример:
	//
	// Input:  param1=value1&param2=value2
	// Return: { param1 : value1, param2: value2 }
	//
	// Input:  param1[]=value1&param1[]=value2
	// Return: { param1: [ value1, value2 ] }
	//
	// @TODU Потдержка параметров: "param1[name]=value1" (should return { param1: { name: value1 } })
	unserialize: function(params) {
		params = params.split('&');

		var resultData = {},
			pairs,
			name;

		for (var i = 0, len = params.length; i < len; i++) {
			pairs = params[i].split('=');
			name = pairs[0];

			if (name.indexOf('[]') == name.length - 2 && name.length > 2) {
				name = name.substring(0, name.length - 2);

				if (!$.isArray(resultData[name])) {
					resultData[name] = [];
				}
				if (pairs[1] && pairs[1].length) {
					resultData[name].push(pairs[1]);
				}
			} else {
				resultData[name] = pairs[1];
			}
		}
		return resultData;
	},

	// Делит массив @array на @count подмассивов
	splitArray: function (array, count) {
		var returnData = {},
			groupeLen, // количество элементов в группе
			index = 0, // индекс групп
			groupeI = 0; // счетчик внутри группы

		if (array && array.length) {
			count = Math.min(count, array.length);
			groupeLen = Math.ceil(array.length / count);

			for (var i = 0, max = array.length; i < max; i++) {
				if (!groupeI) {
					returnData[index] = [];
				}

				returnData[index].push(array[i]);

				if (groupeI >= groupeLen - 1) {
					groupeI = 0;
					index++;
				} else {
					groupeI++;
				}
			}

			return returnData;
		} else {
			return false;
		}
	}
});