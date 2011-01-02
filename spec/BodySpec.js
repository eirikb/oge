describe("Body", function() {
    var body1;
    var body2;
    var body3;
    var body4;

    beforeEach( function() {
        body1 = new OGE.Body(1, 2, 3, 4);
        body2 = new OGE.Body(3, 4, 2, 1);
        body3 = new OGE.Body(5, 7);
        body4 = new OGE.Body();
    });

    it("should have public x, y, width and height", function() {
        expect(body1.x).toEqual(1);
        expect(body1.y).toEqual(2);
        expect(body3.x).toEqual(5);
        expect(body3.y).toEqual(7);
        expect(body4.x).toEqual(0);
        expect(body4.y).toEqual(0);

        body1.x = 100;
        expect(body1.x).toEqual(100);

        expect(body1.width).toEqual(3);
        expect(body1.height).toEqual(4);
        expect(body2.width).toEqual(2);
        expect(body2.height).toEqual(1);
        expect(body3.width).toEqual(1);
        expect(body3.height).toEqual(1);
        expect(body4.width).toEqual(1);
        expect(body4.height).toEqual(1);

        body1.width = 1000;
        expect(body1.width).toEqual(1000);
    });

    it("should have speed set to 0", function() {
        expect(body1.speed).toEqual(0);
        body1.speed = 1337;
        expect(body1.speed).toEqual(1337);
        var speed = 42;
        body1.speed = speed;
        expect(body1.speed).toEqual(42);
        speed = 2;
        expect(body1.speed).toEqual(42);
    });

    it("should direction set to null, but can be set", function() {
        expect(body1.direction).toEqual(null);
        expect(body4.direction).toEqual(null);
        body4.setDirection(0, 1);
        expect(body4.direction.cos).toEqual(0);
        body4.setDirection(0, 1);
        expect(body4.direction.sin).toEqual(1);
        body4.setDirection(1, 0);
        expect(body4.direction.cos).toEqual(1);
        expect(body4.direction.sin).toEqual(0);
    });

    it("should call events on activating", function() {
        var count = 0;
        body1.onActive( function() {
            expect(body1.isActive()).toBeTruthy();
            count++;
        });

        body1.onActive( function() {
            expect(body1.isActive()).toBeTruthy();
            count++;
        });

        body1.onDeactive( function() {
            expect(body1.isActive()).toBeFalsy();
            count++;
        });

        body1.onDeactive( function() {
            expect(body1.isActive()).toBeFalsy();
            count++;
        });

        // Setting the same state will not trigger the events
        body1.setActive(false);
        body1.setActive(true);
        body1.setActive(true);
        body1.setActive(false);
        body1.setActive(false);

        expect(count).toEqual(4);
    });

    it("should call events on collision", function() {
        var count = 0;
        body1.onCollision( function() {
            count++;
        }) ;

        body1.onCollision( function() {
            count++;
        });

        body1.collide();
        body1.collide();
        expect(count).toEqual(4);
    });

});