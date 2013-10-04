window.Post = function () {
	var url = App.layouts.document[0].URL,
		params = url.split('?')[1];

	if (params) { // зашли через VK
		this.getUsers(App._bind(function () {
			this.post(true);
		}, this));
	} else {
		this.getUsers(App._bind(function () {
			this.renderTopActive(App._bind(function () {
				this.renderTop100(1, 18, App._bind(function () {
					this.renderTop100(19, 36, App._bind(function () {
						this.renderTop100(37, 54, App._bind(function () {
							setTimeout(function () {
								alert('Complete!');
							}, 1000);
						}, this));
					}, this));
				}, this));
			}, this));
		}, this));
	}
};

Post.prototype = {
	renderTopActive: function (callback) {
		App.renderTemplate('post-top-active', {
			users: this.data.users_last_day.reverse(),
			day: App.getDayOfWeek()
		}, App._bind(function (html) {
			App.layouts.content
				.empty()
				.append(html);

			setTimeout(function () {
				console.log('top-active'); // метка для phantomjs

				if (callback && typeof(callback) === 'function') {
					callback();
				}
			}, 1000);
		}, this));
	},

	renderTop100: function (indexStart, indexEnd, callback) {
		var data = {
			users: this.data.users.slice(indexStart - 1, indexEnd),
			title: indexStart + '&mdash;' + indexEnd
		};

		data.users = App.splitArray(data.users, 3);

		App.renderTemplate('post-top-100', data, App._bind(function (html) {
			App.layouts.content
				.empty()
				.append(html);

			setTimeout(function () {
				console.log('top-100-' + indexStart); // метка для phantomjs

				if (callback && typeof(callback) === 'function') {
					callback();
				}
			}, 1000);
		}, this));
	},

	getUsers: function (callback) {
		$.ajax({
			dataType: 'json',
			url: '/user_data.php',
			type: 'POST',
			success: App._bind(function (response) {
				this.data = response;

				for (var i = 0; i < this.data.users.length; i++) {
					this.data.users[i].index = i + 1;
				}

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
					.get('/post_photo.php?'+params.join('&'))
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
			this.postPhoto('phantom/_build/top-active.png', App._bind(function (data) {
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
			this.postPhoto('phantom/_build/top-active.png', App._bind(function (data) {
				this.postData.photoTA = data.response[0];

				this.postPhoto('phantom/_build/top-100-1.png', App._bind(function (data) {
					this.postData.photoT100_1 = data.response[0];

					this.postPhoto('phantom/_build/top-100-19.png', App._bind(function (data) {
						this.postData.photoT100_19 = data.response[0];

						this.postPhoto('phantom/_build/top-100-37.png', App._bind(function (data) {
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
		var users = this.data.users_last_day.reverse(),
			text = 'Поздравляем самых активных подписчиков ' + App.getDayOfWeek() + ':';

		for (var i = 0; i < users.length; i++) {
			if (i < users.length - 1) {
				text += ' @id' + users[i].id + ',';
			} else {
				text += ' и @id' + users[i].id;
			}
		}

		text += '\n\n';
		text += 'Посмотреть полный рейтинг клуба — vk.com/app3880825';
		return text;
	}
};