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

	it("should call events on collision", function() {
		var count = 0;
		body1.onCollision(function() {
			count++;
		});

		body1.onCollision(function() {
			count++;
		});

		body1.collide();
		body1.collide();
		expect(count).toEqual(4);
	});

	it("should check collision on both coordinates + size as well as body object", function() {
		var b1 = new OGE.Body(0, 0, 10, 10);
		var b2 = new OGE.Body(5, 5, 10, 10);
		var b3 = new OGE.Body(10, 10, 10, 10);
		expect(b1.intersects(b2)).toBeTruthy();
		expect(b1.intersects(5, 5, 10, 10)).toBeTruthy();
		expect(b2.intersects(b1)).toBeTruthy();
		expect(b1.intersects(b3)).toBeFalsy();
		expect(b3.intersects(b2)).toBeTruthy();
		expect(b3.intersects(b1)).toBeFalsy();
		expect(b3.intersects(0, 0, 10, 10)).toBeFalsy();
	});

	it("should be possible to calculate the intersection size bwtween bodies", function() {
		var b1 = new OGE.Body(0, 0, 10, 10);
		expect(b1.intersection(9, 0, 10, 10)).toBe(10);
		expect(b1.intersection(8, 0, 10, 11)).toBe(20);
		expect(b1.intersection(7, 0, 2, 14)).toBe(20);
		expect(b1.intersection(5, 5, 5, 5)).toBe(25);
	});

});

