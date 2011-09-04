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
    activeBodies = [],
    zoneSize = typeof zoneSize !== 'undefined' ? zoneSize: 10,
    zones = oge.zones.createZones(width, height, zoneSize);

    self.width = width;
    self.height = height;

    self.step = function(steps) {
        var i, body, steps = arguments.length === 0 ? 1: steps;

        for (step = 0; step < steps; step++) {
                console.log('lol');
                console.log(activeBodies.length)
            for (i = 0; i < activeBodies.length; i++) {
                body = activeBodies[i];
                if (body.speed > 0 && body.direction !== null) {
                    oge.bodies.moveBody(zones, body);
                }
            }
        }
    };

    self.addBody = function(body, active) {
        if (!oge.zones.addBodyToZones(zones, body)) {
            return false;
        }

        if (active) {
            activeBodies.push(body);
        }

        return true;
    };

    self.removeBody = function(body) {
        var i;
        oge.zones.removeBodyFromZones(zones, body);
        for (i = 0; i < activeBodies.length; i++) {
            if (activeBodies[i] === body) {
                activeBodies.splice(i, 1);
                break;
            }
        }
    };
};

