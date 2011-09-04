oge.bodies = {};

oge.bodies.moveBody = function(zones, body, direction, steps) {
    var lastX, lastY, body2, collide, bodies, i, j;

    if (arguments.length === 1) {
        direction = body.direction;
        steps = body.speed;
    }

    for (i = 0; i < steps; i++) {
        lastX = body.x;
        lastY = body.y;

        oge.zones.removeBodyFromZones(zones, body);

        body.x += direction.cos;
        body.y += direction.sin;

        if (body.x >= 0 && body.x + body.width < self.width && body.y >= 0 && body.y + body.height < self.height) {
            bodies = getBodies(body);
            for (j = 0; j < bodies.length; j++) {
                body2 = bodies[j];
                if (body !== body2 && ! intersects(body2, lastX, lastY, body.width, body.height) && intersects(body2, body)) {
                    collide = {
                        body1: body,
                        body2: body2
                    };
                    body.x = lastX;
                    body.y = lastY;
                    oge.zones.addBodyToZones(zones, body);
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
            collide(body, body);
        }
        oge.zones.addBodyToZones(zones, body);
    }
};

oge.bodies.slideBody = function(body, direction) {
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
};

oge.bodies.intersects = function(body1, x, y, width, height) {
    if (arguments.length === 2) {
        y = x.y;
        width = x.width;
        height = x.height;
        x = x.x;
    }

    return this.x < x + width && this.x + this.width > x && this.y < y + height && this.y + this.height > y;
}

oge.bodies.intersection = function(body, bodyOrX, y, width, height) {
    var x, body;
    x = body = bodyOrX;
    if (arguments.length === 1) {
        x = body.x;
        y = body.y;
        width = body.width;
        height = body.height;
    }

    var sx, ex, sy, ey;
    sx = this.x > x ? this.x: x;
    ex = this.x + this.width < x + width ? this.x + this.width: x + width;
    sy = this.y > y ? this.y: y;
    ey = this.y + this.height < y + height ? this.y + this.width: y + height;
    return (ex - sx) * (ey - sy);
};

oge.rotate = function(degrees) {
    var radian = degrees * (Math.PI / 180);
    this.cos = Math.cos(Math.acos(this.cos) + radian);
    this.sin = Math.sin(Math.asin(this.sin) + radian);
    return this;
}

