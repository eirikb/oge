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
 * @Version 0.3
 */

var OGE = {};

// Prevent protoype inheritance from calling constructors twice when using apply
// Thanks to eboyjr (##javascript @ freenode)
Object.construct_prototype = function(o) {
    var f = function() {
    };

    f.prototype = o.prototype;
    return new f();
};
/**
 * Direction object
 *
 * @constructur
 * @param {number} cos Cosine
 * @param {number} sin Sines
 * @return {OGE.Direction}
 */
OGE.Direction = function(cos, sin) {
    this.cos = typeof (cos) != 'undefined' ? cos : 0;
    this.sin = typeof (sin) != 'undefined' ? sin : 0;

    /**
     * Rotate the direction based on degrees (not radians)
     * Will update cos and sin accordingly
     * To rotate 'the other way', use negative numbers
     *
     * @param {number} degrees Amount of degrees to roate cos and sin
     * @return this
     */
    this.rotate = function(degrees) {
        var radian = degrees * (Math.PI / 180);
        this.cos = Math.cos(Math.acos(this.cos) + radian);
        this.sin = Math.sin(Math.asin(this.sin) + radian);
        return this;
    };

    /**
     * Clone this direction
     * 
     * @return new OGE.Direction with same cos and sin
     */
    this.clone = function() {
        return new OGE.Direction(this.cos, this.sin);
    };
};

/**
 * Static funtion for creating a OGE.Direction based on
 * starting and ending cooridnates
 * Calculates cos and sin based on the four arguments
 *
 * @param {number} x1 X-coordinate to start from
 * @param {number} y1 Y-coordinate to start from
 * @param {number} x2 X-coordinate to end on
 * @param {number} y2 Y-coordinate to end on
 * @return {OGE.Direction} A new direction
 */
OGE.Direction.create = function(x1, y1, x2, y2) {
    var a =  y2 - y1;
    var b = x2 - x1;
    var h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    var sin = a / h;
    var cos = b / h;
    return new OGE.Direction(cos, sin);
};
/**
 * Zone object
 * Note that x and y in zone is within the grid of zones,
 * unlike in bodies where it is the actual coordinates
 * Zones store links to bodies within them
 *
 * @constructur
 * @param {number} x X-gridcoordinate in world
 * @param {number} y Y-gridcoordinate in world
 * @return {OGE.Zone}
 */
OGE.Zone = function(x, y) {
    this.x = typeof (x) != 'undefined' ? x : 0;
    this.y = typeof (y) != 'undefined' ? y : 0;

    this.bodies = [];

    /**
     * Add a body to the zone
     *
     * @param {OGE.Body} body Body to add
     */
    this.addBody = function(body) {
        for (var i = 0; i < this.bodies.length; i++) {
            if (this.bodies[i] === body) {
                return;
            }
        }
        this.bodies.push(body);
    };

    /**
     * Remove body from the zone
     *
     * @param {OGE.Body} body Body to remove
     */
    this.removeBody = function(body) {
        for (var i = 0; i < this.bodies.length; i++) {
            if (this.bodies[i] === body) {
                this.bodies.splice(i, 1);
                break;
            }
        }
    };
};
/**
 * Body object
 *
 * @constructur
 * @param {number} x X-coordinate on world
 * @param {number} y Y-coordinate on world
 * @param {number} width Width of body
 * @param {number} height Height of body
 * @return {OGE.Body}
 */
OGE.Body = function(x, y, width, height) {
    this.x = typeof (x) != 'undefined' ? x : 0;
    this.y = typeof (y) != 'undefined' ? y : 0;
    this.width = typeof (width) != 'undefined' ? width : 1;
    this.height = typeof (height) != 'undefined' ? height : 1;

    this.speed = 0;
    this.direction = null;
    this.slide = false;

    var active = false;

    var onActive = [];
    var onDeactive = [];
    var onCollision = [];

    /**
     * Create (calculate) and set a direction to body based on coordinates (x, y)
     *
     * @param {number} x X-coordinate according to body.x
     * @param {number} y Y-coordinate according to body.x
     */
    this.setDirection = function(x, y) {
        this.direction = OGE.Direction.create(this.x, this.y, x, y);
    };

    /**
     * Remove onActive and onDeactive events
     * NOTE: Does not remove onCollision
     */
    this.clearEvents = function() {
        onActivate = [];
        onDeactive = [];
    };

    /**
     * Check if body is active
     *
     * @return true if active, false if not
     */
    this.isActive = function() {
        return active;
    };

    /**
     * Set body as active or not.
     * Will trigger all onActivate/onDeactivate-events
     * (Used by OGE.World to monitor this state)
     *
     * @param {boolean} newActive Set body active (true) or deactive (false)
     */
    this.setActive = function(newActive) {
        if (active !== newActive) {
            active = newActive;
            if (active) {
                for (var i = 0; i < onActive.length; i++) {
                    onActive[i]();
                }
            } else {
                for (var j = 0; j < onDeactive.length; j++) {
                    onDeactive[j]();
                }
            }
        }
    };

    /**
     * Add event for onActive
     * Will trigger from setActive
     *
     * @param {Function} onActiveEvent event
     */
    this.onActive = function(onActiveEvent) {
        onActive.push(onActiveEvent);
    };

    /**
     * Add event for onDeactive
     * Will trigger from setActive
     *
     * @param {Function} onDeactiveEvent event
     */
    this.onDeactive = function(onDeactiveEvent) {
        onDeactive.push(onDeactiveEvent);
    };

    this.onCollision = function(onCollisionEvent) {
        onCollision.push(onCollisionEvent);
    };

    /**
     * Collide two bodies (this and given body)
     * Will trigger all onCollision events
     * 
     * @param {OGE.Body} body Body this body has collided with
     * @return false if one of onCollision events return false, true if not
     */
    this.collide = function(body) {
        var collide = true;
        for (var i = 0; i < onCollision.length; i++) {
            if (onCollision[i](body) === false) {
                collide = false;
            }
        }
        return collide;
    };

    /**
     * Check if this body intersects with a given body/location
     *
     * @param {OGE.Body} bodyOrX Body to chech intersection with,
     *                   this can also be {number} x
     * @param {number} y Y (optional)
     * @param {number} width Width (optional)
     * @param {number} height Height (optional)
     * @return true if the bodies intersect, false if not
     */
    this.intersects = function(bodyOrX, y, width, height) {
        var x, body;
        x = body = bodyOrX;
        if (arguments.length === 1) {
            x = body.x;
            y = body.y;
            width = body.width;
            height = body.height;
        }

        return this.x < x + width &&
            this.x + this.width > x &&
            this.y < y + height && 
            this.y + this.height > y;
    };

    /**
     * Check how much this body intersects with nother body
     * Will not check if they actually intersect,
     * so can return negative number @see #intersects 
     *
     * @param {OGE.Body} bodyOrX Body to chech intersection with,
     *                   this can also be {number} x
     * @param {number} y Y (optional)
     * @param {number} width Width (optional)
     * @param {number} height Height (optional)
     * @return How much the two bodies intersect, can be negative
     */
    this.intersection = function(bodyOrX, y, width, height) {
        var x, body;
        x = body = bodyOrX;
        if (arguments.length === 1) {
            x = body.x;
            y = body.y;
            width = body.width;
            height = body.height;
        }

        var sx, ex, sy, ey;
        sx = this.x > x ? this.x : x;
        ex = this.x + this.width < x + width ? this.x + this.width : x + width;
        sy = this.y > y ? this.y : y;
        ey = this.y + this.height < y + height ? this.y + this.width : y + height; 
        return (ex - sx) * (ey - sy);
    };

};
/**
 * World object, contain everything
 *
 * @constructur
 * @param {number} width Width of map
 * @param {number} height Height of map
 * @param {number} zoneSize How large each zone should be (default 10)
 * @return {OGE.World}
 */
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

    /**
     * Add a body to the world, will be added to zones
     * and onActive/onDeeactivate is monitored
     * Bodies can be added over other bodies (x, y)
     *
     * @param {OGE.Body} body Body to add
     * @return true if body was added, false if not (out of bounds)
     */
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

    /**
     * Removes a body from the world (and zones it is)
     * Important: Removes all listeners to onActivate/onDeactivate
     *
     * @param {OGE.Body} body Body to remove
     */
    this.removeBody = function(body) {
        removeBodyFromZones(body);
        for (var i = 0; i < self.activeBodies.length; i++) {
            if (self.activeBodies[i] === body) {
                self.activeBodies.splice(i, 1);
                break;
            }
        }

    };

    /**
     * Get all bodies from a given location (either OGE.Body or x,y)
     * Given location can be outside the bounds of the World
     *
     * @param {OGE.Body} bodyOrX Uses this to find other bodies (x, y, width, height)
     *                           This can also be the {number} x
     * @param {number} y Y (optional)
     * @param {number} width Width (optional)
     * @param {number} height Height (optional)
     * @return Array of OGE.Body found, including the given body
     */
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

    /**
     * Get all zones from a given location (either OGE.Body or x,y)
     * Given location can not be outside the bounds of the World
     *
     * @param {OGE.Body} bodyOrX Uses this to find other bodies (x, y, width, height)
     *                           This can also be the {number} x
     * @param {number} y Y (optional)
     * @param {number} width Width (optional)
     * @param {number} height Height (optional)
     * @return Array of OGE.Zone found, including the given body
     */
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

    /**
     * Does one 'step' in the world, as in time passes
     * Will move all active bodies
     *
     * @param {number} steps Amount of steps to do
     */ 
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

    // Private functions

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
