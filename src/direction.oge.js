OGE.Direction = function(cos, sin) {
    OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

    var cos = typeof (cos) != 'undefined' ? cos : 0;
    var sin = typeof (sin) != 'undefined' ? sin : 0;

    this.cos = function(newCos) {
        if (arguments.length > 0) {
            cos = newCos;
        }
        return cos;
    };

    this.sin= function(newSin) {
        if (arguments.length > 0) {
            sin = newSin;
        }
        return sin;
    };

};

OGE.Direction.create = function(x1, y1, x2, y2) {
    var a =  y2 - y1;
    var b = x2 - x1;
    var h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    var sin = a / h;
    var cos = b / h;
    return new OGE.Direction(cos, sin);
};

