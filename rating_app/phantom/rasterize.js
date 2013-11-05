var page = require('webpage').create(),
	system = require('system'),
	address, savePath, size;

if (system.args.length < 2) {
	console.log('Usage: rasterize.js URL filename');
	phantom.exit(1);
} else {
	address = system.args[1];
	savePath = system.args[2];
	page.viewportSize = { width: 800, height: 450 };

	page.open(address, function (status) {
		if (status !== 'success') {
			console.log('Unable to load the address!');
			phantom.exit();
		}

		// авторизация
		setTimeout(function() {
			page.evaluate(function() {
				var quickEmail = document.getElementById('quick_email'),
					quickPass = document.getElementById('quick_pass'),
					quickLoginButton = document.getElementById('quick_login_button');

				if (quickEmail && quickPass && quickLoginButton) {
					quickEmail.setAttribute('value', '79608471790'); // login
					quickPass.setAttribute('value', 'Wx6BdmzRV'); // password
					quickLoginButton.click();
				}
			});
		}, 1000);
	});

	page.onAlert = function (msg) {
		console.log("ALERT: " + msg);
		phantom.exit();
	};

	page.onConsoleMessage = function(msg) {
		console.log('CONSOLE: ' + msg);

		if (msg == 'top-active') {
			page.render(savePath + 'top-active.png');
			page.viewportSize = { width: 760, height: 550 };
		}

		if (msg == 'top-100-1') {
			page.render(savePath + 'top-100-1.png');
		}

		if (msg == 'top-100-19') {
			page.render(savePath + 'top-100-19.png');
		}

		if (msg == 'top-100-37') {
			page.render(savePath + 'top-100-37.png');
		}

		// Добавление записи на стену
		if (msg == 'post') {
			setTimeout(function() {
				page.evaluate(function() {
					var box = document.getElementById('box_layer_wrap'),
						btn;

					if (box) {
						btn = box.getElementsByTagName('button')[0];
						btn.click();
					}
				});
			}, 2000);
		}
	};
}