OGE.Zone = function(x, y) {
    OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

    this.x = typeof (x) != 'undefined' ? x : 0;
    this.y = typeof (y) != 'undefined' ? y : 0;

    this.bodies = new Array();

    this.addBody = function(body) {
        OGE.assert(body instanceof OGE.Body, "Argument not instance of OGE.Body");
        this.bodies.push(body);
    };

    this.removeBody = function(body) {
        OGE.assert(body instanceof OGE.Body, "Argument not instance of OGE.Body");
        this.bodies.pop(body);
    };

}
