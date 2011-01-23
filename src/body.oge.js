/**
 * Body object
 *
 * @constructur
 * @param {number} x X-coordinate on world
 * @param {number} y Y-coordinate on world
 * @param {number} width Width of body
 * @param {number} height Height of body
 * @return {OGE.Body}
 */
OGE.Body = function(x, y, width, height) {
	this.x = typeof(x) != 'undefined' ? x: 0;
	this.y = typeof(y) != 'undefined' ? y: 0;
	this.width = typeof(width) != 'undefined' ? width: 1;
	this.height = typeof(height) != 'undefined' ? height: 1;

	this.speed = 0;
	this.direction = null;
	this.slide = false;
	this.active = false;

	this.onCollisions = [];
};

/**
 * Remove all onCollision events
 */
OGE.Body.prototype.clearEvents = function() {
	this.onCollisions = [];
};

/**
 * Add event for onCollision
 * Will trigger when body colide with another body
 *
 * @param {Function} onCollisionEvent event
 */
OGE.Body.prototype.onCollision = function(onCollisionEvent) {
	this.onCollisions.push(onCollisionEvent);
};

/**
 * Collide two bodies (this and given body)
 * Will trigger all onCollision events
 * 
 * @param {OGE.Body} body Body this body has collided with
 * @return false if one of onCollision events return false, true if not
 */
OGE.Body.prototype.collide = function(body) {
	var collide = true;
	for (var i = 0; i < this.onCollisions.length; i++) {
		if (this.onCollisions[i](body) === false) {
			collide = false;
		}
	}
	return collide;
};

/**
 * Collide two bodies (this and given body)
 * Will trigger all onCollision events
 * 
 * @param {OGE.Body} body Body this body has collided with
 * @return false if one of onCollision events return false, true if not
 */
OGE.Body.prototype.collide = function(body) {
	var collide = true;
	for (var i = 0; i < this.onCollisions.length; i++) {
		if (this.onCollisions[i](body) === false) {
			collide = false;
		}
	}
	return collide;
};

/**
 * Check if this body intersects with a given body/location
 *
 * @param {OGE.Body} bodyOrX Body to chech intersection with,
 *                   this can also be {number} x
 * @param {number} y Y (optional)
 * @param {number} width Width (optional)
 * @param {number} height Height (optional)
 * @return true if the bodies intersect, false if not
 */
OGE.Body.prototype.intersects = function(bodyOrX, y, width, height) {
	var x, body;
	x = body = bodyOrX;
	if (arguments.length === 1) {
		x = body.x;
		y = body.y;
		width = body.width;
		height = body.height;
	}

	return this.x < x + width && this.x + this.width > x && this.y < y + height && this.y + this.height > y;
};

/**
 * Check how much this body intersects with nother body
 * Will not check if they actually intersect,
 * so can return negative number @see #intersects 
 *
 * @param {OGE.Body} bodyOrX Body to chech intersection with,
 *                   this can also be {number} x
 * @param {number} y Y (optional)
 * @param {number} width Width (optional)
 * @param {number} height Height (optional)
 * @return How much the two bodies intersect, can be negative
 */
OGE.Body.prototype.intersection = function(bodyOrX, y, width, height) {
	var x, body;
	x = body = bodyOrX;
	if (arguments.length === 1) {
		x = body.x;
		y = body.y;
		width = body.width;
		height = body.height;
	}

	var sx, ex, sy, ey;
	sx = this.x > x ? this.x: x;
	ex = this.x + this.width < x + width ? this.x + this.width: x + width;
	sy = this.y > y ? this.y: y;
	ey = this.y + this.height < y + height ? this.y + this.width: y + height;
	return (ex - sx) * (ey - sy);
};

