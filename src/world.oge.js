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

        var z = this.getZones(body);
        if (z.length === 0) {
            return false;
        }
        for (var i = 0; i < z.length; i++) {
            z[i].addBody(body);
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
        var zones2 = this.getZones(body);
        for (var i = 0; i < zones2.length; i++) {
            zones2[i].removeBody(body);
        }
    };

    this.getBodies = function(body) {
        var bodies = new Array();
        var zones2 = this.getZones(body);
        for (var i = 0; i < zones2.length; i++) {
            var bodies2 = zones2[i].bodies;
            for (var j = 0; j < bodies2.length; j++) {
                var b = bodies2[j];
                if (b !== body) {
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
        }

        return bodies;
    };

    this.getZones = function(body) {
        if (body.x >= 0 && body.x + body.width - 1 < this.width
        && body.y >= 0 && body.y + body.height -  1< this.height) {
            var x1 = body.x / this.zoneSize << 0;
            var x2 = (body.x + body.width - 1) / this.zoneSize << 0;
            var y1 = body.y / this.zoneSize << 0;
            var y2 = (body.y + body.height - 1) / this.zoneSize << 0;

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
                var endX = body.x + body.direction.cos * body.speed << 0;
                var endY = body.y + body.direction.sin * body.speed << 0;
                move(body, endX, endY);
            }
        }

    };

    var move = function(body, endX, endY) {
        var lastX = body.x;
        var lastY = body.y;
        var xDiff = body.x < endX ? 1 : -1;
        var yDiff = body.y < endY ? 1 : -1;
        while (body.x << 0 != endX || body.y << 0 != endY) {
            lastX = body.x;
            lastY = body.y;
            body.x += body.x << 0 != endX ? xDiff : 0;
            body.y += body.y << 0 != endY ? yDiff : 0;
            // Have to do this since zones can change when moving the body
            var bodies = self.getBodies(body);
            for(var i = 0; i < bodies.length; i++) {
                var body2 = bodies[i];
                if (!body2.checkCollision(lastX, lastY, body.width, body.height) && body2.checkCollision(body)) {
                    var collide1 = body.collide(body2) === true;
                    var collide2 = body2.collide(body) === true;
                    if (collide1 && collide2) {
                        body.x = lastX;
                        body.y = lastY;
                        return;
                    }
                }
            }
        }
    };

}
