oge.Bodies = function(width, height, zones) {
    var self = this,
    onCollisions = {};

    self.width = width;
    self.height = height;

    function getIntersection(body, direction) {
        var intersection, i, j, x, y, body2, ignore, ignoreBodies = [],
        bodies = zones.getBodies(body);

        for (i = 0; i < bodies.length; i++) {
            body2 = bodies[i];
            if (body2 !== body && intersects(body, body2)) {
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
        bodies = zones.getBodies(x, y, body.width, body.height);
        for (i = 0; i < bodies.length; i++) {
            body2 = bodies[i];
            if (body2 !== body && intersects(body2, x, y, body.width, body.height)) {
                ignore = false;
                for (j = 0; j < ignoreBodies.length; j++) {
                    if (body2 === ignoreBodies[j]) {
                        ignore = true;
                        break;
                    }
                }
                if (!ignore) {
                    intersection += intersections(body2, x, y, body.width, body.height);
                }
            }
        }
        return intersection << 0;
    }

    function slideBody(body, direction) {
        var direction1 = oge.direction.rotate({
            cos: direction.cos,
            sin: direction.sin
        },
        - 45),
        direction2 = oge.direction.rotate({
            cos: direction.cos,
            sin: direction.sin
        },
        45),
        intersection1 = getIntersection(body, direction1),
        intersection2 = getIntersection(body, direction2),
        rotate = 0;

        if (intersection1 < intersection2) {
            rotate = - 90;
        } else if (intersection1 > intersection2) {
            rotate = 90;
        }
        if (rotate !== 0) {
            direction = oge.direction.rotate({
                cos: direction.cos,
                sin: direction.sin
            },
            rotate);
            self.moveBody(body, direction, 1);
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
    }

    function intersections(body, x, y, width, height) {

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

};

