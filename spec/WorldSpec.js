describe("World", function() {
    var world1;
    var world2;
    var world3;

    beforeEach( function() {
        world1 = new OGE.World(1, 2);
        world2 = new OGE.World(100, 100, 10);
        world3 = new OGE.World();
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
        expect(world2.activeBodies.length).toEqual(1);
        var b2 = new OGE.Body(1, 2, 3, 4);
        b2.setActive(true);
        expect(world2.addBody(b2)).toBeTruthy();
        expect(world2.activeBodies.length).toEqual(2);
        b2.setActive(false);
        expect(world2.activeBodies.length).toEqual(1);
    });

});
