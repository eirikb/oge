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
        expect( function() {
            world3.addBody("test")
        }).toThrow(new Error("argument not instance of OGE.Body"));

        var b = new OGE.Body(1, 2, 3, 4);
        expect(world2.addBody(b)).toBeTruthy();
        expect(world2.getBodies(b).length).toEqual(0);
        var b2 = new OGE.Body(5, 2, 3, 4);
        expect(world2.addBody(b2)).toBeTruthy();
        expect(world2.getBodies(b).length).toEqual(1);
        expect(world2.getBodies(b)[0]).toBe(b2);

        world2.addBody(new OGE.Body(1, 1, 1, 1));
        expect(world2.getBodies(b).length).toEqual(2);

        world2.removeBody(b);
        // This might seem strange, although the bodies are found by x and y of the given body
        expect(world2.getBodies(b).length).toEqual(1);
        expect(world2.getBodies(b2).length).toEqual(1);
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
        expect(w.getZones(new OGE.Body(5, 5, 5, 5)).length).toEqual(1);
        expect(w.getZones(new OGE.Body(5, 5, 6, 5)).length).toEqual(2);
        expect(w.getZones(new OGE.Body(5, 5, 6, 6)).length).toEqual(4);
        var b1 = new OGE.Body(5, 5, 5, 5);
        w.addBody(b1);
        expect(w.getZones(b1).length).toEqual(1);
        expect(w.getZones(b1)[0].bodies).toContain(b1);
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
        expect(world2.getBodies(p1).length).toEqual(0);
        var p2 = new Person(5, 2, 3, 4, "p2");
        expect(world2.addBody(p2)).toBeTruthy();
        expect(world2.getBodies(p1).length).toEqual(1);
        expect(world2.getBodies(p1)[0]).toBe(p2);

        world2.addBody(new Person(1, 1, 1, 1));
        expect(world2.getBodies(p1).length).toEqual(2);

        world2.removeBody(p1);
        // This might seem strange, although the bodies are found by x and y of the given body
        expect(world2.getBodies(p1).length).toEqual(1);
        expect(world2.getBodies(p2).length).toEqual(1);
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

        w.addBody(new OGE.Body(30, 0, 10, 10));
        w.step();
        expect(count).toEqual(1);
        expect(b.x).toEqual(20);
    });

    it("should make bodies slide if they have the slide property set to true", function() {
        var w = new OGE.World(1000, 1000);
        var b = new OGE.Body(0, 0, 13, 12);
        for (var i = 0; i < 7; i++) {
            w.addBody(new OGE.Body(20 + i * 11, 0 + i * 11, 11, 11));
        }
        b.direction = new OGE.Direction(1, 0);
        b.speed = 3;

        var count = 0;
        b.onCollision( function() {
            count++;
        });

        w.step();

    });

});
