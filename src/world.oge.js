var OGE = {
	World : function(width, height) {

		var width = typeof (width) != 'undefined' ? width : 640;
		var height = typeof (height) != 'undefined' ? height : 480;

		if (!(this instanceof arguments.callee)) {
			throw new Error("Constructor called as a function");
		}

		this.getWidth = function() {
			return width;
		};

		this.getHeight = function() {
			return height;
		};
	}
};