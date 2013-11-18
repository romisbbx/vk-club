window.Post = function () {
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
			}, 5000);
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
			}, 5000);
		}, this));
	},

	getUsers: function (callback) {
		$.ajax({
			dataType: 'json',
			url: '/rating_app/user_data.php',
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
	}
};