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


    this.width = typeof (width) != 'undefined' ? width : 640;
    this.height = typeof (height) != 'undefined' ? height : 480;
    this.maxSize = maxSize;
    var maxZoneSize = maxZoneSize;
    var zones = new Array();
    var zoneSize = 0;
}

/**
 * Add body to the game. If the size of the body is larger than the max set
 * size, all the zones will be alternated to fit the new size O(m*n) where m
 * is zones and n is bodies
 * 
 * @param body
 * @return false if the body is outside the boundary (width and height)
 */
public void addBody(Body body) {
    int size = Math.max(body.getWidth(), body.getHeight());
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
public void removeBody(Body body) {
    for (Zone zone : getZones(body)) {
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
public List<Body> getBodies(Body body) {
    List<Body> bodies = new ArrayList<Body>();
    Zone[] bodyZones = getZones(body);
    for (int i = 0; i < bodyZones.length; i++) {
        if (bodyZones[i] != null) {
            List<Body> zoneBodies = bodyZones[i].getBodies();
            for (int j = 0; j < zoneBodies.size(); j++) {
                Body b = zoneBodies.get(j);
                if (b != body && !bodies.contains(b)) {
                    bodies.add(b);
                }
            }
        }
    }
    return bodies;
}

public Zone[][] getZones() {
    return zones;
}

/**
 * The actual size of a zone in pixels The size represents one side (x * x)
 * 
 * @return Size of zones in pixels
 */
public int getZoneSize() {
    return zoneSize;
}

private void expandZones(int size) {
    Zone[][] newZones = new Zone[(world.getWidth() / size)][(world
            .getHeight() / size)];
    for (int x = 0; x < newZones.length; x++) {
        for (int y = 0; y < newZones[0].length; y++) {
            newZones[x][y] = new Zone(x, y);
        }
    }
    for (int x = 0; x < zones.length; x++) {
        for (int y = 0; y < zones[0].length; y++) {
            Zone z = zones[x][y];
            List<Body> bodies = z.getBodies();
            for (int i = 0; i < bodies.size(); i++) {
                addBodyToZones(newZones, size, bodies.get(i));
            }
        }
    }
    zones = newZones;
    zoneSize = size;
}

private Zone[] getZones(Body body) {
    return getZones(zones, zoneSize, body);
}

private Zone[] getZones(Zone[][] zones2, int zoneSize2, Body body) {
    int x1 = (int) (body.getX() / zoneSize2);
    int x2 = (int) ((body.getX() + body.getWidth() - 1) / zoneSize2);
    int y1 = (int) (body.getY() / zoneSize2);
    int y2 = (int) ((body.getY() + body.getHeight() - 1) / zoneSize2);
    Zone[] z = new Zone[(x2 - x1 + 1) * (y2 - y1 + 1)];
    int pos = 0;
    if (x1 >= 0 && x1 < zones2.length && y1 >= 0 && y1 < zones2[0].length
            && x2 >= 0 && x2 < zones2.length && y2 >= 0
            && y2 < zones2[0].length) {
        for (int x = x1; x <= x2; x++) {
            for (int y = y1; y <= y2; y++) {
                z[pos++] = zones2[x][y];
            }
        }
    }
    return z;
}

private void addBodyToZones(Body body) {
    addBodyToZones(zones, zoneSize, body);
}

private void addBodyToZones(Zone[][] zones2, int zoneSize2, Body body) {
    Zone[] z = getZones(zones2, zoneSize2, body);
    for (int i = 0; i < z.length; i++) {
        if (z[i] != null) {
            z[i].addBody(body);
        }
    }
}
}
