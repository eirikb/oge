OGE.Body = function(x, y, width, height) {

    OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

    var x = typeof (x) != 'undefined' ? x : 0;
    var y = typeof (y) != 'undefined' ? y : 0;
    var width = typeof (width) != 'undefined' ? width : 1;
    var height = typeof (height) != 'undefined' ? height : 1;

    var speed = 0;
    var onActive = null;
    var onDeactive = null;

    var direction = null;

    this.x = function(newX) {
        if (arguments.length > 0) {
            x = newX;
        }
        return x;
    };

    this.y = function(newY) {
        if (arguments.length > 0) {
            y = newY;
        }
        return y;
    };

    this.width = function() {
        return width;
    };

    this.height = function() {
        return height;
    };

    this.direction = function(newDirection) {
        if (arguments.length > 0) {
            direction = newDirection;
        };
        return direction;
    };

    this.setDirection = function(x2, y2) {
        direction = OGE.Direction.create(x, y, x2, y2);
    };

    this.getDirection = function() {
        return direction;
    };

    this.speed = function(newSpeed) {
        if (arguments.length > 0) {
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
        }
        return speed;
    };

    this.onActive = function(onActiveEvent) {
        onActive = onActiveEvent;
    };

    this.onDeactive = function(onDeactiveEvent) {
        onDeactive = onDeactiveEvent;
    };

}
