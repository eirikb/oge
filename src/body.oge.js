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
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.active = false;
    this.direction = new Direction(0, 0);


    this.setDirection(x2, y2) {
        var a = y2 - y;
        var b = x2 - x;
        var h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        var sine = a / h;
        var cosine = b / h;
        direction = new Direction(cosine, sine);
    }
}
