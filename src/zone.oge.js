/**
 * Zone object
 * Note that x and y in zone is within the grid of zones,
 * unlike in bodies where it is the actual coordinates
 * Zones store links to bodies within them
 *
 * @constructur
 * @param {number} x X-gridcoordinate in world
 * @param {number} y Y-gridcoordinate in world
 * @return {OGE.Zone}
 */
OGE.Zone = function(x, y) {
	this.x = typeof(x) != 'undefined' ? x: 0;
	this.y = typeof(y) != 'undefined' ? y: 0;

	this.bodies = [];

	/**
     * Add a body to the zone
     *
     * @param {OGE.Body} body Body to add
     */
	this.addBody = function(body) {
		for (var i = 0; i < this.bodies.length; i++) {
			if (this.bodies[i] === body) {
				return;
			}
		}
		this.bodies.push(body);
	};

	/**
     * Remove body from the zone
     *
     * @param {OGE.Body} body Body to remove
     */
	this.removeBody = function(body) {
		for (var i = 0; i < this.bodies.length; i++) {
			if (this.bodies[i] === body) {
				this.bodies.splice(i, 1);
				break;
			}
		}
	};
};

