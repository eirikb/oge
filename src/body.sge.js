var Body = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	active = false;
};

var Line = function(start, end) {
	this.start = start;
	this.end = end;
};