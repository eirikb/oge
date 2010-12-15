var body1;
var body2;

var collisionDetection = {
	setUp : function() {
		body1 = new Body(0, 0, 100, 100);
		body2 = new Body(0, 200, 100, 100);
	},

	tearDown : function() {
	},

	testA : function() {
		jsUnity.assertions.assertTrue(1 == 1);
	},

	testB : function() {
	}
};

jsUnity.run(collisionDetection);
