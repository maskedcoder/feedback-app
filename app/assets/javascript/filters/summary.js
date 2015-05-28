app.filter('summary', function() {
  return function(input, length) {
    length = length | 150;

    var newStr = input.slice(0, length);

    if (newStr.length < input.length) {
      newStr += '...';
    }

    return newStr;
  };
});
