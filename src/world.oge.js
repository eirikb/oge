oge.World = function(width, height, zoneSize) {
    zoneSize = typeof zoneSize !== 'undefined' ? zoneSize: 10;

    var self = this,
    zones = new oge.Zones(width, height, zoneSize),
    bodies = new oge.Bodies(width, height, zones),
    activeBodies = [];

    self.width = width;
    self.height = height;

    self.onCollision = bodies.onCollision;

    self.step = function(steps) {
        var i, body;
        steps = arguments.length === 0 ? 1: steps;

        for (step = 0; step < steps; step++) {
            for (i = 0; i < activeBodies.length; i++) {
                body = activeBodies[i];
                if (body.speed > 0 && (typeof body.direction === 'object')) {
                    bodies.moveBody(body);
                }
            }
        }
    };

    self.addBody = function(body, active) {
        if (!zones.addBody(body)) {
            return false;
        }

        if (active) {
            activeBodies.push(body);
        }

        return true;
    };

    self.removeBody = function(body) {
        var i;
        zones.removeBody(body);
        for (i = 0; i < activeBodies.length; i++) {
            if (activeBodies[i] === body) {
                activeBodies.splice(i, 1);
                break;
            }
        }
    };
};

