// Набор расширений для `Backbone` и `Marionette`


// Добавляем декодер фрагмента url
// для корректной работы с русскими символами в url
Backbone.History.prototype.getFragment = (function(fn) {
	return function(options) {
		var fragment = fn.apply(this, arguments);
		return decodeURIComponent(fragment)
	};
})(Backbone.History.prototype.getFragment);