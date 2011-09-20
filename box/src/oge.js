var oge = {};

oge.World = function(width, height) {

    var world, self = this,
    size = 100,
    x, y, worldAABB = new box2d.AABB(),
    gravity = new box2d.Vec2(0, 0),
    doSleep = true;

    worldAABB.minVertex.Set(0, 0);
    worldAABB.maxVertex.Set(1000, 1000);

    world = new box2d.World(worldAABB, gravity, doSleep);

    self.step = function(steps) {
        world.Step();
    };

    self.addCircle = function(x, y, radius, active) {
        return utils.b(world, body.x, body.y, {
            allowSleep: false,
            preventRotation: true
        }).circle(body.width, {
            density: 1,
            friction: 0
        }).c();
    };

    self.addBox = function(x, y, width, height, active) {
        return utils.b(world, body.x, body.y).box(body.width, body.height).c();
    };

    self.w = world;
};

