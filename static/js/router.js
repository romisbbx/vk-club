WebApp.Router = Backbone.Marionette.AppRouter.extend({
	routes: {
		'': 'index',
		'index': 'index',
		'index/': 'index',
		'index/:page': 'index',
		'index/:page/': 'index',
		'help': 'help',
		'help/': 'help',
		'admin': 'admin',
		'admin/': 'admin',

		'*page': 'index'
	},

	run: function (name, options) {
		if (!App.views[name]) {
			App.views[name] = new WebApp.Views[name](options);
		}
	},

	// TODO: это временное решение
	removeViews: function () {
		_.each(App.views, App._bind(function (item, key) {
			item.close();
			delete App.views[key];
		}, this));
	},

	index: function (page) {
		page = parseInt(page, 10) - 1 || 0;

		this.removeViews();
		this.run('Index', { page: page });
	},

	help: function () {
		this.removeViews();
		this.run('Help');
	},

	admin: function () {
		this.removeViews();
		this.run('Admin');
	}
});
