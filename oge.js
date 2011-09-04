/*!
 * The MIT License
 *
 * Copyright (c) 2011 Eirik Brandtzæg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author Eirik Brandtzæg <eirikb@eirikb.no>
 * @Version 0.9
 */

var oge = {
    version: 0.9
};

oge.World = function(width, height, zoneSize) {
    var self = this,
    zones = [],
    activeBodies = [],
    zoneSize = typeof zoneSize !== 'undefined' ? zoneSize: 10;

    self.width = width;
    self.height = height;

    createZones();

    function createZones() {
        var x, y, xZones = Math.floor(width / zoneSize + 1),
        yZones = Math.floor(height / zoneSize + 1);

        for (x = 0; x < xZones; x++) {
            zones[x] = [];
            for (y = 0; y < yZones; y++) {
                zones[x][y] = {
                    bodies: []
                };
            }
        }
    }

    function getZones(x, y, width, height) {
        var x1, x2, y1, y2, z = [];
        if (arguments.length === 1) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }

        if (x >= 0 && x + width - 1 < self.width && y >= 0 && y + height - 1 < self.height) {
            x1 = Math.floor(x / zoneSize);
            x2 = Math.floor((x + width) / zoneSize);
            y1 = Math.floor(y / zoneSize);
            y2 = Math.floor((y + height) / zoneSize);

            for (x = x1; x <= x2; x++) {
                for (y = y1; y <= y2; y++) {
                    z.push(zones[x][y]);
                }
            }
        }
        return z;
    }

    function addBodyToZones(body) {
        var i, z = getZones(body);

        for (i = 0; i < z.length; i++) {
            z[i].bodies.push(body);
        }
        return z.length > 0;
    }

    function removeBodyFromZones(body) {
        var i, j, z = getZones(body);

        for (i = 0; i < z.length; i++) {
            for (j = 0; j < z[i].bodies.length; j++) {
                if (z[i].bodies[j] === body) {
                    z[i].bodies.splice(j, 1);
                    break;
                }
            }
        }
    }

    function moveBody(body, direction, steps) {
        var lastX, lastY, body2, collide, bodies, i, j;

        if (arguments.length === 1) {
            direction = body.direction;
            steps = body.speed;
        }

        for (i = 0; i < steps; i++) {
            lastX = body.x;
            lastY = body.y;

            removeBodyFromZones(body);

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
                        addBodyToZones(body);
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
            addBodyToZones(body);
        }
    }

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

    function getBodies(x, y, width, height) {
        var z, bodies2, b, contains, i, j, k, z, bodies = [];

        if (arguments.length === 1) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }

        x = x < 0 ? 0: x;
        x = x + width > self.width ? self.width - width: x;
        y = y < 0 ? 0: y;
        y = y + height > self.height ? self.height - height: y;

        z = getZones(x, y, width, height);
        for (i = 0; i < z.length; i++) {
            bodies2 = z[i].bodies;
            for (j = 0; j < bodies2.length; j++) {
                b = bodies2[j];
                contains = false;
                for (k = 0; k < bodies.length; k++) {
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
    }

    function intersects(body1, x, y, width, height) {
        if (arguments.length === 2) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }

        return this.x < x + width && this.x + this.width > x && this.y < y + height && this.y + this.height > y;
    }

    self.step = function(steps) {
        var i, body, steps = arguments.length === 0 ? 1: steps;

        for (step = 0; step < steps; step++) {
            for (i = 0; i < activeBodies.length; i++) {
                body = activeBodies[i];
                if (body.speed > 0 && body.direction !== null) {
                    moveBody(body);
                }
            }
        }
    };

    self.addBody = function(body, active) {
        if (!addBodyToZones(body)) {
            return false;
        }

        if (active) {
            activeBodies.push(body);
        }

        return true;
    };

    self.removeBody = function(body) {
        var i;
        removeBodyFromZones(body);
        for (i = 0; i < activeBodies.length; i++) {
            if (activeBodies[i] === body) {
                activeBodies.splice(i, 1);
                break;
            }
        }
    };
};

