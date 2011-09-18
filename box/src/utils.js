var utils = {};

function setDef(def, options, localX, localY) {
    var opt;
    if (typeof localX !== 'undefined' && typeof localY !== 'undefined') {
        def.localPosition.Set(localX, localY);
    }
    for (opt in options) {
        if (options.hasOwnProperty(opt)) {
            def[opt] = options[opt];
        }
    }
}

utils.body = utils.b = function(world, x, y, options) {
    return (function() {
        var self = this,
        body = new box2d.BodyDef();

        body.position.Set(x, y);
        setDef(body, options);

        self.circle = function(radius, options, localX, localY) {
            var circle = new box2d.CircleDef();

            circle.radius = radius;
            setDef(circle, options, localX, localY);
            body.AddShape(circle);

            return self;
        };

        self.box = function(width, height, options, localX, localY) {
            var box = new box2d.BoxDef();

            box.extents.Set(width, height);
            setDef(box, options, localX, localY);
            body.AddShape(box);

            return self;
        };

        self.create = self.c = function() {
            return world.CreateBody(body);
        };

        return self;
    } ());
};

utils.link = function(world, b1, b2) {
    var jd = new box2d.RevoluteJointDef();
    jd.anchorPoint.Set(b1.m_position.x, b1.m_position.y + 1);
    jd.body1 = b1;
    jd.body2 = b2;
    world.CreateJoint(jd);
};

utils.createBridge = function(world, x, y, width) {
    var b1 = utils.body(world, x, y).box(5, 2).create(),
    i = 1,
    b2;
    for (; i < 10; i++) {
        b2 = utils.body(world, x + (i * 15), y).box(5, 2, {
            density: 20,
            friction: 0.5
        }).create();
        utils.link(world, b1, b2);
        b1 = b2;
    }
    b2 = utils.body(world, x + (i * 15), y).box(5, 2).create();
    utils.link(world, b1, b2);
};

