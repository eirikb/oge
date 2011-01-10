describe("World", function() {
    var world1;
    var world2;
    var world3;
    var w;
    var b1;
    var b2;
    var b3

    beforeEach( function() {
        world1 = new OGE.World(1, 2);
        world2 = new OGE.World(100, 100, 10);
        world3 = new OGE.World();

        w = new OGE.World(100, 100);
        b1 = new OGE.Body(0, 0, 10, 10);
        w.addBody(b1);
        b1.setActive(true);
        b1.speed = 1;
        b1.direction = new OGE.Direction(1, 0);

        b2 = new OGE.Body(15, 0, 10, 10);
        w.addBody(b2);

        b3 = new OGE.Body(15, 10, 10, 10);
        w.addBody(b3);
    });

it("should have width and height", function() {
    expect(world1.width).toEqual(1);
    expect(world1.height).toEqual(2);

    world1.width = 100;
    expect(world1.width).toEqual(100);

    expect(world2.width).toEqual(100);
    expect(world2.height).toEqual(100);
    expect(world3.width).toEqual(640);
    expect(world3.height).toEqual(480);
});

it("should be possible to add bodies, and only bodies to a world", function() {
    var b = new OGE.Body(1, 2, 3, 4);
    expect(world2.addBody(b)).toBeTruthy();
    expect(world2.getBodies(b).length).toEqual(1);
    expect(world2.getBodies(b.x, b.y, b.width, b.height).length).toEqual(1);
    var b2 = new OGE.Body(5, 2, 3, 4);
    expect(world2.addBody(b2)).toBeTruthy();
    expect(world2.getBodies(b).length).toEqual(2);
    expect(world2.getBodies(b)).toContain(b2);
    expect(world2.getBodies(b)).toContain(b);
    expect(world2.getBodies(b.x, b.y, b.width, b.height)).toContain(b2);
    expect(world2.getBodies(b.x, b.y, b.width, b.height)).toContain(b);

    world2.addBody(new OGE.Body(1, 1, 1, 1));
    expect(world2.getBodies(b).length).toEqual(3);

    world2.removeBody(b);
    // This might seem strange, although the bodies are found by x and y of the given body
    expect(world2.getBodies(b).length).toEqual(2);
    expect(world2.getBodies(b2).length).toEqual(2);
});

it("should keep track of active bodies", function() {
    var b = new OGE.Body(1, 2, 3, 4);
    expect(world2.addBody(b)).toBeTruthy();
    expect(world2.activeBodies.length).toEqual(0);
    b.setActive(true);
    expect(world2.activeBodies).toContain(b);
    expect(world2.activeBodies.length).toEqual(1);
    var b2 = new OGE.Body(1, 2, 3, 4);
    b2.setActive(true);
    expect(world2.activeBodies).not.toContain(b2);
    expect(world2.addBody(b2)).toBeTruthy();
    expect(world2.activeBodies).toContain(b2);
    expect(world2.activeBodies.length).toEqual(2);
    b2.setActive(false);
    expect(world2.activeBodies).not.toContain(b2);
    expect(world2.activeBodies.length).toEqual(1);
});

it("should keep track of bodies within zones", function() {
    var w = new OGE.World(35, 35);
    expect(w.getZones(20, 0, 11, 11).length).toEqual(4);
    expect(w.getZones(new OGE.Body(5, 5, 5, 5)).length).toEqual(4);
    expect(w.getZones(5, 5, 5, 5).length).toEqual(4);
    expect(w.getZones(new OGE.Body(5, 5, 6, 5)).length).toEqual(4);
    expect(w.getZones(5, 5, 6, 5).length).toEqual(4);
    expect(w.getZones(new OGE.Body(5, 5, 6, 6)).length).toEqual(4);
    expect(w.getZones(5, 5, 6, 6).length).toEqual(4);
    var b1 = new OGE.Body(5, 5, 5, 5);
    w.addBody(b1);
    expect(w.getZones(b1).length).toEqual(4);
    expect(w.getZones(b1.x, b1.y, b1.width, b1.height).length).toEqual(4);
    expect(w.getZones(b1)[0].bodies).toContain(b1);
    expect(w.getZones(b1.x, b1.y, b1.width, b1.height)[0].bodies).toContain(b1);
    var b2 = new OGE.Body(5, 5, 10, 16);
    w.addBody(b2);
    expect(w.getZones(b2).length).toEqual(6);
    var b3 = new OGE.Body(0, 0, 5, 5);
    w.addBody(b3);
    expect(w.getZones(b3)[0].bodies).toContain(b1);
    expect(w.getZones(b3)[0].bodies).toContain(b2);
    expect(w.getZones(b3)[0].bodies).toContain(b3);
    expect(w.zones.length).toEqual(4);
    expect(w.zones[0].length).toEqual(4);
    var b4 = new OGE.Body(30, 0, 5, 5);
    expect(w.addBody(b4)).toBeTruthy();
    var b5 = new OGE.Body(30, 0, 6, 5);
    expect(w.addBody(b5)).toBeFalsy();

    var w21 = new OGE.World(100, 100);
    var b21 = new OGE.Body(20, 0, 11, 11);
    w21.addBody(b21);
    expect(w21.zones[2][0].bodies).toContain(b21);
    expect(w21.zones[2][1].bodies).toContain(b21);
    expect(w21.zones[3][0].bodies).toContain(b21);
    expect(w21.zones[3][1].bodies).toContain(b21);

    var b22 = new OGE.Body(35, 25, 10, 10);
    w21.addBody(b22);
    expect(w21.getBodies(25, 20, 10, 10)).toContain(b22);
});

it("should be possible to inherit body", function() {
    Person = function(x, y, width, height, name) {
        OGE.Body.apply(this, arguments);
        this.name = name;
    }

    Person.prototype = Object.construct_prototype(OGE.Body);

    Person.prototype.size = function() {
        return this.width * this.height;
    }

    var p = new Person(0, 0, 10, 10, "test");
    expect(p.size()).toEqual(100);
    expect(p.name).toEqual("test");
    expect(p.width).toEqual(10);

    var p1 = new Person(1, 2, 3, 4, "p1");
    expect(world2.addBody(p1)).toBeTruthy();
    expect(world2.getBodies(p1).length).toEqual(1);
    expect(world2.getBodies(p1.x, p1.y, p1.width, p1.height).length).toEqual(1);
    var p2 = new Person(5, 2, 3, 4, "p2");
    expect(world2.addBody(p2)).toBeTruthy();
    expect(world2.getBodies(p1).length).toEqual(2);
    expect(world2.getBodies(p1)).toContain(p2);

    world2.addBody(new Person(1, 1, 1, 1));
    expect(world2.getBodies(p1).length).toEqual(3);

    world2.removeBody(p1);
    // This might seem strange, although the bodies are found by x and y of the given body
    expect(world2.getBodies(p1).length).toEqual(2);
    expect(world2.getBodies(p2).length).toEqual(2);
});

it("should move active bodies when stepping", function() {
    w.step();
    expect(b1.x).toEqual(1);
    expect(b1.y).toEqual(0);
});

it("should collide bodies and ignore based on collide events", function() {
    w.step();
    expect(b1.x).toEqual(1);
    expect(b1.y).toEqual(0);

    var count = 0;
    b1.onCollision( function() {
        count++;
    });

    b2.onCollision( function() {
        count++;
    });

    b3.onCollision( function() {
        count++;
        return false;
    })

    for (var i = 0; i < 4; i++) {
        w.step();
    }

    expect(b1.x).toEqual(5);
    expect(count).toEqual(0);
    w.step();
    expect(b1.x).toEqual(5);
    expect(count).toEqual(2);

    b1.direction = new OGE.Direction(0, 1);

    for (var i = 0; i < 10; i++) {
        w.step();
    }
    expect(b1.x).toEqual(5);
    expect(b1.y).toEqual(10);

    b1.direction = new OGE.Direction(1, 0);
    w.step();
    expect(b1.x).toEqual(6);
    expect(count).toEqual(4);
});

it("should concider changing zones as it checks for collisions", function() {
    var w = new OGE.World(100, 100);
    var b = new OGE.Body(0, 0, 10, 10);
    w.addBody(b);
    b.setActive(true);
    b.speed = 50;
    b.direction = new OGE.Direction(1, 0);
    var count = 0;
    b.onCollision( function() {
        count++;
    });

    expect(w.zones[0][0].bodies).toContain(b);
    w.addBody(new OGE.Body(30, 0, 10, 10));
    w.step();
    expect(count).toEqual(1);
    expect(b.x).toEqual(20);
    expect(w.zones[0][0].bodies).not.toContain(b);
    expect(w.zones[2][0].bodies).toContain(b);
});

it("should make bodies slide if they have the slide property set to true", function() {
    var w = new OGE.World(1000, 1000);
    var b = new OGE.Body(0, 0, 13, 12);
    w.addBody(b);
    b.setActive(true);
    b.speed = 3;
    b.slide = true;
    b.direction = new OGE.Direction(1, 0);

    for (var i = 0; i < 7; i++) {
        w.addBody(new OGE.Body(20 + i * 11, 0 + i * 11, 11, 11));
    }

    var count = 0;
    b.onCollision( function() {
        count++;
    });

    w.step();
    posCheck(b, 3, 0);
    w.step();
    posCheck(b, 6, 0);
    w.step();
    posCheck(b, 7, 2);
    w.step(2);
    posCheck(b, 7, 8);
    w.step(2);
    posCheck(b, 10, 11); 
    w.step(2);
    posCheck(b, 16, 11);
    w.step();
    posCheck(b, 18, 12);
    w.step(3);
    posCheck(b, 18, 21);
    w.step();
    posCheck(b, 20, 22);
    w.step(3);
    posCheck(b, 29, 22);
    w.step();
    posCheck(b, 29, 25);
    w.step(2);
    posCheck(b, 29, 31);
    w.step();
    posCheck(b, 30, 33);
    w.step(2);
    posCheck(b, 36, 33);
});

it("should be possible to slide between bodies", function() {
    var w = new OGE.World(1000, 1000);
    var b = new OGE.Body(5, 8, 11, 11);
    w.addBody(b);
    b.setActive(true);
    b.speed = 3;
    b.slide = true;
    b.direction = new OGE.Direction(1, 0);

    w.addBody(new OGE.Body(20, 0, 11, 11));
    w.addBody(new OGE.Body(20, 22, 11, 11));
    w.step();
    posCheck(b, 8, 8);
    w.step();
    posCheck(b, 9, 10);
    w.step();
    posCheck(b, 11, 11);
});

it("should slide regardless of direction", function() {
    var w = new OGE.World(100, 100);
    var b = new OGE.Body(0, 0, 10, 10);
    w.addBody(b);
    b.setActive(true);
    b.speed = 3;
    b.slide = true;

    var reset = function(x, y, xDir, yDir) {
        w.removeBody(b);
        expect(w.getBodies(b)).not.toContain(b);
        b.x = x;
        b.y = y;
        b.direction = new OGE.Direction(xDir, yDir);
        w.addBody(b);
        expect(w.getBodies(b)).toContain(b);
    };

    w.addBody(new OGE.Body(20, 20, 10, 10));

    reset(5, 25, 1, 0);
    w.step();
    posCheck(b, 8, 25);
    w.step();
    posCheck(b, 10, 26);
    w.step();
    posCheck(b, 10, 29);
    w.step();
    posCheck(b, 12, 30);

    reset(5, 15, 1, 0);
    w.step();
    posCheck(b, 8, 15);
    w.step();
    posCheck(b, 10, 14);
    w.step();
    posCheck(b, 10, 11);
    w.step();
    posCheck(b, 12, 10);

    reset(15, 5, 0, 1);
    w.step();
    posCheck(b, 15, 8);
    w.step();
    posCheck(b, 14, 10);
    w.step();
    posCheck(b, 11, 10);
    w.step();
    posCheck(b, 10, 12);

    reset(25, 5, 0, 1);
    w.step();
    posCheck(b, 25, 8);
    w.step();
    posCheck(b, 26, 10);
    w.step();
    posCheck(b, 29, 10);
    w.step();
    posCheck(b, 30, 12);

    reset(35, 15, -1, 0);
    w.step();
    posCheck(b, 32, 15);
    w.step();
    posCheck(b, 30, 14);
    w.step();
    posCheck(b, 30, 11);
    w.step();
    posCheck(b, 28, 10);

    reset(35, 25, -1, 0);
    w.step();
    posCheck(b, 32, 25);
    w.step();
    posCheck(b, 30, 26);
    w.step();
    posCheck(b, 30, 29);
    w.step();
    posCheck(b, 28, 30);

    reset(25, 35, 0, -1);
    w.step();
    posCheck(b, 25, 32);
    w.step();
    posCheck(b, 26, 30);
    w.step();
    posCheck(b, 29, 30);
    w.step();
    posCheck(b, 30, 28);

    reset(15, 35, 0, -1);
    w.step();
    posCheck(b, 15, 32);
    w.step();
    posCheck(b, 14, 30);
    w.step();
    posCheck(b, 11, 30);
    w.step();
    posCheck(b, 10, 28);
});

var posCheck = function(body, expectedX, expectedY) {
    expect(body.x << 0).toBe(expectedX);
    expect(body.y << 0).toBe(expectedY);
}

});
