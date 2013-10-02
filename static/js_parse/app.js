window.WebApp = function () {

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
				href: '/static/js_parse/tpl/' + name + '.twig',
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
	}
};