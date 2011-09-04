var posCheck = function(body, expectedX, expectedY) {
    expect(Math.floor(body.x)).toBe(expectedX);
    expect(Math.floor(body.y)).toBe(expectedY);
},
cb = function(x, y, w, h) {
    if (arguments.length === 2) {
        w = 10;
        h = 10;
    }
    return {
        x: x,
        y: y,
        width: w,
        height: h,
        speed: 1
    };
};

describe('World', function() {
    var w, sb1, sb2, sb3;

    beforeEach(function() {
        w = new oge.World(100, 100);
        sb1 = cb(10, 10);
        sb2 = cb(50, 10);
        sb2 = cb(30, 20);
        w.addBody(sb1);
        w.addBody(sb2);
        w.addBody(sb2);
    });

    it("should move active bodies when stepping", function() {
        var b = cb(0, 0);
        b.direction = {
            cos: 1,
            sin: 0
        };
        w.addBody(b, true);
        w.step();
        expect(b.x).toEqual(1);
        expect(b.y).toEqual(0);
    });

    it("should collide bodies", function() {
        var b = cb(0, 10);
        b.direction = {
            cos: 1,
            sin: 0
        };
        w.addBody(b, true);

        w.step();
        expect(b.x).toEqual(0);
        expect(b.y).toEqual(10);

        w.removeBody(b);
        b = cb(30, 10);
        b.direction = {
            cos: - 1,
            sin: 0
        };
        b.x = 30;
        w.addBody(b, true);
        w.step();
        expect(b.x).toEqual(30);
        expect(b.y).toEqual(0);
    });

    /*
    it("should make bodies slide if they have the slide property set to true", function() {
        var w = new OGE.World(1000, 1000);
        var b = new OGE.Body(0, 0, 13, 12);
        w.addBody(b, true);
        b.speed = 3;
        b.slide = true;
        b.direction = new OGE.Direction(1, 0);

        for (var i = 0; i < 7; i++) {
            w.addBody(new OGE.Body(20 + i * 11, 0 + i * 11, 11, 11));
        }

        var count = 0;
        b.onCollision(function() {
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
        w.addBody(b, true);
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
        w.addBody(b, true);
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

        reset(35, 15, - 1, 0);
        w.step();
        posCheck(b, 32, 15);
        w.step();
        posCheck(b, 30, 14);
        w.step();
        posCheck(b, 30, 11);
        w.step();
        posCheck(b, 28, 10);

        reset(35, 25, - 1, 0);
        w.step();
        posCheck(b, 32, 25);
        w.step();
        posCheck(b, 30, 26);
        w.step();
        posCheck(b, 30, 29);
        w.step();
        posCheck(b, 28, 30);

        reset(25, 35, 0, - 1);
        w.step();
        posCheck(b, 25, 32);
        w.step();
        posCheck(b, 26, 30);
        w.step();
        posCheck(b, 29, 30);
        w.step();
        posCheck(b, 30, 28);

        reset(15, 35, 0, - 1);
        w.step();
        posCheck(b, 15, 32);
        w.step();
        posCheck(b, 14, 30);
        w.step();
        posCheck(b, 11, 30);
        w.step();
        posCheck(b, 10, 28);
    });

    it("should not move a body when hitting blocking bodies", function() {
        var w = new OGE.World(100, 100);
        var b = new OGE.Body(0, 10, 10, 10);
        w.addBody(b, true);
        b.speed = 3;
        b.slide = true;
        b.direction = new OGE.Direction(1, 0);
        b.id = 1;

        var b2 = new OGE.Body(15, 5, 10, 10);
        b2.id = 2;
        w.addBody(b2);
        var b3 = new OGE.Body(15, 15, 10, 10);
        b3.id = 3;
        w.addBody(b3);

        w.step();
        posCheck(b, 3, 10);
        w.step();
        posCheck(b, 5, 10);
        w.step(100);
        posCheck(b, 5, 10);
    });

    it("should not slide when hitting body straight on", function() {
        var w = new OGE.World(100, 100);
        var b = new OGE.Body(0, 16, 16, 16);
        w.addBody(b, true);
        b.speed = 1;
        b.slide = true;
        b.direction = new OGE.Direction(1, 0);

        w.addBody(new OGE.Body(16, 16, 16, 16));

        w.step(100);

        expect(b.x).toBe(0);
        expect(b.y).toBe(16);
    });

});

describe("More tests in a different spec", function() {
    it("should be possibe to slide regardelss of intersecting bodies", function() {
        var w = new OGE.World(100, 100);
        var bo1 = new OGE.Body(0, 0, 10, 10);
        var bo2 = new OGE.Body(10, 10, 10, 10);
        var p = new OGE.Body(6, 10, 10, 10);
        p.slide = true;
        p.speed = 1;
        p.direction = new OGE.Direction(0, - 1);
        w.addBody(bo1);
        w.addBody(bo2);
        w.addBody(p, true);
        posCheck(p, 6, 10);
        w.step();
        posCheck(p, 7, 10);
    });
    */
});

