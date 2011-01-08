OGE.World = function(width, height, zoneSize) {

	OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

	this.width = typeof (width) != 'undefined' ? width : 640;
	this.height = typeof (height) != 'undefined' ? height : 480;
	this.zoneSize = typeof(zoneSize) != 'undefined' ? zoneSize : 10;
	this.activeBodies = new Array();

	var xZones = width / this.zoneSize + 1 << 0;
	var yZones = height / this.zoneSize + 1 << 0;
	this.zones = new Array(xZones);

	var self = this;

	for (var x = 0; x < xZones; x++) {
		this.zones[x] = new Array(yZones);
		for (var y = 0; y < yZones; y++) {
			this.zones[x][y] = new OGE.Zone(x, y);
		}
	};

	this.addBody = function(body) {
		OGE.assert(body instanceof OGE.Body, "argument not instance of OGE.Body");

		if (addBodyToZones(body) !== true) {
			return false;
		}

		if (body.isActive()) {
			this.activeBodies.push(body);
		}

		body.onActive( function() {
			self.activeBodies.push(body);
		});

		body.onDeactive( function() {
			self.activeBodies.pop(body);
		});

		return true;
	};

	this.removeBody = function(body) {
		removeBodyFromZones(body);
	};

	this.getBodies = function(bodyOrX, y, width, height) {
		var body, x;
		body = x = bodyOrX;
		if (arguments.length === 1) {
			x = body.x;
			y = body.y;
			width = body.width;
			height = body.height;
		}

		var bodies = new Array();
		var zones2 = this.getZones(x, y, width, height);
		for (var i = 0; i < zones2.length; i++) {
			var bodies2 = zones2[i].bodies;
			for (var j = 0; j < bodies2.length; j++) {
				var b = bodies2[j];
				var contains = false;
				for (var k = 0; k < bodies.length; k++) {
					if (bodies[k] === b) {
						contains = true;
						break;
					}
				}
				if (!contains) {
					bodies.push(b);
				}
			}
		}

		return bodies;
	};

	this.getZones = function(bodyOrX, y, width, height) {
		var body, x;
		body = x = bodyOrX;
		if (arguments.length === 1) {
			x = body.x;
			y = body.y;
			width = body.width;
			height = body.height;
		}

		if (x >= 0 && x + width - 1 < this.width
				&& y >= 0 && y + height -  1 < this.height) {
			var x1 = x / this.zoneSize << 0;
			var x2 = (x + width - 1) / this.zoneSize << 0;
			var y1 = y / this.zoneSize << 0;
			var y2 = (y + height - 1) / this.zoneSize << 0;

			var pos = 0;
			var z = new Array((x2 - x1) * (y2 - y1) + 1);
			for (var x = x1; x <= x2; x++) {
				for (var y = y1; y <= y2; y++) {
					z[pos++] = this.zones[x][y];
				}
			}
			return z;
		} else {
			return new Array(0);
		}
	};

	this.step = function() {
		for (var i = 0; i < this.activeBodies.length; i++) {
			var body = this.activeBodies[i];
			if (body.speed > 0 && body.direction !== null) {
				moveBody(body);
			}
		}

	};

	var addBodyToZones = function(body) {
		var zones = self.getZones(body);
		if (zones.length === 0) {
			return false;
		}
		for (var i = 0; i < zones.length; i++) {
			zones[i].addBody(body);
		}
		return true;
	};

	var removeBodyFromZones = function(body) {
		var zones = self.getZones(body);
		for (var i = 0; i < zones.length; i++) {
			zones[i].removeBody(body);
			length = body.speed;
		}
	};

	var moveBody = function(body, direction, length) {
		if (arguments.length === 1) {
			direction = body.direction;
			length = body.speed;
		}
		if (length  <= 0) {
			return;
		}
		var endX = body.x + direction.cos * length << 0;
		var endY = body.y + direction.sin * length << 0;
		var lastX = body.x;
		var lastY = body.y;
		var xDiff = body.x < endX ? 1 : -1;
		var yDiff = body.y < endY ? 1 : -1;


		while (body.x << 0 != endX || body.y << 0 != endY) {
			lastX = body.x;
			lastY = body.y;
			removeBodyFromZones(body);
			body.x += body.x << 0 != endX ? xDiff : 0;
			body.y += body.y << 0 != endY ? yDiff : 0;
			// Have to do this since zones can change when moving the body
			var bodies = self.getBodies(body);
			for(var i = 0; i < bodies.length; i++) {
				var body2 = bodies[i];
				if (body !== body2 && !body2.checkCollision(lastX, lastY, body.width, body.height) && body2.checkCollision(body)) {
					var collide1 = body.collide(body2) === true;
					var collide2 = body2.collide(body) === true;
					if (collide1 && collide2) {
						body.x = lastX;
						body.y = lastY;
						if (body.slide) {
							slideBody(body, direction, length);
						}
						addBodyToZones(body);
						return;
					}
				}
			}
			addBodyToZones(body);
			length--;
		}
	};

	var slideBody = function(body, direction, length) {
		var cos = direction.cos;
		var sin = direction.sin;
		var cornerX1, cornerY1, cornerX2, cornerY2, direction1, direction2;
		var hits = function(x, y) {
			var bodies = self.getBodies(x, y, 1, 1);
			for (var i = 0; i < bodies.length; i++){
				var b = bodies[i];
				if(b.x + b.width >= x && b.x <= x
						&& b.y + b.height >= y && b.y <= y)  {
					return true;
				}
			}
			return false;
		};

		if (Math.abs(cos) > Math.abs(sin)) {
			if (cos > 0 ) {
				cornerX1 = cornerX2 = body.x + body.width + 1;
			} else {
				cornerX1 = cornerX2 = body.x - 1;
			}
			cornerY1 = body.y;
			cornerY1 = body.y + body.height;
			direction1 = new OGE.Direction(0, 1);
			direction2 = new OGE.Direction(0, -1);
		} else {
			if (sin > 0 ) {
				cornerY1 = cornerY2 = body.y + body.height + 1;
			} else {
				cornerY1 = cornerY2 = body.y - 1;
			}
			cornerX1 = body.x;
			cornerX2 = body.x + body.width;
			direction1 = new OGE.Direction(1, 0);
			direction2 = new OGE.Direction(-1, 0);
		}
		var corner1 = hits(cornerX1, cornerY1);
		var corner2 = hits(cornerX2, cornerY2);
		if (corner1 && corner2) {
			return;
		} else if (!corner1) {
			direction = direction1;
		} else if (!corner2) {
			direction = direction2;
		}
		moveBody(body, direction, length - 1);
	};

}
