oge.zones = {};

oge.zones.createZones = function(width, height, zoneSize) {
    var x, y, xZones = Math.floor(width / zoneSize + 1),
    yZones = Math.floor(height / zoneSize + 1),
    zones = [];

    for (x = 0; x < xZones; x++) {
        zones[x] = [];
        for (y = 0; y < yZones; y++) {
            zones[x][y] = {
                bodies: []
            };
        }
    }
    return zones;
};

oge.zones.getZones = function(zones, x, y, width, height) {
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
};

oge.zones.addBodyToZones = function(zones, body) {
    var i, z = oge.zones.getZones(zones, body);

    for (i = 0; i < z.length; i++) {
        z[i].bodies.push(body);
    }
    return z.length > 0;
};

oge.zones.removeBodyFromZones = function(zones, body) {
    var i, j, z = oge.zones.getZones(zones, body);

    for (i = 0; i < z.length; i++) {
        for (j = 0; j < z[i].bodies.length; j++) {
            if (z[i].bodies[j] === body) {
                z[i].bodies.splice(j, 1);
                break;
            }
        }
    }
};

oge.zones.getBodies = function(zones, x, y, width, height) {
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

    z = oge.zones.getZones(x, y, width, height);
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
};

