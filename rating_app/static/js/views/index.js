WebApp.Views.Index = Backbone.Marionette.View.extend({
	className: 'index',
	template: 'index',

	templateTopActive: 'top-active',
	templateTop100: 'top-100',
	templateUser: 'user',
	templatePagination: 'pagination',
	pageCount: 7,

	initialize: function () {
		this.curUser = App.appVars['viewer_id'];

		this.data = App.config.bootstrap;
		this.render();
	},

	render: function () {
		App.renderTemplate(this.template, {}, App._bind(function (html) {
			App.layouts.content
				.empty()
				.append(this.$el.html(html));

			this.renderTopActive(this.data.users_last_day);
			this.renderTop100(this.data.users);
			this.renderPagination();

			if (this.data.cur_user) { // cur_user - нет изначально в bootstrap данных
				this.setUpdateTimer();
				this.renderUser(this.data.cur_user);
				this.renderPagination(this.data.cur_user);
			} else {
				this.getData(App._bind(function () {
					this.setUpdateTimer();
					this.renderUser(this.data.cur_user);
					this.renderPagination(this.data.cur_user);
				}, this));
			}
		}, this));
	},

	renderTopActive: function (data) {
		App.renderTemplate(this.templateTopActive, {
			items: data.slice().reverse(),
			day: App.getDayOfWeek(true)
		}, App._bind(function (html) {
			this.$el.find('#js-top-active')
				.empty()
				.append(html);
		}, this));
	},

	renderTop100: function (data) {
		data = data.slice(15 * this.options.page, 15 * this.options.page + 15);

		for (var i = 0; i < data.length; i++) {
			data[i].index = 15 * this.options.page + i + 1;
		}

		data = App.splitArray(data, 3);

		App.renderTemplate(this.templateTop100, {
			items: data,
			page: this.options.page
		}, App._bind(function (html) {
			this.$el.find('#js-top-100')
				.empty()
				.append(html);
			this.masonryInit();

			this.$el.find('.top-100-link').hover(function (event) {
				$(event.currentTarget)
					.parent()
					.toggleClass('hover', event.type == 'mouseenter');
			});
		}, this));
	},

	renderPagination: function (cur_user) {
		var cur_user_page;

		if (cur_user) {
			cur_user_page = Math.ceil(cur_user.place / 15);
		}

		App.renderTemplate(this.templatePagination, {
			count: this.pageCount,
			active: this.options.page + 1,
			cur_user_page: cur_user_page
		}, App._bind(function (html) {
			this.$el.find('#js-pagination')
				.empty()
				.append(html);

			cur_user && this.userCornerPosition(cur_user);
		}, this));
	},

	renderUser: function (user) {
		App.renderTemplate(this.templateUser, {
			user: user,
			setting: this.data.setting
		}, App._bind(function (html) {
			this.$el.find('#js-user')
				.empty()
				.append(html);

			this.userCornerPosition(user);
		}, this));
	},

	masonryInit: function () {
		var elem = this.$('.top-100-col');

		elem.imagesLoaded(App._bind(function() {
			elem.masonry({
				itemSelector: '.top-100-item',
				columnWidth: 220,
				gutter: 10,
				isResizeBound: false,
				transitionDuration: '0s'
			}, this);
		}, this));
	},

	getData: function (callback) {
		$.ajax({
			data: {
				cur_user: this.curUser
			},
			dataType: 'json',
			url: '/rating_app/user_data.php',
			type: 'POST',
			success: App._bind(function (response) {
				this.data = response;
				App.config.bootstrap = this.data;

				if (this.data.cur_user) {
					// если текущий пользователь не в топе, то у него нет данных
					this.getUserData(this.curUser, callback);
				}
			}, this)
		});
	},

	getUserData: function (id, callback) {
		VK.api('users.get', {
			user_ids: id,
			fields: 'photo_100,photo_50,city'
		}, App._bind(function (data) {
			if (data && data.response) {
				data = data.response[0];
				this.data.cur_user = _.extend(this.data.cur_user, data);

				VK.api('database.getCitiesById', {
					city_ids: data.city
				}, App._bind(function (cityData) {
					if (cityData && cityData.response) {
						cityData = cityData.response[0];

						this.data.cur_user.city = cityData && cityData['name'] ? cityData['name'] : '';

						if (callback && typeof(callback) === 'function') {
							callback();
						}
					}
				}, this));
			}
		}, this));
	},

	userCornerPosition: function (user) {
		var index = Math.ceil(user.place / 15) - 1,
			items = this.$('.pagination-item'),
			elem = (index <= this.pageCount) ? items.eq(index) : items.last(),
			corner = this.$('.user-corner'),
			pos;

		pos = (elem && elem.length) ? elem.offset().left - 5 : -100000;
		corner.css('left', pos);
	},

	setUpdateTimer: function () {
		this.updateTimeEl = this.$('.update-time');
		this.updateDifEl = this.$('.update-dif');
		setInterval(App._bind(this.updateTimer, this), 1);
	},

	updateTimer: function () {
		var updateDate = this.data.setting['update_date'] * 1000,
			nextUpdateDate = updateDate + 1000 * 60 * 60 * 24,
			dif = nextUpdateDate - new Date(),
			time = new Date() - updateDate,
			updateTime = App.DateUTC(time, 'h');

		dif = App.DateUTC(dif, 'H:M:S');
		this.updateDifEl.html(dif);

		if (parseInt(updateTime, 10) > 0) {
			updateTime += ' ' + App.declension(updateTime, ['час', 'часа', 'часов']);
		} else {
			updateTime = App.DateUTC(time, 'm');
			updateTime += ' ' + App.declension(updateTime, ['минуту', 'минуты', 'минут']);
		}

		this.updateTimeEl.html(updateTime);
	}
});
