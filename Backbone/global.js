// model create
Person = Backbone.Model.extend({
	// set model defaults
	defaults: {
		name: 'Fetus',
		age: 0,
		child: ''
	},

	initialize: function () {
		alert('welcome to this');
		this.on('change:name', function(model) {
			var name = model.get('name');
			alert('changed my name to ' + name);
		});
	},
	adopt: function ( newChildsName ) {
		this.set({ child: newChildsName });
	}
});

// set attribute
var person = new Person ({ name: "Thomas", age: 67, child: "Ryan" });

// get attribute
var age = person.get("age");
var name = person.get("name");
var child = person.get("child");

// use the adopt method
person.adopt('john');
var child = person.get("child");