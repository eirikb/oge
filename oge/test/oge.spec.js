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
        w = new oge.World(1000, 1000);
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
        b.speed = 1;

        expect(w.addBody(b, true)).toBeTruthy();
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
        b.speed = 1;

        expect(w.addBody(b, true)).toBeTruthy();
        w.step();
        expect(b.x).toEqual(0);
        expect(b.y).toEqual(10);
    });

    it("should make bodies slide if they have the slide property set to true", function() {
        var i, w2 = new oge.World(1000, 1000),
        b = cb(0, 0, 13, 12);

        w2.addBody(b, true);
        b.speed = 3;
        b.slide = true;
        b.direction = {
            cos: 1,
            sin: 0
        };

        for (i = 0; i < 7; i++) {
            w2.addBody(cb(20 + i * 11, i * 11, 11, 11));
        }

        w2.step();
        posCheck(b, 3, 0);
        w2.step();
        posCheck(b, 6, 0);
        w2.step();
        posCheck(b, 7, 2);
        w2.step(2);
        posCheck(b, 7, 8);
        w2.step(2);
        posCheck(b, 10, 11);
        w2.step(2);
        posCheck(b, 16, 11);
        w2.step();
        posCheck(b, 18, 12);
        w2.step(3);
        posCheck(b, 18, 21);
        w2.step();
        posCheck(b, 20, 22);
        w2.step(3);
        posCheck(b, 29, 22);
        w2.step();
        posCheck(b, 29, 25);
        w2.step(2);
        posCheck(b, 29, 31);
        w2.step();
        posCheck(b, 30, 33);
        w2.step(2);
        posCheck(b, 36, 33);
    });

    it("should be possible to slide between bodies", function() {
        var w2 = new oge.World(1000, 1000),
        b = cb(5, 8, 11, 11);
        w2.addBody(b, true);
        b.direction = {
            cos: 1,
            sin: 0
        };
        b.speed = 3;
        b.slide = true;

        w2.addBody(cb(20, 0, 11, 11));
        w2.addBody(cb(20, 22, 11, 11));
        w2.step();
        posCheck(b, 8, 8);
        w2.step();
        posCheck(b, 9, 10);
        w2.step();
        posCheck(b, 11, 11);
    });

    it("should slide regardless of direction", function() {
        var w2 = new oge.World(100, 100),
        b = cb(0, 0, 10, 10);
        w2.addBody(b, true);
        b.speed = 3;
        b.slide = true;

        var reset = function(x, y, xDir, yDir) {
            w2.removeBody(b);
            b.x = x;
            b.y = y;
            b.direction = {
                cos: xDir,
                sin: yDir
            };
            w2.addBody(b, true);
        };

        w2.addBody(cb(20, 20, 10, 10));

        reset(5, 25, 1, 0);
        w2.step();
        posCheck(b, 8, 25);
        w2.step();
        posCheck(b, 10, 26);
        w2.step();
        posCheck(b, 10, 29);
        w2.step();
        posCheck(b, 12, 30);

        reset(5, 15, 1, 0);
        w2.step();
        posCheck(b, 8, 15);
        w2.step();
        posCheck(b, 10, 14);
        w2.step();
        posCheck(b, 10, 11);
        w2.step();
        posCheck(b, 12, 10);

        reset(15, 5, 0, 1);
        w2.step();
        posCheck(b, 15, 8);
        w2.step();
        posCheck(b, 14, 10);
        w2.step();
        posCheck(b, 11, 10);
        w2.step();
        posCheck(b, 10, 12);

        reset(25, 5, 0, 1);
        w2.step();
        posCheck(b, 25, 8);
        w2.step();
        posCheck(b, 26, 10);
        w2.step();
        posCheck(b, 29, 10);
        w2.step();
        posCheck(b, 30, 12);

        reset(35, 15, - 1, 0);
        w2.step();
        posCheck(b, 32, 15);
        w2.step();
        posCheck(b, 30, 14);
        w2.step();
        posCheck(b, 30, 11);
        w2.step();
        posCheck(b, 28, 10);

        reset(35, 25, - 1, 0);
        w2.step();
        posCheck(b, 32, 25);
        w2.step();
        posCheck(b, 30, 26);
        w2.step();
        posCheck(b, 30, 29);
        w2.step();
        posCheck(b, 28, 30);

        reset(25, 35, 0, - 1);
        w2.step();
        posCheck(b, 25, 32);
        w2.step();
        posCheck(b, 26, 30);
        w2.step();
        posCheck(b, 29, 30);
        w2.step();
        posCheck(b, 30, 28);

        reset(15, 35, 0, - 1);
        w2.step();
        posCheck(b, 15, 32);
        w2.step();
        posCheck(b, 14, 30);
        w2.step();
        posCheck(b, 11, 30);
        w2.step();
        posCheck(b, 10, 28);
    });

    it("should not move a body when hitting blocking bodies", function() {
        var w2 = new oge.World(100, 100),
        b = cb(0, 10, 10, 10);

        w2.addBody(b, true);
        b.speed = 3;
        b.slide = true;
        b.direction = {
            cos: 1,
            sin: 0
        };
        b.id = 1;

        w2.addBody(cb(15, 5, 10, 10));
        w2.addBody(cb(15, 15, 10, 10));

        w2.step();
        posCheck(b, 3, 10);
        w2.step();
        posCheck(b, 5, 10);
        w2.step(100);
        posCheck(b, 5, 10);
    });

    it("should not slide when hitting body straight on", function() {
        var w2 = new oge.World(100, 100),
        b = cb(0, 16, 16, 16);

        w2.addBody(b, true);
        b.speed = 1;
        b.slide = true;
        b.direction = {
            cos: 1,
            sin: 0
        };

        w2.addBody(cb(16, 16, 16, 16));

        w2.step(100);

        expect(b.x).toBe(0);
        expect(b.y).toBe(16);
    });
});

