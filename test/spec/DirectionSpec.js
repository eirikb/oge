describe("Direction", function() {
	var direction1;

	beforeEach(function() {
		d1 = new OGE.Direction(1, 2);
	});

	it("should be possible to clone a direction", function() {
		expect(d1.cos).toBe(1);
		expect(d1.sin).toBe(2);
		var d2 = d1;
		var d3 = d1.clone();
		d2.cos = 7;
		d2.sin = 42;
		d3.cos = 4;
		d3.sin = 5;
		expect(d1.cos).toBe(7);
		expect(d1.sin).toBe(42);
		expect(d2.cos).toBe(7);
		expect(d2.sin).toBe(42);
		expect(d3.cos).toBe(4);
		expect(d3.sin).toBe(5);
	});

	it("should be possible to rotate a direction", function() {
		var d = new OGE.Direction(1, 0);
		d.rotate(90);
		expect(d.cos).toBeGreaterThan( - 0.0001);
		expect(d.cos).toBeLessThan(0.0001);
		expect(d.sin).toBe(1);
		d.rotate( - 45);
		expect(d.cos).toBeGreaterThan(0.707);
		expect(d.cos).toBeLessThan(0.708);
		expect(d.sin).toBeGreaterThan(0.707)
		expect(d.sin).toBeLessThan(0.708);
	});
});

