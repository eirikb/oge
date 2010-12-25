describe("World", function() {
	var world1;
	var world2;
	var world3;

	beforeEach(function() {
		world1 = new OGE.World(1, 2);
		world2 = new OGE.World(3, 4);
		world3 = new OGE.World();
	});

	it("should keep a unique instance of private variables", function() {
		expect(world1.getWidth()).toEqual(1);
		expect(world1.getHeight()).toEqual(2);

		expect(world1.width).not.toBeDefined();
		expect(world1.height).not.toBeDefined();

		world1.width = 100;
		expect(world1.width).toEqual(100);
		expect(world1.getWidth()).toEqual(1);

		expect(world2.getWidth()).toEqual(3);
		expect(world2.getHeight()).toEqual(4);
		expect(world3.getWidth()).toEqual(640);
		expect(world3.getHeight()).toEqual(480);

	});
});
