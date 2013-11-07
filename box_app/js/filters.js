angular.module("vk").filter('thousands', function() {
  return function(input) {
    number = input.toString().split('').reverse();
    var res = [];
    for (var i = 0, max = number.length; i < max; i++) {
      if (i % 3 === 0 && i !== 0) {
        res.push(' ');
      }
      res.push(number[i]);
    }
    return res.reverse().join('');
  };
});

angular.module("vk").filter('sexify', function() {
  return function(input, sex) {
    return sex != 2 ? input +'а' : input;
  };
});

angular.module("vk").filter('pluralize', function() {
  return function(input, words) {
    var word = words[1];
    if (input % 10 == 1 && input % 100 != 11) {
      word = words[0];
    }
    else if (input % 10 === 0 || input % 10 >= 5 || (input % 100 >= 11 && input % 100 <= 14)) {
      word = words[2];
    }
    return input + ' ' + word;
  };
});

angular.module("vk").filter('paginate', function() {
  return function(input, page, perPage) {
    var start = (page - 1) * perPage;
    return input.slice(start, start + perPage);
  };
});