OGE.Direction = function(cos, sin) {
    OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

    this.cos = typeof (cos) != 'undefined' ? cos : 0;
    this.sin = typeof (sin) != 'undefined' ? sin : 0;

    this.rotate = function(degrees) {
        var radian = degrees * (Math.PI / 180);
        this.cos = Math.cos(Math.acos(this.cos) + radian);
        this.sin = Math.sin(Math.asin(this.sin) + radian);
        return this;
    };

    this.clone = function() {
        return new OGE.Direction(this.cos, this.sin);
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
