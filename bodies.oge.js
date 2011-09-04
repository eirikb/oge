oge.Bodies = function(width, height, zones) {
    var self = this,
    onCollisions = {};

    self.width = width;
    self.height = height;

    function slideBody(body, direction) {
        var getIntersection = function(direction) {
            var intersection, i, j, x, y, body2, ignore, ignoreBodies = [],
            bodies = self.getBodies(body);

            for (i = 0; i < bodies.length; i++) {
                body2 = bodies[i];
                if (body2 !== body && body2.intersects(body)) {
                    ignoreBodies.push(body2);
                }
            }
            intersection = 0;
            x = body.x + direction.cos * 1.9 << 0;
            if (x !== body.x) {
                x = body.x + (x > body.x ? 1: - 1);
            }
            y = body.y + direction.sin * 1.9 << 0;
            if (y !== body.y) {
                y = body.y + (y > body.y ? 1: - 1);
            }
            bodies = self.getBodies(x, y, body.width, body.height);
            for (i = 0; i < bodies.length; i++) {
                body2 = bodies[i];
                if (body2 !== body && body2.intersects(x, y, body.width, body.height)) {
                    ignore = false;
                    for (j = 0; j < ignoreBodies.length; j++) {
                        if (body2 === ignoreBodies[j]) {
                            ignore = true;
                            break;
                        }
                    }
                    if (!ignore) {
                        intersection += body2.intersection(x, y, body.width, body.height);
                    }
                }
            }
            return intersection << 0;
        };

        var intersection1 = getIntersection(direction.clone().rotate( - 45));
        var intersection2 = getIntersection(direction.clone().rotate(45));
        if (intersection1 < intersection2) {
            moveBody(body, direction.clone().rotate( - 90), 1);
        } else if (intersection1 > intersection2) {
            moveBody(body, direction.clone().rotate(90), 1);
        }
    }

    function intersects(body, x, y, width, height) {
        if (arguments.length === 2) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }

        return body.x < x + width && body.x + body.width > x && body.y < y + height && body.y + body.height > y;
    };

    function intersection(body, x, y, width, height) {

        if (arguments.length === 2) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }

        sx = body.x > x ? body.x: x;
        ex = body.x + body.width < x + width ? body.x + body.width: x + width;
        sy = body.y > y ? body.y: y;
        ey = body.y + body.height < y + height ? body.y + body.width: y + height;
        return (ex - sx) * (ey - sy);
    }

    self.onCollision = function(body, cb) {
        if (!onCollisions[body]) {
            onCollisions[body] = [];
        }
        onCollisions[body].push(cb);
    };

    self.moveBody = function(body, direction, steps) {
        var lastX, lastY, body2, collision, bodies, i, j, k;

        if (arguments.length === 1) {
            direction = body.direction;
            steps = body.speed;
        }

        for (i = 0; i < steps; i++) {
            lastX = body.x;
            lastY = body.y;

            zones.removeBody(zones, body);

            body.x += direction.cos;
            body.y += direction.sin;

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
                        body.x = lastX;
                        body.y = lastY;
                        zones.addBody(zones, body);
                        if (body.slide && j >= 0) {
                            slideBody(body, direction);
                        } else {
                            return;
                        }
                    }
                }
            } else {
                body.x = body.x < 0 ? 0: body.x;
                body.x = body.x + body.width > self.width ? self.width - body.width: body.x;
                body.y = body.y < 0 ? 0: body.y;
                body.y = body.y + body.height > self.height ? self.height - body.height: body.y;
            }
            zones.addBody(zones, body);
        }
    };

    self.rotate = function(direction, degrees) {
        if (typeof direction === 'object') {
            var radian = degrees * (Math.PI / 180);
            direction.cos = Math.cos(Math.acos(direction.cos) + radian);
            direction.sin = Math.sin(Math.asin(direction.sin) + radian);
        }
    };
};

