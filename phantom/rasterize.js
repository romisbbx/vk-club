var page = require('webpage').create(),
	system = require('system'),
	address, output1, output2, size;

if (system.args.length < 3 || system.args.length > 5) {
	console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
	console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
	phantom.exit(1);
} else {
	address = system.args[1];
	output1 = system.args[2];
	output2 = system.args[3];
	page.viewportSize = { width: 760, height: 550 };
	if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
		size = system.args[3].split('*');
		page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
			: { format: system.args[3], orientation: 'portrait', margin: '1cm' };
	}

	if (system.args.length > 4) {
		page.zoomFactor = system.args[4];
	}

	page.open(address, function (status) {
		if (status !== 'success') {
			console.log('Unable to load the address!');
			phantom.exit();
		}

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

//				setTimeout(function() {
//					page.render(output);
//					phantom.exit();
//				}, 1000);
			});
		}, 1000);
	});

	page.onAlert = function (msg) {
		console.log("ALERT: " + msg);
		page.render(output2);
		phantom.exit();
	};

	page.onConsoleMessage = function(msg) {
		console.log('CONSOLE: ' + msg);

		if (msg == 'top-100') {
			page.viewportSize = { width: 800, height: 450 };
			page.render(output1);
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