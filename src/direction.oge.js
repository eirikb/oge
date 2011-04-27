/**
 * Direction object
 *
 * @constructur
 * @param {number} cos Cosine
 * @param {number} sin Sines
 * @return {OGE.Direction}
 */
OGE.Direction = function(cos, sin) {
	this.cos = typeof(cos) != 'undefined' ? cos: 0;
	this.sin = typeof(sin) != 'undefined' ? sin: 0;

};

/**
 * Rotate the direction based on degrees (not radians)
 * Will update cos and sin accordingly
 * To rotate 'the other way', use negative numbers
 *
 * @param {number} degrees Amount of degrees to roate cos and sin
 * @return this
 */
OGE.Direction.prototype.rotate = function(degrees) {
	var radian = degrees * (Math.PI / 180);
	this.cos = Math.cos(Math.acos(this.cos) + radian);
	this.sin = Math.sin(Math.asin(this.sin) + radian);
	return this;
};

/**
 * Clone this direction
 * 
 * @return new OGE.Direction with same cos and sin
 */
OGE.Direction.prototype.clone = function() {
	return OGE.Direction.deserialize(this.serialize());
};

OGE.Direction.prototype.serialize = function() {
	return OGE.merge({}, this);
};

OGE.Direction.deserialize = function(data) {
	var direction = new OGE.Direction(data.cos, data.sin);
	return OGE.merge(direction, data);
};

