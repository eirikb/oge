var Collision = function(body1, body2) {
	this.body1 = body1;
	this.body2 = body2;
};

var Collision = function(body1, body2, body1Line, body2Line, x, y) {
    this.body1 = body1;
    this.body2 = body2;
    this.body1Line = body1Line;
    this.body2Line = body2Line;
    this.x = x;
    this.y = y;
}

function collisiondetection(body1, body2) {
	if (body1.x <= body2.x + body2.width
			&& body1.x + body1.width >= body2.x
			&& body1.y <= body2.y + body2.height
			&& body1.y + body1.height >= body2.y) {
		if (body1.getLines() != null && body2.getLines() != null) {
			return intersectLines(body1, body2);
		} else if (body1.getLines() == null && body2.getLines() == null) {
			collisions = new Array();
			var x1w = body1.x + body1.width;
			var y1h = body1.y + body1.height;
			var x2w = body2.x + body2.width;
			var y2h = body2.y + body2.height;
			if (x1w > body2.x && body1.x < x2w && y1h > body2.y && body1.y < bpdy2.height) {
				collisions.push(new Collision(body1, body2));
			}
			return collisions;
		}
	}
	return null;
}

function intersectLines(body1, body2, line1,
		line2) {
	return intersectLines(body1.x + line1.start.x, body1.y
			+ line1.start.x, x1 + line1.end.x, body1.y
			+ line1.end.x, body2.x + line2.start.x, body2.y
			+ line2.start.x, body2.x + line2.end.y, body2.y
			+ line2.end.x);
}

function intersectLines(x0, y0, x1,
		y1, x2, y2, x3, y3) {

	var d = (int) ((y3 - y2) * (x1 - x0) - (x3 - x2) * (y1 - y0));

	var n_a = (int) ((x3 - x2) * (y0 - y2) - (y3 - y2) * (x0 - x2));

	var n_b = (int) ((x1 - x0) * (y0 - y2) - (y1 - y0) * (x0 - x2));

	if (d == 0) {
		return null;
	}

	var ua = (n_a << 14) / d;
	var ub = (n_b << 14) / d;

	if (ua >= 0 && ua <= (1 << 14) && ub >= 0 && ub <= (1 << 14)) {
		var hx = x0 + ((ua *  (x1 - x0)) >> 14);
		var hy = y0 + ((ua * (y1 - y0)) >> 14);
		return new Array(hx, hy);
	}
	return null;
}