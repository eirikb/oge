describe("Body", function() {
    var body1;
    var body2;
    var body3;
    var body4;

    beforeEach(function() {
        body1 = new OGE.Body(1, 2, 3, 4);
        body2 = new OGE.Body(3, 4, 2, 1);
        body3 = new OGE.Body(5, 7);
        body4 = new OGE.Body();
    });

    it("should have public x and y", function() {
        expect(body1.x).toEqual(1);
        expect(body1.y).toEqual(2);
        expect(body3.x).toEqual(5);
        expect(body3.y).toEqual(7);
        expect(body4.x).toEqual(0);
        expect(body4.y).toEqual(0);

        body1.x = 100;
        expect(body1.x).toEqual(100);
    });

    it("should have immutable width and height", function() {
        expect(body1.getWidth()).toEqual(3);
        expect(body1.getHeight()).toEqual(4);
        expect(body4.getWidth()).toEqual(1);
        expect(body4.getHeight()).toEqual(1);

        body1.width = 100;
        body1.height = 100;
        body4.width = 100;
        body4.width = 100;

        expect(body1.getWidth()).toEqual(3);
        expect(body1.getHeight()).toEqual(4);
        expect(body4.getWidth()).toEqual(1);
        expect(body4.getHeight()).toEqual(1);
    });

    it("should have speed set to 0, but can be altered", function() {
        expect(body1.speed).toEqual(0);
        body1.speed = 7;
        expect(body1.speed).toEqual(7);
        body1.speed = -37;
        expect(body1.speed).toEqual(-37);
    });

    it("should direction set to null, but can be set", function() {
        expect(body1.direction).toEqual(null);
        expect(body4.direction).toEqual(null);
        body4.setDirection(0, 1);
        expect(body4.direction.cos).toEqual(0);
        expect(body4.direction.sin).toEqual(1);
        body4.setDirection(1, 0);
        expect(body4.direction.cos).toEqual(1);
        expect(body4.direction.sin).toEqual(0);
 
    });
});
