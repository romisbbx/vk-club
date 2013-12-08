// Набор расширений для `Backbone`, `Marionette`, `Twig`


// Добавляем декодер фрагмента url
// для корректной работы с русскими символами в url
Backbone.History.prototype.getFragment = (function(fn) {
	return function(options) {
		var fragment = fn.apply(this, arguments);
		return decodeURIComponent(fragment)
	};
})(Backbone.History.prototype.getFragment);

// К запросам шаблонов добавляем ревизию
Twig.extend(function (Twig) {
	Twig.Templates.loadRemote = (function(fn) {
		return function(options) {
			arguments[0] += WebApp.config.revision;
			return fn.apply(this, arguments)
		};
	})(Twig.Templates.loadRemote);
});

