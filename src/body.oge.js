OGE.Body = function(x, y, width, height) {

    OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

    this.x = typeof (x) != 'undefined' ? x : 0;
    this.y = typeof (y) != 'undefined' ? y : 0;
    this.width = typeof (width) != 'undefined' ? width : 1;
    this.height = typeof (height) != 'undefined' ? height : 1;

    this.speed = 0;
    this.direction = null;

    var active = false;

    var onActive = new Array();
    var onDeactive = new Array();
    var onCollision = new Array();

    this.setDirection = function(x2, y2) {
        this.direction = OGE.Direction.create(this.x, this.y, x2, y2);
    };

    this.isActive = function() {
        return active;
    };

    this.setActive = function(newActive) {
        if (active !== newActive) {
            active = newActive;
            if (active) {
                for (var i = 0; i < onActive.length; i++) {
                    onActive[i]();
                }
            } else {
                for (var i = 0; i < onDeactive.length; i++) {
                    onDeactive[i]();
                }
            }
        }
    };

    this.onActive = function(onActiveEvent) {
        onActive.push(onActiveEvent);
    };

    this.onDeactive = function(onDeactiveEvent) {
        onDeactive.push(onDeactiveEvent);
    };

    this.onCollision = function(onCollisionEvent) {
        onCollision.push(onCollisionEvent);
    };

    this.collide = function(collision) {
        for (var i = 0; i < onCollision.length; i++) {
            onCollision[i](collision);
        }
    };

}
