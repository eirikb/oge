var Collision = function(body1, body2) {
	this.body1 = body1;
	this.body2 = body2;
};

function collisiondetection(body1, body2) {
	if (body1.x <= body2.x + body2.width
			&& body1.x + body1.width >= body2.x
			&& body1.y <= body2.y + body2.height
			&& body1.y + body1.height >= body2.y) {
		if (body1.getLines() != null && body2.getLines() != null) {
			return intersectLines(body1, body2);
		} else if (body1.getLines() == null && body2.getLines() == null) {
			collisions = new Array();
			int x1 = (int) body1.x;
			int y1 = (int) body1.y;
			int x1w = (int) (body1.x + body1.width);
			int y1h = (int) (body1.y + body1.height);
			int x2 = (int) body2.x;
			int y2 = (int) body2.y;
			int x2w = (int) (body2.x + body2.width);
			int y2h = (int) (body2.y + body2.height);
			if (x1w > x2 && x1 < x2w && y1h > y2 && y1 < y2h) {
				collisions.push(new Collision(body1, body2));
			}
			return collisions;
		}
	}
	return null;
}

function intersectLines(body1, body2, line1,
		line2) {
	double x1 = body1.x;
	double y1 = body1.x;
	double x2 = body2.x;
	double y2 = body2.x;
	return intersectLines(x1 + line1.getStart().x, y1
			+ line1.getStart().x, x1 + line1.getEnd().x, y1
			+ line1.getEnd().x, x2 + line2.getStart().x, y2
			+ line2.getStart().x, x2 + line2.getEnd().y, y2
			+ line2.getEnd().x);
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
		int hx = (int) x0 + ((ua * (int) (x1 - x0)) >> 14);
		int hy = (int) y0 + ((ua * (int) (y1 - y0)) >> 14);
		return new Array(hx, hy);
	}
	return null;
}