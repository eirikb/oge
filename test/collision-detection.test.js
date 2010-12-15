var body1;
var body2;

var collisionDetection = {
	setUp : function() {
		body1 = new Body(0, 0, 100, 100);
		body1.lineFrom(0, 0).lineTo(100, 0).lineTo(100, 100).lineTo(50, 50)
				.lineTo(0, 100).lineTo(0, 0);
		body2 = new Body(0, 200, 100, 100);
		body2.lineFrom(0, 0).lineTo(50, 50).lineTo(100, 0).lineTo(0, 0);
	},

	tearDown : function() {
	},

	testLines : function() {
		var lines = body1.lines;
		checkLine(0, 0, 100, 0, lines[0]);
		checkLine(100, 0, 100, 100, lines[1]);
		checkLine(100, 100, 50, 50, lines[2]);
		checkLine(50, 50, 0, 100, lines[3]);
		checkLine(0, 100, 0, 0, lines[4]);

		lines = body2.lines;
		checkLine(0, 0, 50, 50, lines[0]);
		checkLine(50, 50, 100, 0, lines[1]);
		checkLine(100, 0, 0, 0, lines[2]);
	}
};

function checkLine(startX, startY, endX, endY, line) {
	jsUnity.assertions.assertIdentical(startX, line.start.x);
	jsUnity.assertions.assertIdentical(startY, line.start.y);
	jsUnity.assertions.assertIdentical(endX, line.end.x);
	jsUnity.assertions.assertIdentical(endY, line.end.y);
}

jsUnity.run(collisionDetection);
