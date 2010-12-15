function Body(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	active = false;

	var self = this;

	this.lineFrom = function(x, y) {
		self.lines = new Array();
		self.lastPoint = new Point(x, y);
		return self;
	};

	this.lineTo = function(x, y) {
		self.lines.push(new Line(self.lastPoint, new Point(x, y)));
		self.lastPoint = new Point(x, y);
		return self;
	};
};

var Point = function(x, y) {
	this.x = x;
	this.y = y;
};

var Line = function(start, end) {
	this.start = start;
	this.end = end;
};

var Direction = function(cos, sin) {
	this.cos = cos;
	this.sin = sin;
};

var Direction = function(x1, y1, x2, y2) {
	var a = y2 - y1;
	var b = x2 - x1;
	var h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	this.cos = b / h;
	this.sin = a / h;
};