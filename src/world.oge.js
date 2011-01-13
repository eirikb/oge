OGE.World = function(width, height, zoneSize) {
    this.width = typeof (width) != 'undefined' ? width : 640;
    this.height = typeof (height) != 'undefined' ? height : 480;
    this.zoneSize = typeof(zoneSize) != 'undefined' ? zoneSize : 10;
    this.activeBodies = [];

    var xZones = width / this.zoneSize + 1 << 0;
    var yZones = height / this.zoneSize + 1 << 0;
    this.zones = [];

    var self = this;

    for (var x = 0; x < xZones; x++) {
        this.zones[x] = [];
        for (var y = 0; y < yZones; y++) {
            this.zones[x][y] = new OGE.Zone(x, y);
        }
    }

    this.addBody = function(body) {
        if (addBodyToZones(body) !== true) {
            return false;
        }

        if (body.isActive()) {
            this.activeBodies.push(body);
        }

        body.clearEvents();

        body.onActive( function() {
            self.activeBodies.push(body);
        });

        body.onDeactive( function() {
            for (var i = 0; i < self.activeBodies.length; i++) {
                if (self.activeBodies[i] === body) {
                    self.activeBodies.splice(i, 1);
                    break;
                }
            }
        });

        return true;
    };

    this.removeBody = function(body) {
        removeBodyFromZones(body);
        for (var i = 0; i < self.activeBodies.length; i++) {
            if (self.activeBodies[i] === body) {
                self.activeBodies.splice(i, 1);
                break;
            }
        }

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
        x = x < 0 ? 0 : x;
        x = x + width > this.width ? this.width - width : x;
        y = y < 0 ? 0 : y;
        y = y + height > this.height ? this.height - height : y;

        var bodies = [];
        var zones = this.getZones(x, y, width, height);
        for (var i = 0; i < zones.length; i++) {
            var bodies2 = zones[i].bodies;
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

        if (x >= 0 && x + width - 1 < this.width &&
                y >= 0 && y + height -  1 < this.height) {
            var x1 = x / this.zoneSize << 0;
            var x2 = (x + width) / this.zoneSize << 0;
            var y1 = y / this.zoneSize << 0;
            var y2 = (y + height) / this.zoneSize << 0;

            var pos = 0;
            var z = [];
            for (x = x1; x <= x2; x++) {
                for (y = y1; y <= y2; y++) {
                    z[pos++] = this.zones[x][y];
                }
            }
            return z;
        } else {
            return [];
        }
    };

    this.step = function(steps) {
        steps = arguments.length === 0 ? 1 : steps;
        for (var step = 0; step < steps; step++) {
            for (var i = 0; i < this.activeBodies.length; i++) {
                var body = this.activeBodies[i];
                if (body.speed > 0 && body.direction !== null) {
                    moveBody(body);
                }
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
        }
    };

    var moveBody = function(body, direction, steps) {
        var lastX, lastY, bodies;
        if (arguments.length === 1) {
            direction = body.direction;
            steps = body.speed;
        }

        for (var i = 0; i < steps; i++) {
            lastX = body.x;
            lastY = body.y;
            removeBodyFromZones(body);
            body.x += direction.cos;
            body.y += direction.sin;

            bodies = self.getBodies(body);
            for (var j = 0; j < bodies.length; j++) {
                var body2 = bodies[j];
                if (body !== body2 && !body2.intersects(lastX, lastY, body.width, body.height) && body2.intersects(body)) {
                    var collide1 = body.collide(body2) === true;
                    var collide2 = body2.collide(body) === true;
                    if (collide1 && collide2) {
                        body.x = lastX;
                        body.y = lastY;
                        addBodyToZones(body);
                        if (body.slide && steps - j > 0) {
                            slideBody(body, direction);
                        }  else {
                            return;
                        }
                    }
                }
            }
            addBodyToZones(body);
        }
    };

    var slideBody = function(body, direction) {
        var getIntersection = function(direction) {
            var intersection = 0;
            var x = body.x + direction.cos * 1.9;
            var y = body.y + direction.sin * 1.9;
            var bodies = self.getBodies(x, y, body.width, body.height);
            for (var i = 0; i < bodies.length; i++) {
                var body2 = bodies[i];
                if (body2 !== body && body2.intersects(x, y, body.width, body.height)) {
                    intersection += body2.intersection(x, y, body.width, body.height);
                }
            } 
            return intersection << 0;
        };

        var intersection1 = getIntersection(direction.clone().rotate(-45));
        var intersection2 = getIntersection(direction.clone().rotate(45));
        if (intersection1 < intersection2) {
            moveBody(body, direction.clone().rotate(-90), 1);
        } else if (intersection1 > intersection2) {
            moveBody(body, direction.clone().rotate(90), 1);
        }
    };
};
