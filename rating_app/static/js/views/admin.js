WebApp.Views.Admin = Backbone.Marionette.View.extend({
	className: 'admin',
	template: 'admin',

	initialize: function () {
		this.render();
	},

	render: function () {
		App.renderTemplate(this.template, {}, App._bind(function (html) {
			App.layouts.content
				.empty()
				.append(this.$el.html(html));
		}, this));
	}
});
