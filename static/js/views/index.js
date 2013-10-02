WebApp.Views.Index = Backbone.Marionette.View.extend({
	className: 'index',
	template: 'index',

	templateTopActive: 'top-active',
	templateTop100: 'top-100',
	templateUser: 'user',

	initialize: function () {
		this.render();
	},

	render: function () {
		App.renderTemplate(this.template, {page: this.options.page}, App._bind(function (html) {
			App.layouts.content
				.empty()
				.append(this.$el.html(html));

			this.getUsersId();
		}, this));
	},

	renderTopActive: function (data) {
		data = this.sortUserData(data, 1);
		data = data.slice(0, 5);
		data = this.sortUserData(data, -1);

		App.renderTemplate(this.templateTopActive, {
			items: data,
			day: this.getDayOfWeek()
		}, App._bind(function (html) {
			this.$el.find('#js-top-active')
				.empty()
				.append(html);
		}, this));
	},

	renderTop100: function (data) {
		data = data.slice(0, 100);
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

	renderUser: function (data) {
		var user = this.getCurUser(data);

		App.renderTemplate(this.templateUser, {
			user: user,
			setting: this.setting
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

	getUsersId: function () {
		$.ajax({
			data: {
				cur_user: App.appVars['user_id']
			},
			dataType: 'json',
			url: '/user.php',
			type: 'POST',
			success: App._bind(function (response) {
				this.users = response.users;
				this.setting = response.setting;
				this.cur_user_place = response.cur_user_place;

				$.ajax({
					dataType: 'json',
					url: '/user_last_day.php',
					type: 'POST',
					success: App._bind(function (response) {
						this.usersLastDay = response.users;

						if (this.usersLastDay.length < 5) {
							var i = 0,
								res;

							while (this.usersLastDay.length < 5) {
								res = _.filter(this.usersLastDay, App._bind(function (item) {
									return this.users[i].id == item.id;
								}, this));

								if (!res.length) {
									this.usersLastDay.push({
										id: this.users[i].id,
										rating: 0
									});
								}
								i++;
							}
						}

						this.getUsersData(this.users, false);
						this.getUsersData(this.usersLastDay, true);
						this.setUpdateTimer();
					}, this)
				});
			}, this)
		});
	},

	getUsersData: function (items, lastDay) {
		var ids = _.pluck(items, 'id');

		VK.api('users.get', {
			user_ids: ids.join(', '),
			fields: 'photo_100,photo_50,city'
		}, App._bind(function (data) {
			if (data && data.response) {
				this.getCityName(data.response, lastDay, items);
			}
		}, this));
	},

	getCityName: function (data, lastDay, items) {
		var ids = _.pluck(data, 'city');

		VK.api('database.getCitiesById', {
			city_ids: ids.join(', ')
		}, App._bind(function (cityData) {
			if (cityData && cityData.response) {
				cityData = cityData.response;

				data = this.mergeUserData(data, cityData, items);
				data = this.sortUserData(data);

				if (lastDay) {
					this.renderTopActive(data);
				} else {
					this.renderTop100(data);
					this.renderUser(data);
				}
			}
		}, this));
	},

	mergeUserData: function (data, cityData, items) {
		_.each(data, App._bind(function(item){
			var userItem = _.find(items, function (value) {
					return value.id == item.uid;
				}),
				cityItem = _.find(cityData, function (value) {
					return value.cid == item.city;
				});

			item = _.extend(item, userItem, {
				'city': cityItem && cityItem['name'] ? cityItem['name'] : ''
			});

			item.rating = parseFloat(item.rating);
		}, this));

		return data;
	},

	// сортировка по рейтингу имени
	sortUserData: function (data, invert) {
		invert = invert || 1;

		return data.sort(function (a, b){
			if (a.rating == b.rating) {
				if (a.first_name < b.first_name) {
					return -1 * invert;
				}
				if (a.first_name > b.first_name) {
					return 1 * invert;
				}
				if (a.first_name == b.first_name) {
					return 0;
				}
			} else {
				return b.rating - a.rating * invert;
			}
		});
	},

	getCurUser: function (data) {
		var user_id = parseInt(App.appVars['user_id'], 10) || parseInt(App.appVars['viewer_id'], 10),
			place = -1,
			user = _.find(data, function (item) {
				place++;
				return item.id == user_id;
			}) || {};

		if (user.no_top) {
			user.place = this.cur_user_place;
		} else {
			user.place = place;
		}

		return user;
	},

	userCornerPosition: function (user) {
		if (user.place <= this.$('.pagination-item').length * 15) {
			var index = Math.ceil(user.place / 15) - 1,
				elem = this.$('.pagination-item').eq(index),
				corner = this.$('.user-corner'),
				pos;

			pos = elem ? elem.offset().left - 5 : -100000;
			corner.css('left', pos);
		}
	},

	setUpdateTimer: function () {
		this.updateTimeEl = this.$('.update-time');
		this.updateDifEl = this.$('.update-dif');
		setInterval(App._bind(this.updateTimer, this), 1);
	},

	updateTimer: function () {
		var updateDate = this.setting['update_date'] * 1000,
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
	},

	getDayOfWeek: function () {
		var day = (new Date()).getDay(),
			daysTitle = ['субботы', 'воскресения', 'понедельника', 'вторника', 'среды', 'четверга', 'пятницы'];

		return daysTitle[day];
	}
});
