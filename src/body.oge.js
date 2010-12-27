/*
 * ============================================================================
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <eirikb@eirikb.no> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return Eirik Brandtzæg
 * ============================================================================
 */


/**
 * Create a direction based on a point relative to the body
 * 
 * @param x
 *            example mouse.x
 * @param y
 *            example mouse.y
 *
 * @author eirikb
 */

OGE.Body = function(x, y, width, height) {

    if (!(this instanceof arguments.callee)) {
        throw new Error("Constructor called as a function");
    }

    this.x = typeof (x) != 'undefined' ? x : 0;
    this.y = typeof (y) != 'undefined' ? y : 0;
    var width = typeof (width) != 'undefined' ? width : 1;
    var height = typeof (height) != 'undefined' ? height : 1;


    var width = width;
    var height = height;

    this.speed = 0;
    this.direction = null;

    this.getWidth = function() {
        return width;
    };

    this.getHeight = function() {
        return height;
    }
}
