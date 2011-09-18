var utils = {};

utils.createBall = function(world, x, y, radius) {
    radius = radius || 20;
    var ballSd = new box2d.CircleDef();
    ballSd.density = 1.0;
    ballSd.radius = radius;
    ballSd.restitution = 0.8;
    ballSd.friction = 0.9;
    var ballBd = new box2d.BodyDef();
    ballBd.AddShape(ballSd);
    ballBd.position.Set(x, y);
    return world.CreateBody(ballBd);
};

utils.createBox = function(world, x, y, width, height, boxOpts, bodyOpts) {
    var opt, boxSd = new box2d.BoxDef();
    if (boxOpts) {
        for (opt in boxOpts) {
            if (boxOpts.hasOwnProperty(opt)) {
                boxSd[opt] = boxOpts[opt];
            }
        }
    } else {
        boxSd.density = 1;
    }
    boxSd.extents.Set(width, height);
    var boxBd = new box2d.BodyDef();
    if (bodyOpts) {
        for (opt in boxOpts) {
            if (boxOpts.hasOwnProperty(opt)) {
                boxSd[opt] = boxOpts[opt];
            }
        }
    }
    console.log(boxSd);
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x, y);
    return world.CreateBody(boxBd);
};

utils.link = function(world, b1, b2) {
    var jd = new box2d.RevoluteJointDef();
    jd.anchorPoint.Set(b1.m_position.x, b1.m_position.y + 1);
    jd.body1 = b1;
    jd.body2 = b2;
    world.CreateJoint(jd);
};

utils.createBridge = function(world, x, y, width) {
    var b1 = utils.createBox(world, x, y, 5, 2, true),
    i = 1,
    b2;
    for (; i < 10; i++) {
        b2 = utils.createBox(world, x + (i * 15), y, 5, 2, {
            density: 20,
            friction: 0.5
        });
        utils.link(world, b1, b2);
        b1 = b2;
    }
    b2 = utils.createBox(world, x + (i * 15), y, 5, 2, true);
    utils.link(world, b1, b2);
};

