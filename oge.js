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
    var xZones, yZones, x, y;

    this.zoneSize = typeof zoneSize !== 'undefined' ? zoneSize: 10;
    this.activeBodies = [];

    xZones = Math.floor(width / this.zoneSize + 1);
    yZones = Math.floor(height / this.zoneSize + 1);
    this.zones = [];

    for (x = 0; x < xZones; x++) {
        this.zones[x] = [];
        for (y = 0; y < yZones; y++) {
            this.zones[x][y] = {};
        }
    }

    function addBodyToZones(body) {
        var zones = this.getZones(body),
        i;
        if (zones.length === 0) {
            return false;
        }
        for (i = 0; i < zones.length; i++) {
            zones[i].addBody(body);
        }
        return true;
    }

    function removeBodyFromZones(body) {
        var zones = this.getZones(body),
        i;
        for (i = 0; i < zones.length; i++) {
            zones[i].removeBody(body);
        }
    }

    function moveBody(body, direction, steps) {
        var lastX, lastY, bodies, i, j;
        if (arguments.length === 1) {
            direction = body.direction;
            steps = body.speed;
        }

        for (i = 0; i < steps; i++) {
            lastX = body.x;
            lastY = body.y;
            this.removeBodyFromZones(body);
            body.x += direction.cos;
            body.y += direction.sin;
            if (body.x < 0 || body.x + body.width > this.width || body.y < 0 || body.y + body.height > this.height) {
                body.x = body.x < 0 ? 0: body.x;
                body.x = body.x + body.width > this.width ? this.width - body.width: body.x;
                body.y = body.y < 0 ? 0: body.y;
                body.y = body.y + body.height > this.height ? this.height - body.height: body.y;
                body.collide(this);
            }
            bodies = this.getBodies(body);
            for (j = 0; j < bodies.length; j++) {
                var body2 = bodies[j];
                if (body !== body2 && ! body2.intersects(lastX, lastY, body.width, body.height) && body2.intersects(body)) {
                    var collide1 = body.collide(body2) === true;
                    var collide2 = body2.collide(body) === true;
                    if (collide1 && collide2) {
                        body.x = lastX;
                        body.y = lastY;
                        this.addBodyToZones(body);
                        if (body.slide && j >= 0) {
                            this.slideBody(body, direction);
                        } else {
                            return;
                        }
                    }
                }
            }
            this.addBodyToZones(body);
        }
    }

    function slideBody(body, direction) {
        var self = this;
        var getIntersection = function(direction) {
            var ignoreBodies = [],
            bodies = self.getBodies(body),
            intersection,
            i,
            j,
            x,
            y,
            body2,
            ignore;
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
            this.moveBody(body, direction.clone().rotate( - 90), 1);
        } else if (intersection1 > intersection2) {
            this.moveBody(body, direction.clone().rotate(90), 1);
        }
    }

    this.addBody = function(body, active) {
        if (this.addBodyToZones(body) !== true) {
            return false;
        }

        if (arguments.length >= 2) {
            body.active = active;
        }

        if (body.active) {
            this.activeBodies.push(body);
        }

        return true;
    };

    this.removeBody = function(body) {
        var i;
        this.removeBodyFromZones(body);
        for (i = 0; i < this.activeBodies.length; i++) {
            if (this.activeBodies[i] === body) {
                this.activeBodies.splice(i, 1);
                break;
            }
        }
    };

    this.getBodies = function(bodyOrX, y, width, height) {
        var body, x, i, j, k;
        body = x = bodyOrX;
        if (arguments.length === 1) {
            x = body.x;
            y = body.y;
            width = body.width;
            height = body.height;
        }
        x = x < 0 ? 0: x;
        x = x + width > this.width ? this.width - width: x;
        y = y < 0 ? 0: y;
        y = y + height > this.height ? this.height - height: y;

        var bodies = [];
        var zones = this.getZones(x, y, width, height);
        for (i = 0; i < zones.length; i++) {
            var bodies2 = zones[i].bodies;
            for (j = 0; j < bodies2.length; j++) {
                var b = bodies2[j];
                var contains = false;
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

        if (x >= 0 && x + width - 1 < this.width && y >= 0 && y + height - 1 < this.height) {
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
        var step, i;
        steps = arguments.length === 0 ? 1: steps;
        for (step = 0; step < steps; step++) {
            for (i = 0; i < this.activeBodies.length; i++) {
                var body = this.activeBodies[i];
                if (body.speed > 0 && body.direction !== null) {
                    this.moveBody(body);
                }
            }
        }
    };
};

