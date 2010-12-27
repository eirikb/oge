describe("Direction", function() {
    var direction1;

    beforeEach(function() {
        direction1 = new OGE.Direction(1, 2);
    });

    it("should create cos and sin based on coordinates", function() {
        var d = OGE.Direction.create(0, 0, 0, 1);
        expect(d).toBeDefined();
        expect(d.cos).toEqual(0);
        expect(d.sin).toEqual(1);
        d = OGE.Direction.create(0, 0, 1, 0);
        expect(d.cos).toEqual(1);
        expect(d.sin).toEqual(0);
    });
});
