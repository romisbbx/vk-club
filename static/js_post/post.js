window.Post = function () {
	var url = App.layouts.document[0].URL,
		params = url.split('?')[1];

	if (params) { // зашли через VK
		this.post();
	} else {
		this.getUsers();
	}
};

Post.prototype = {
	render: function (data) {
		for (var i = 0; i < data.users.length; i++) {
			data.users[i].index = i + 1;
		}

		data.users = this.sortUserData(data.users);

		var top100 = {
				users: App.splitArray(data.users, 3)
			};

		App.renderTemplate('post', top100, App._bind(function (html) {
			App.layouts.content
				.empty()
				.append(html);

			setTimeout(App._bind(function (){
				console.log('top-100'); // метка для phantomjs

				setTimeout(App._bind(function (){
					data.users_last_day = this.sortUserData(data.users_last_day, 1);
					data.users_last_day = data.users_last_day.slice(0, 5);
					data.users_last_day = this.sortUserData(data.users_last_day, -1);
					data.day = this.getDayOfWeek();

					App.renderTemplate('post2', data, App._bind(function (html) {
						App.layouts.content
							.empty()
							.append(html);

						setTimeout(function (){
							alert('Complete!');
						}, 1000);
					}, this));
				}, this), 1000);
			}, this), 1000);
		}, this));
	},

	getUsers: function () {
		$.ajax({
			dataType: 'json',
			url: '/user_data.php',
			type: 'POST',
			success: App._bind(function (response) {
				this.render(response);
			}, this)
		});
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

	postPhoto: function (photo_url, callback) {
		VK.api('photos.getUploadServer', {
			group_id: window.config.VK_GROUPE_ID,
			album_id: window.config.VK_ALBUM_ID
		}, function (data) {
			if (data && data.response && data.response.upload_url) {
				var url = data.response.upload_url,
					params = [];

				params.push('upload_url=' + encodeURIComponent(url));
				params.push('image_url=' + photo_url);

				$
					.get('/post_photo?'+params.join('&'))
					.success(function(data){
						data = $.parseJSON(data);

						VK.api('photos.save', data, callback);
					});
			}
		});
	},

	post: function () {
		this.postPhoto('phantom/top-active.png', App._bind(function (data) {
			this.photoTA = data.response[0];

			this.postPhoto('phantom/top-100.png', App._bind(function (data) {
				this.photoT100 = data.response[0];

				console.log('post'); // метка для phantomjs
				VK.api('wall.post', {
					owner_id: -window.config.VK_GROUPE_ID,
					from_group: 1,
					message: 'Test message 2',
					publish_date: Math.ceil((new Date().valueOf() + 1000 * 60 * window.config.VK_POST_OFFSET) / 1000),
					attachments: 'photo-' + window.config.VK_GROUPE_ID + '_' + this.photoT100.pid + ','
						+ 'photo-' + window.config.VK_GROUPE_ID + '_' + this.photoTA.pid
				}, function () {
					alert('Complete!');
				});
			}, this));
		}, this));
	},

	getDayOfWeek: function () {
		var day = (new Date()).getDay(),
			daysTitle = ['субботы', 'воскресения', 'понедельника', 'вторника', 'среды', 'четверга', 'пятницы'];

		return daysTitle[day];
	}
};