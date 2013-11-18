WebApp.Views.Post = Backbone.Marionette.View.extend({
	className: 'post',
	template: 'post',

	initialize: function () {
		App.layouts.content
			.empty()
			.append(this.$el);

		this.getUsers(App._bind(function () {
			this.post(true);
		}, this));
	},

	getUsers: function (callback) {
		$.ajax({
			dataType: 'json',
			url: '/rating_app/user_data.php',
			data: {
				messages: 1
			},
			type: 'POST',
			success: App._bind(function (response) {
				this.data = response;

				if (callback && typeof(callback) === 'function') {
					callback();
				}
			}, this)
		});
	},

	postPhoto: function (photo_url, callback) {
		VK.api('photos.getWallUploadServer', {
			group_id: window.config.VK_GROUPE_ID
		}, function (data) {
			if (data && data.response && data.response.upload_url) {
				var url = data.response.upload_url,
					params = [];

				params.push('upload_url=' + encodeURIComponent(url));
				params.push('image_url=' + photo_url);

				$
					.get('/rating_app/post_photo.php?'+params.join('&'))
					.success(function(data){
						data = $.parseJSON(data);
						data.gid = window.config.VK_GROUPE_ID;

						VK.api('photos.saveWallPhoto', data, callback);
					});
			}
		});
	},

	post: function (everyday) {
		this.postData = {
			publishDate: Math.ceil((new Date().valueOf() + 1000 * 60 * window.config.VK_POST_OFFSET) / 1000)
		};

		if (everyday) {
			// ежедневный пост
			this.postPhoto('../rating_app/phantom/_build/top-active.png', App._bind(function (data) {
				this.postData.photoTA = data.response[0];

				console.log('post'); // метка для phantomjs
				VK.api('wall.post', {
					owner_id: -window.config.VK_GROUPE_ID,
					from_group: 1,
					message: this.getMessage(everyday),
					publish_date: this.postData.publishDate,
					attachments: this.postData.photoTA.id
				}, function () {
					alert('Complete!');
				});
			}, this));
		} else {
			// еженедельный пост
			this.postPhoto('../rating_app/phantom/_build/top-active.png', App._bind(function (data) {
				this.postData.photoTA = data.response[0];

				this.postPhoto('../rating_app/phantom/_build/top-100-1.png', App._bind(function (data) {
					this.postData.photoT100_1 = data.response[0];

					this.postPhoto('../rating_app/phantom/_build/top-100-19.png', App._bind(function (data) {
						this.postData.photoT100_19 = data.response[0];

						this.postPhoto('../rating_app/phantom/_build/top-100-37.png', App._bind(function (data) {
							this.postData.photoT100_37 = data.response[0];

							console.log('post'); // метка для phantomjs
							VK.api('wall.post', {
								owner_id: -window.config.VK_GROUPE_ID,
								from_group: 1,
								message: this.getMessage(everyday),
								publish_date: this.postData.publishDate,
								attachments: this.postData.photoTA.id + ','
									+ this.postData.photoT100_1.id + ','
									+ this.postData.photoT100_19.id + ','
									+ this.postData.photoT100_37.id
							}, function () {
								alert('Complete!');
							});
						}, this));
					}, this));
				}, this));
			}, this));
		}
	},

	getMessage: function (everyday) {
		var users = this.data.users_last_day.slice().reverse(),
			data = {
				day: App.getDayOfWeek()
			},
			messgeIndex = App.getRandomInt(0, this.data.messages.length - 1),
			template = this.data.messages[messgeIndex].text;

		template = twig({
			data: template
		});

		for (var i = 0; i < users.length; i++) {
			data['username' + (i + 1)] = '@id' + users[i].id;
		}

		return template.render(data);
	}
});