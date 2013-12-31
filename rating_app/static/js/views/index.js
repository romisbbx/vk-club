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
			this.renderPagination();

			// если выбрана страница > top 105, то таких данных в базе нет
			// и нужно загрузить их через VK API
			if (this.options.page > this.pageCount) {
				this.getNextUsersData(App._bind(function () {
					this.renderTop100(this.data.nextUsers);
				}, this));
			} else {
				this.renderTop100(this.data.users);
			}

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
		// вырезаем данные для нужной страницы, только если выводим страницу из top 105
		if (this.options.page <= this.pageCount) {
			data = data.slice(15 * this.options.page, 15 * this.options.page + 15);

			for (var i = 0; i < data.length; i++) {
				data[i].index = 15 * this.options.page + i + 1;
			}
		} else {
			for (var i = 0; i < data.length; i++) {
				data[i].index = this.data.cur_user.place - 6 + i;
			}
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

		if (cur_user && cur_user.rating > 0) {
			cur_user_page = Math.ceil((cur_user.place + 1) / 15);
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

	// // получает данные пользователя и его город
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
						this.data.cur_user.place = parseInt(this.data.cur_user.place, 10);
						this.data.cur_user.rating = parseFloat(this.data.cur_user.rating);

						if (callback && typeof(callback) === 'function') {
							callback();
						}
					}
				}, this));
			}
		}, this));
	},

	// получает данные пользователей и их города для массива id
	getUsersData: function (items, callback) {
		VK.api('users.get', {
			user_ids: _.pluck(items, 'id').join(', '),
			fields: 'photo_50,city'
		}, App._bind(function (userData) {
			if (userData && userData.response) {
				userData = userData.response;

				VK.api('database.getCitiesById', {
					city_ids: _.pluck(userData, 'city').join(', ')
				}, App._bind(function (cityData) {
					if (cityData && cityData.response) {
						cityData = cityData.response;

						_.each(items, App._bind(function(item) {
							var userItem = _.find(userData, function (value) {
									return value.uid == item.id;
								}),
								cityItem = _.find(cityData, function (value) {
									return value.cid == userItem.city;
								});

							item = _.extend(item, userItem, {
								'city': cityItem && cityItem['name'] ? cityItem['name'] : ''
							});
						}, this));

						if (callback && typeof(callback) === 'function') {
							callback(items);
						}
					}
				}, this));
			}
		}, this));
	},

	// загрузка данных для страницы рейтинга если мето > 105
	getNextUsersData: function (callback) {
		this.getUsersData(this.data.cur_user_page, App._bind(function(items) {
			this.data.nextUsers = items;

			if (callback && typeof(callback) === 'function') {
				callback(items);
			}
		}, this));
	},

	userCornerPosition: function (user) {
		var index = Math.ceil((user.place + 1) / 15) - 1,
			items = this.$('.pagination-item'),
			elem = (index <= this.pageCount) ? items.eq(index) : items.last(),
			corner = this.$('.user-corner'),
			pos;

		if (user.rating > 0) {
			pos = (elem && elem.length) ? elem.offset().left - 5 : -100000;
			corner.css('left', pos);
		}
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
