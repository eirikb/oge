describe('Bodies', function() {
    var z, bs;

    beforeEach(function() {
        z = new oge.Zones(100, 100, 10);
        bs = new oge.Bodies(100, 100, z);
    });

    it('should be possible to move bodies', function() {
        var b = cb(0, 0);
        b.direction = {
            cos: 1,
            sin: 0
        };
        b.speed = 1;
        z.addBody(b);
        bs.moveBody(b);
        expect(b.x).toEqual(1);
    });

    it('should be possible to collide bodies', function() {
        var b1 = cb(0, 0),
        b2 = cb(10, 0),
        count = 0;

        b1.direction = {
            cos: 1,
            sin: 0
        };
        b1.speed = 1;
        z.addBody(b1);
        z.addBody(b2);
        bs.onCollision(b1, function(collision) {
            count++;
        });
        bs.moveBody(b1);
        expect(b1.x).toEqual(0);
        expect(count).toEqual(1);
    });

    it('should be possible to slide bodies on collision', function() {
        var b1 = cb(0, 6),
        b2 = cb(10, 0),

        b1.direction = {
            cos: 1,
            sin: 0
        };
        b1.speed = 1;
        z.addBody(b1);
        z.addBody(b2);

        bs.moveBody(b1);
        expect(b1.x).toEqual(0);
        expect(count).toEqual(1);
    });
});

