window.WebApp = function () {
	this.layouts = {
		'window': $(window),
		'document': $(document),
		'wrapper': $('body'),
		'content': $('#js-content')
	};
};

window.WebApp.prototype = {
	renderTemplate: function (name, data, callback) {
		data = _.extend(data, {
			'config': window.config
		});

		var template = twig({ ref: name });

		if (template) {
			if (callback && typeof(callback) === 'function') {
				callback(template.render(data));
			}
		} else {
			twig({
				id: name,
				href: '/rating_app/tpl/' + name + '.twig',
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

	getDayOfWeek: function () {
		var day = (new Date()).getDay(),
			daysTitle = ['в субботу', 'в воскресение', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу'];

		return daysTitle[day];
	}
};