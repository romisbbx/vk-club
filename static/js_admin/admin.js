window.Post = function () {
	this.getStory();
};

Post.prototype = {
	render: function (data) {
		App.renderTemplate('story', data, App._bind(function (html) {
			App.layouts.content
				.empty()
				.append(html);
		}, this));
	},

	getStory: function () {
		$.ajax({
			dataType: 'json',
			url: '/story.php',
			type: 'POST',
			success: App._bind(function (response) {
				for (var i = 0; i < response.length; i++) {
					response.text = decodeURI(response.text);
				}
				console.log(response);
				this.render(response);
			}, this)
		});
	}
};