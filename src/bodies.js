oge.Bodies = function(width, height, zones) {
    var self = this,
    onCollisions = {};

    self.width = width;
    self.height = height;

    function intersects(body, x, y, width, height) {
        if (arguments.length === 2) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }

        return body.x < x + width && body.x + body.width > x && body.y < y + height && body.y + body.height > y;
    }

    function intersections(body, x, y, width, height) {
        var sx = Math.min(body.x + body.width, x + width) - Math.max(body.x, x),
        sy = Math.min(body.y + body.height, y + height) - Math.max(body.y, y);
        return sx * sy;
    }


    function slideBody(body, direction, collisions) {
        var calc, r1, r2, r3, r4, rotate, radius, cos, sin;

        radius = Math.atan2(Math.sin(Math.asin(direction.sin)), Math.cos(Math.acos(direction.cos)));
        cos = Math.cos(radius);
        sin = Math.sin(radius);

        calc = function(r) {
            var x, y, i, body2, tot = 0,
            dir = oge.direction.rotate({
                cos: cos,
                sin: sin
            },
            r);
            x = body.x + Math.round(dir.cos);
            y = body.y + Math.round(dir.sin);
            for (i = 0; i < collisions.length; i++) {
                body2 = collisions[i];
                if (intersects(body2, x, y, body.width, body.height)) {
                    tot += intersections(body2, x, y, body.width, body.height);
                }
            }
            return tot;
        };

        r1 = calc( - 90);
        r2 = calc( - 45);
        r3 = calc(45);
        r4 = calc(90);

        rotate = 0;

        if (direction.cos === 0 || direction.sin === 0) {
            if (r1 !== r4 || r2 !== r3) {
                rotate = 45;
                if (r1 === 0 || r4 === 0) {
                    if (Math.min(r2, r3) < Math.abs(cos) * body.width + Math.abs(sin) * body.height) {
                        if (r2 < r3) {
                            rotate = - 90;
                        } else {
                            rotate = 90;
                        }
                    }
                }
            }
        } else {
            if (r2 === 0) {
                rotate = - 45;
            } else if (r3 === 0) {
                rotate = 45;
            }
        }

        if (rotate !== 0) {
            self.moveBody(body, oge.direction.rotate({
                cos: cos,
                sin: sin
            },
            rotate), 1);
        }
    }

    self.onCollision = function(body, cb) {
        if (!onCollisions[body]) {
            onCollisions[body] = [];
        }
        onCollisions[body].push(cb);
    };

    self.moveBody = function(body, direction, steps) {
        var lastX, lastY, body2, collision, bodies, i, j, k, collisions;

        if (arguments.length === 1) {
            direction = body.direction;
            steps = body.speed;
        }

        for (i = 0; i < steps; i++) {
            collisions = [];
            lastX = body.x;
            lastY = body.y;

            body.x += Math.round(direction.cos);
            body.y += Math.round(direction.sin);

            if (body.x >= 0 && body.x + body.width < self.width && body.y >= 0 && body.y + body.height < self.height) {
                bodies = zones.getBodies(body);
                for (j = 0; j < bodies.length; j++) {
                    body2 = bodies[j];
                    if (body !== body2 && ! intersects(body2, lastX, lastY, body.width, body.height) && intersects(body2, body)) {
                        if (onCollisions[body]) {
                            collision = {
                                body1: body,
                                body2: body2
                            };
                            for (k = 0; k < onCollisions[body].length; k++) {
                                onCollisions[body][k](collision);
                            }
                        }
                        collisions.push(body2);
                    }
                }
            } else {
                body.x = lastX;
                body.y = lastY;
            }
            if (collisions.length > 0) {
                body.x = lastX;
                body.y = lastY;
            }
            zones.addBody(zones, body);
            if (collisions.length > 0) {
                if (body.slide && j > 0) {
                    slideBody(body, direction, collisions);
                } else {
                    return;
                }
            }
        }
    };
};

