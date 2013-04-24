require(['jquery.js'], function(jquery){
	alert('test');
});

var MODULE = (function () {
	var my = {},
		privateVariable = 1;

	function privateMethod() {
		// ...
	}

	my.moduleProperty = 1;
	my.moduleMethod = function () {
		// ...
	};
	my.anotherMethod = function () {
		// added method...
	};	

	return my;
}());

var MODULE = (function (my) {
	my.anotherMethod = function () {
		// added method...
	};

	return my;
}(MODULE));