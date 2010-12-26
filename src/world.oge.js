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
OGE.World = function(width, height, maxZoneSize) {

    if (!(this instanceof arguments.callee)) {
        throw new Error("Constructor called as a function");
    }


    var width = typeof (width) != 'undefined' ? width : 640;
    var height = typeof (height) != 'undefined' ? height : 480;
    this.maxSize = maxSize;
    var maxZoneSize = maxZoneSize;
    var zones = new Array();
    var zoneSize = 0;

    this.getWidth = function() {
        return width;
    };

    this.getHeight = function() {
        return height;
    }

    /**
     * Add body to the game. If the size of the body is larger than the max set
     * size, all the zones will be alternated to fit the new size O(m*n) where m
     * is zones and n is bodies
     * 
     * @param body
     * @return false if the body is outside the boundary (width and height)
     */
    this.addBody = function(body) {
        var size = Math.max(body.getWidth(), body.getHeight());
        size = maxSize != null && size > maxSize ? maxSize : size;
        if (size > zoneSize) {
            expandZones(size);
        }
        addBodyToZones(body);
    }

    /**
     * Remove a body This method does _NOT_ fix the size of the the zones. This
     * is because that is a O(m*n) operation. add body also have a O(m*n) - but
     * ONLY on adding a bigger body.
     * 
     * @param body
     */
    this.removeBody = function(body) {
        for (var zone in getZones(body)) {
            if (zone != null) {
                zone.removeBody(body);
            }
        }
    }

    /**
     * Get all bodies that is around the given body. This will be all the bodies
     * in all the zones the given body is inside.
     * 
     * @param body
     * @return all bodies around give body
     */
    this.getBodies = function(body) {
        var bodies = new Array();
        var bodyZones = getZones(body);
        for (var i = 0; i < bodyZones.length; i++) {
            if (bodyZones[i] != null) {
                List<Body> zoneBodies = bodyZones[i].getBodies();
                for (var j = 0; j < zoneBodies.size(); j++) {
                    var v = zoneBodies.get(j);
                    if (b != body && !bodies.contains(b)) {
                        bodies.add(b);
                    }
                }
            }
        }
        return bodies;
    }


    /**
     * The actual size of a zone in pixels The size represents one side (x * x)
     * 
     * @return Size of zones in pixels
     */
    this.getZoneSize = function() {
        return zoneSize;
    }

    this.expandZones = function(size) {
        var newZones = new Zone[(world.getWidth() / size)][(world
                .getHeight() / size)];
        for (var x = 0; x < newZones.length; x++) {
            for (var y = 0; y < newZones[0].length; y++) {
                newZones[x][y] = new Zone(x, y);
            }
        }
        for (var x = 0; x < zones.length; x++) {
            for (var y = 0; y < zones[0].length; y++) {
                var z = zones[x][y];
                var bodies = z.getBodies();
                for (var i = 0; i < bodies.size(); i++) {
                    addBodyToZones(newZones, size, bodies.get(i));
                }
            }
        }
        zones = newZones;
        zoneSize = size;
    }

    this.getZones = function(body) {
        return getZones(zones, zoneSize, body);
    }

    this.getZones = function(zones2, zoneSize2, body) {
        var x1 = body.getX() / zoneSize2;
        var x2 = (body.getX() + body.getWidth() - 1) / zoneSize2;
        var y1 = body.getY() / zoneSize2;
        var y2 = (body.getY() + body.getHeight() - 1) / zoneSize2;
        var z = new Zone[(x2 - x1 + 1) * (y2 - y1 + 1)];
        var pos = 0;
        if (x1 >= 0 && x1 < zones2.length && y1 >= 0 && y1 < zones2[0].length
                && x2 >= 0 && x2 < zones2.length && y2 >= 0
                && y2 < zones2[0].length) {
            for (var x = x1; x <= x2; x++) {
                for (var y = y1; y <= y2; y++) {
                    z[pos++] = zones2[x][y];
                }
            }
        }
        return z;
    }

    this.addBodyToZones = function(body) {
        addBodyToZones(zones, zoneSize, body);
    }

    this.addBodyToZones = function(zones2, zoneSize2, body) {
       var z = getZones(zones2, zoneSize2, body);
        for (var i = 0; i < z.length; i++) {
            if (z[i] != null) {
                z[i].addBody(body);
            }
        }
    }
}
