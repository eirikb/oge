OGE.Body = function(x, y, width, height) {

    OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

    this.x = typeof (x) != 'undefined' ? x : 0;
    this.y = typeof (y) != 'undefined' ? y : 0;
    var width = typeof (width) != 'undefined' ? width : 1;
    var height = typeof (height) != 'undefined' ? height : 1;

    var width = width;
    var height = height;
    var speed = 0;
    var onActive = null;
    var onDeactive = null;

    this.direction = null;

    this.getWidth = function() {
        return width;
    };

    this.getHeight = function() {
        return height;
    };

    this.setDirection = function(x2, y2) {
        this.direction = OGE.Direction.create(this.x, this.y, x2, y2);
    };

    this.setSpeed = function(newSpeed) {
        speed = newSpeed;
        if (speed !== 0) {
            if (onActive !== null) {
                onActive();
            }
        } else {
            if (onDeactive !== null) {
                onDeactive();
            }
        }
    };

    this.getSpeed = function() {
        return speed;
    };

    this.onActive = function(onActiveEvent) {
        onActive = onActiveEvent;
    };

    this.onDeactive = function(onDeactiveEvent) {
        onDeactive = onDeactiveEvent;
    };

}
