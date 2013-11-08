window.Parser = function () {
	this.data = {};
	this.data.user = {};
	this.data.user_last_day = {};
	this.apiQueryCount = 0;
	this.apiTime = new Date().valueOf();

	this.time = new Date();

	this.stack = [];

	// Стена

	this.stack.push(App._bind(function () {
		this.getWall(App._bind(function () {
			this.data.wallIDs = _.map(this.data.wall, function(item){ return item.id; });
			this.stackNext();
		}, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getLikes('post', this.data.wallIDs, App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getWallReposts(App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getWallComments(App._bind(this.stackNext, this));
	}, this));

	// Attachments на стене

	this.stack.push(App._bind(function () {
		this.getWallAttachmentsData();
		this.stackNext();
	}, this));

	this.stack.push(App._bind(function () {
		this.getLikes('photo', this.data.wallPhotoIDs, App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getLikes('video', this.data.wallVideoIDs, App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getLikes('audio', this.data.audioIDs, App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getPhotoComments(this.data.wallPhotoIDs, App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getVideoComments(this.data.wallVideoIDs, App._bind(this.stackNext, this));
	}, this));

	// Фото в альбомах

	this.stack.push(App._bind(function () {
		this.getPhotosData(App._bind(function () {
			this.data.photoIDs = _.map(this.data.photos, function(item){ return item.pid; });
			this.stackNext();
		}, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getLikes('photo', this.data.photoIDs, App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getPhotoComments(this.data.photoIDs, App._bind(this.stackNext, this));
	}, this));

	// Видео в альбомах

	this.stack.push(App._bind(function () {
		this.getVideoData(App._bind(function () {
			this.data.videoIDs = _.map(this.data.video, function(item){ return item.vid; });
			this.stackNext();
		}, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getLikes('video', this.data.videoIDs, App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getVideoComments(this.data.videoIDs, App._bind(this.stackNext, this));
	}, this));

	// Обсуждения

	this.stack.push(App._bind(function () {
		this.getBoardTopics(App._bind(function () {
			this.data.boardTopicsIDs = _.map(this.data.boardTopics, function(item){ return item.tid; });
			this.stackNext();
		}, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.getBoardComments(App._bind(this.stackNext, this));
	}, this));

	// Собираем уникальных пользователей и историю

	this.stack.push(App._bind(function () {
		this.getUserData();
		this.getStory();
		this.getUserLastDay();
		console.log(this.data);
		this.stackNext();
	}, this));

	// фильтруем пользователей не состоящих в группе
	this.stack.push(App._bind(function () {
		this.filterFriendsOnly(App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		console.log(this.data, _.keys(this.data.user).length);
		this.userCopyTable(App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.save(this.data.user, '/rating_app/user_save.php', App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.save(this.data.story, '/rating_app/story_save.php', App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.save(this.data.user_last_day, '/rating_app/user_save_last_day.php', App._bind(this.stackNext, this));
	}, this));

	this.stack.push(App._bind(function () {
		this.afterSave();
	}, this));

	this.stackNext();
};

Parser.prototype = {
	getWall: function (callback) {
		this.getPages('wall', 'wall.get', {
			owner_id: window.config.VK_GROUPE_ID,
			count: 100,
			offset: 0
		},  callback);
	},

	getLikes: function (type, items, callback) {
		this.getItems('user_likes', items, 'item_id', 'likes.getList', {
			owner_id: window.config.VK_GROUPE_ID,
			type: type,
			count: 1000,
			offset: 0
		}, 'users', false, callback, 0);
	},

	getWallReposts: function (callback) {
		this.getItems('user_wall_reposts', this.data.wallIDs, 'item_id', 'likes.getList', {
			owner_id: window.config.VK_GROUPE_ID,
			type: 'post',
			filter: 'copies',
			count: 1000,
			offset: 0
		}, 'users', false, callback, 0);
	},

	getWallComments: function (callback) {
		this.getItems('user_wall_comments', this.data.wallIDs, 'post_id', 'wall.getComments', {
			owner_id: window.config.VK_GROUPE_ID,
			count: 100,
			offset: 0
		}, null, true, callback, 0);
	},

	getPhotoComments: function (items, callback) {
		this.getItems('user_photo_comments', items, 'photo_id', 'photos.getComments', {
			owner_id: window.config.VK_GROUPE_ID,
			count: 100,
			offset: 0
		}, null, true, callback, 0);
	},

	getVideoComments: function (items, callback) {
		this.getItems('user_video_comments', items, 'video_id', 'video.getComments', {
			owner_id: window.config.VK_GROUPE_ID,
			count: 100,
			offset: 0
		}, null, true, callback, 0);
	},

	getWallAttachmentsData: function (callback) {
		var wallPhotoIDs = [],
			wallVideoIDs = [],
			audioIDs = [];

		_.each(this.data.wall, function (item) {
			if (item.attachments) {
				_.each(item.attachments, function (attachment) {
					switch (attachment.type) {
						case 'photo':
							if (attachment.photo.owner_id == window.config.VK_GROUPE_ID) { // только если принадледит группе
								wallPhotoIDs.push(attachment.photo.pid);
							}
							break;
						case 'video':
							if (attachment.video.owner_id == window.config.VK_GROUPE_ID) {
								wallVideoIDs.push(attachment.video.vid);
							}
							break;
						case 'audio':
							if (attachment.audio.owner_id == window.config.VK_GROUPE_ID) {
								audioIDs.push(attachment.audio.aid);
							}
							break;
					}
				});
			}
		});

		this.data.wallPhotoIDs = wallPhotoIDs;
		this.data.wallVideoIDs = wallVideoIDs;
		this.data.audioIDs = audioIDs;
	},

	getPhotosData: function (callback) {
		this.getPages('photos', 'photos.getAll', {
			owner_id: window.config.VK_GROUPE_ID,
			count: 100,
			offset: 0
		}, callback);
	},

	getVideoData: function (callback) {
		this.getPages('video', 'video.get', {
			owner_id: window.config.VK_GROUPE_ID,
			count: 100,
			offset: 0
		}, callback);
	},

	getBoardTopics: function (callback) {
		this.getItems('boardTopics', [ Math.abs(window.config.VK_GROUPE_ID) ], 'group_id', 'board.getTopics', {
			count: 100,
			offset: 0
		}, 'topics', true, callback, 0);
	},

	getBoardComments: function (callback) {
		this.getItems('boardComments', this.data.boardTopicsIDs, 'topic_id', 'board.getComments', {
			group_id: Math.abs(window.config.VK_GROUPE_ID),
			count: 100,
			offset: 0
		}, 'comments', true, callback, 0);
	},

	getUserData: function () {
		this.getDuplicate(this.data.user, this.data.user_likes, 'l');
		this.getDuplicate(this.data.user, this.data.user_wall_reposts, 'r');
		this.getDuplicate(this.data.user, this.data.user_wall_comments, 'c', 'from_id');
		this.getDuplicate(this.data.user, this.data.user_photo_comments, 'c', 'from_id');
		this.getDuplicate(this.data.user, this.data.user_video_comments, 'c', 'from_id');
		this.getDuplicate(this.data.user, this.data.boardComments, 'c', 'from_id');
		this.getDuplicate(this.data.user, this.data.boardTopics, 't', 'created_by');
		this.getDuplicate(this.data.user, this.data.photos, 'p', 'user_id');
	},

	getStory: function () {
		this.data.story = [];

		this.getStoryItem(this.data.boardTopics, 'tid', 'created_by', 'created', 'title', 'topic');
		this.getStoryItem(this.data.boardComments, 'id', 'from_id', 'date', 'text', 'topic-cm');
		this.getStoryItem(this.data.photos, 'pid', 'user_id', 'created', 'src', 'photo');
//		this.getStoryItem(this.data.video, 'vid', 'owner_id', 'date', 'image', 'video');
		this.getStoryItem(this.data.user_photo_comments, 'cid', 'from_id', 'date', 'message', 'photo-cm');
		this.getStoryItem(this.data.user_video_comments, 'id', 'from_id', 'date', 'message', 'video-cm');
		this.getStoryItem(this.data.user_wall_comments, 'cid', 'from_id', 'date', 'text', 'wall-cm');
	},

	getStoryItem: function (items, propertyId, propertyUserId, propertyUserDate, propertyUserText, type) {
		if (items && items.length) {
			for (var i = 0; i < items.length; i++) {
				if (items[i][propertyUserId] > 101) {
					this.data.story.push({
						item_id: items[i][propertyId],
						user_id: items[i][propertyUserId],
						type: type,
						date: items[i][propertyUserDate],
						text: encodeURIComponent(items[i][propertyUserText])
					});
				}
			}
		}
	},

	getUserLastDay: function () {
		var date = (new Date() - 1000 * 60 * 60 * 24) / 1000,
			items = _.filter(this.data.story, function (item) {
				return item.date > date;
			});

		console.log(items);

		this.getDuplicate(this.data.user_last_day,
			_.filter(items, function (item) {
				return item.type == 'topic-cm' || item.type == 'photo-cm' ||
					item.type == 'video-cm' || item.type == 'wall-cm';
			}), 'c', 'user_id');

		this.getDuplicate(this.data.user_last_day,
			_.filter(items, function (item) {
				return item.type == 'topic';
			}), 't', 'user_id');

		this.getDuplicate(this.data.user_last_day,
			_.filter(items, function (item) {
				return item.type == 'photo';
			}), 'p', 'user_id');
	},

	filterFriendsOnly: function (callback) {
		this.data.usersArray = _.keys(this.data.user);

		this.getItems('usersFriendsOnly', this.data.usersArray, 'user_id', 'groups.isMember', {
			group_id: Math.abs(window.config.VK_GROUPE_ID)
		}, 'response', false, App._bind(function () {
			console.log('user_count: ', _.size(this.data.user));

			for (var i = 0; i < this.data.usersArray.length; i++) {
				if (this.data.usersFriendsOnly[i] < 1) {
					delete this.data.user[this.data.usersArray[i]];
				}
			}
			console.log('FriendsOnly: ', _.size(this.data.user));

			if (callback && typeof(callback) === 'function') {
				callback();
			}
		}, this), 0);
	},

	// --------------------------------------------------------------

	stackNext: function () {
		if (this.stack.length) {
			var item = this.stack.shift();

			if (item && typeof(item) === 'function') {
				item();
			}
		}
	},

	api: function (method, params, callback) {
		var curTime = new Date().valueOf();

		// не даем выполнять более 3-х запросов в секунду
		if (curTime - this.apiTime > 1000) {
			this.apiTime = curTime;
			this.apiQueryCount = 1;
			VK.api(method, params, callback);
		} else {
			if (this.apiQueryCount < 3) {
				this.apiQueryCount++;
				VK.api(method, params, callback);
			} else {
				this.apiQueryCount = 0;
				setTimeout(App._bind(function() {
					this.api(method, params, callback);
				}, this), curTime - this.apiTime + 1000);
			}
		}
	},

	getPages: function (varName, method, params, callback) {
		if (!this.data[varName]) {
			this.data[varName] = [];
		}
		console.log(method, params);

		App.renderTemplate('get_pages', {
			method: method,
			params: params
		}, App._bind(function (code) {
			this.api('execute', {
				code: code
			}, App._bind(function (data) {
				if (data && data.response) {
					var count = data.response[0];

					data = _.filter(data.response, function (item){
						return _.isObject(item);
					});

					this.data[varName] = this.data[varName].concat(data);

					if (this.data[varName].length < count) {
						params.offset += data.length;
						this.getPages(varName, method, params, callback);
					} else {
						console.log(count, this.data);

						if (callback && typeof(callback) === 'function') {
							callback();
						}
					}
				} else {
					console.log(data);

					if (data.error) {
						alert('Error! ' + data.error.error_code + ': ' + data.error.error_msg);
					}
				}
			}, this));
		}, this));
	},

	getItems: function (varName, items, idParamName, method, params, responseName, isArray, callback, index) {
		var itemsReq = items.slice(index, index + config.API_REQUEST_COUNT);

		if (!this.data[varName]) {
			this.data[varName] = [];
		}

		console.log(method, params, index);

		App.renderTemplate('get_items', {
			method: method,
			params: params,
			items: itemsReq,
			responseName: responseName,
			isArray: isArray,
			idParamName: idParamName
		}, App._bind(function (code) {
			this.api('execute', {
				code: code
			}, App._bind(function (data) {
				if (data && data.response) {
					data = data.response;
					index = index + data.index;

					if (isArray) {
						data.data = _.filter(data.data, function (item){
							return _.isObject(item);
						});
					}

					this.data[varName] = this.data[varName].concat(data.data);

					if (index < items.length) {
						params.offset = data.offset;
						this.getItems(varName, items, idParamName, method, params, responseName, isArray, callback, index);
					} else {
						if (callback && typeof(callback) === 'function') {
							callback();
						}
					}
				} else {
					console.log(data);

					if (data.error) {
						alert('Error! ' + data.error.error_code + ': ' + data.error.error_msg);
					}
				}
			}, this));
		}, this));
	},

	getDuplicate: function (result, items, name, propertyName) {
		var item;

		if (items && items.length) {
			for (var i = 0; i < items.length; i++) {
				item = propertyName ? items[i][propertyName] : items[i];

				if (result[item]) {
					if (result[item][name]) {
						result[item][name]++;
					} else {
						result[item][name] = 1;
					}
				} else {
					result[item] = {};
					result[item][name] = 1;
				}
			}
		}
	},

	save: function (items, url, callback) {
		var i = 0,
			data = {};

		console.log('post_size: ', _.size(items));

		_.each(items, function (item, key) {
			data[key] = item;

			if (i <= 100) {
				i++;
			} else {
				i = 0;
				$.ajax({
					data: data,
					dataType: 'json',
					url: url,
					type: 'POST'
				});

				data = {};
			}
		});

		$.ajax({
			data: data,
			dataType: 'json',
			url: url,
			type: 'POST',
			success: App._bind(callback, this)
		});
	},

	userCopyTable: function (callback) {
		$.ajax({
			dataType: 'json',
			url: '/rating_app/user_copy_table.php',
			type: 'POST',
			success: App._bind(callback, this)
		});
	},

	afterSave: function () {
		var time = (new Date() - this.time) / 1000;

		console.log('Parse time: ' + time + 'c. (' + time/60 + 'мин.)');

		$.ajax({
			data: {
				parse_time: time
			},
			dataType: 'json',
			url: '/rating_app/user_after_save.php',
			type: 'POST',
			success: function () {
				alert('Completed!');
			}
		});
	}
};