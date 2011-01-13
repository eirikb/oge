/**
 * Direction object
 *
 * @constructur
 * @param {number} cos Cosine
 * @param {number} sin Sines
 * @return {OGE.Direction}
 */
OGE.Direction = function(cos, sin) {
    this.cos = typeof (cos) != 'undefined' ? cos : 0;
    this.sin = typeof (sin) != 'undefined' ? sin : 0;

    /**
     * Rotate the direction based on degrees (not radians)
     * Will update cos and sin accordingly
     * To rotate 'the other way', use negative numbers
     *
     * @param {number} degrees Amount of degrees to roate cos and sin
     * @return this
     */
    this.rotate = function(degrees) {
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
    this.clone = function() {
        return new OGE.Direction(this.cos, this.sin);
    };
};

/**
 * Static funtion for creating a OGE.Direction based on
 * starting and ending cooridnates
 * Calculates cos and sin based on the four arguments
 *
 * @param {number} x1 X-coordinate to start from
 * @param {number} y1 Y-coordinate to start from
 * @param {number} x2 X-coordinate to end on
 * @param {number} y2 Y-coordinate to end on
 * @return {OGE.Direction} A new direction
 */
OGE.Direction.create = function(x1, y1, x2, y2) {
    var a =  y2 - y1;
    var b = x2 - x1;
    var h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    var sin = a / h;
    var cos = b / h;
    return new OGE.Direction(cos, sin);
};
