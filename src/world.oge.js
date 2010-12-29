/*
* ============================================================================
* "THE BEER-WARE LICENSE" (Revision 42):
* <eirikb@eirikb.no> wrote this file. As long as you retain this notice you
* can do whatever you want with this stuff. If we meet some day, and you think
* this stuff is worth it, you can buy me a beer in return Eirik Brandtzæg
* ============================================================================
*/

/**
 *
 * @author Eirik Brandtzæg <eirikb@eirikb.no>
 */
OGE.World = function(width, height, zoneSize) {

    OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

    var width = typeof (width) != 'undefined' ? width : 640;
    var height = typeof (height) != 'undefined' ? height : 480;
    var zoneSize = typeof(zoneSize) != 'undefined' ? zoneSize : 10;

    var xZones = width / zoneSize + 1 << 0;
    var yZones = height / zoneSize + 1 << 0;
    var zones = new Array(xZones);
    for (var x = 0; x < xZones; x++) {
        zones[x] = new Array(yZones);
        for (var y = 0; y < yZones; y++) {
            zones[x][y] = new OGE.Zone(x, y);
        }
    }

    this.getWidth = function() {
        return width;
    };

    this.getHeight = function() {
        return height;
    }

    this.addBody = function(body) {
        OGE.assert(body instanceof OGE.Body, "argument not instance of OGE.Body");
        var z = this.getZones(body);
        if (z.length == 0) {
            return false;
        }
        for (var i = 0; i < z.length; i++) {
            z[i].addBody(body);
        }
        return true;
    }

    this.removeBody = function(body) {
        var zones2 = this.getZones(body);
        for (var i = 0; i < zones2.length; i++) {
            zones2[i].removeBody(body);
        }
    }

    this.getBodies = function(body) {
        var bodies = new Array();
        var zones2 = this.getZones(body);
        for (var i = 0; i < zones2.length; i++) {
            var bodies2 = zones2[i].getBodies();
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
    }

    this.getZones = function(body) {
        var x1 = body.x / zoneSize << 0;
        var x2 = (body.x + body.getWidth() - 1) / zoneSize << 0;
        var y1 = body.y / zoneSize << 0;
        var y2 = (body.y + body.getHeight() - 1) / zoneSize << 0;

        if (x1 >= 0 && x1 < xZones && y1 >= 0 && y1 < yZones
        && x2 >= 0 && x2 < xZones && y2 >= 0
        && y2 < yZones) {
            var pos = 0;
            var z = new Array((x2 - x1) * (y2 - y1) + 1);
            for (var x = x1; x <= x2; x++) {
                for (var y = y1; y <= y2; y++) {
                    z[pos++] = zones[x][y];
                }
            }
            return z;
        } else {
            return new Array(0);
        }
    }

}
