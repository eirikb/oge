describe('Zones', function() {
    var z;

    beforeEach(function() {
        z = new oge.Zones(100, 100, 10);
    });

    it('should be possible to add bodies to zones', function() {
        var b = cb(0, 0);
        expect(z.addBody(b)).toBeTruthy();
        expect(z.getBodies(b).length).toEqual(1);
        z.removeBody(b);
        expect(z.getBodies(b).length).toEqual(0);
    });
});

