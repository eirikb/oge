describe("Direction", function() {
	var direction1;

	beforeEach( function() {
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

	it("Should have methods that can tell the horizontal vs vertial direction", function() {
		var d1 = new OGE.Direction(1, 0);
		var d2 = new OGE.Direction(1, 0.5);
		var d3 = new OGE.Direction(2, 3);
		var d4 = new OGE.Direction(0, 0.05);
		expect(d1.isHorizontal()).toBeTruthy();
		expect(d1.isVeritcal()).toBeFalsy();
		expect(d2.isHorizontal()).toBeTruthy();
		expect(d2.isVeritcal()).toBeFalsy();
		expect(d3.isHorizontal()).toBeFalsy();
		expect(d3.isVeritcal()).toBeTruthy();;
		expect(d4.isHorizontal()).toBeFalsy();
		expect(d4.isVeritcal()).toBeTruthy();

	});

});
