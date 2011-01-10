OGE.Zone = function(x, y) {

    this.x = typeof (x) != 'undefined' ? x : 0;
    this.y = typeof (y) != 'undefined' ? y : 0;

    this.bodies = new Array();

    this.addBody = function(body) {
        for (var i = 0; i < this.bodies.length; i++) {
            if (this.bodies[i] === body) {
                return;
            }
        }
        this.bodies.push(body);
    };

    this.removeBody = function(body) {
        for (var i = 0; i < this.bodies.length; i++) {
            if (this.bodies[i] === body) {
                this.bodies.splice(i, 1);
                break;
            }
        }
    };
}
