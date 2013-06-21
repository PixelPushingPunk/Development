
var testModule = (function() {

	var myPrivateVar, myPrivateMethod;

	myPrivateVar = 0;

	myPrivateMethod = function ( foo ) {
		console.log( foo );
	};

	return {

		myPublicVar: 0,
		bar: "james",
		myPublicMethod: function ( bar ) {
			myPrivateVar++;
			myPrivateMethod( bar );
		},

		initMethod: function () {
			this.myPublicMethod();
		}

	};
}());


var basketModule = (function () {
	var basket = [];

	function doSomethingPrivate () {

	}

	function doSomethingElsePrivate () {

	}

	return {

		showBasket: function () {
			console.debug(basket);
		},

		addItem: function ( values ) {
			basket.push(values);
		},

		getItemCount: function () {
			return basket.length;
		},

		getTotal: function () {
			var q = this.getItemCount(),
				p = 0;

			while(q--) {
				p +=basket[q].price;
			}

			return p;
		}
	};
}());

basketModule.showBasket();

basketModule.addItem({
	item: "bread",
	price: 0.5
});

basketModule.showBasket();

basketModule.addItem({
	james: "ian",
	randome: "nonesense"
});

basketModule.showBasket();

console.log( 'item count: ' + basketModule.getItemCount() );
console.log( 'total: ' + basketModule.getTotal() );