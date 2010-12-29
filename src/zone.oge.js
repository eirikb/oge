/*
* "THE BEER-WARE LICENSE" (Revision 42):
* =============================================================================
* <eirikb@eirkb.no> wrote this file. As long as you retain this notice you
* can do whatever you want with this stuff. If we meet some day, and you think
* this stuff is worth it, you can buy me a beer in return Eirik Brandtzæg
* =============================================================================
*/
/**
 *
 * @author eirikb
 */
OGE.Zone = function(x, y) {
    OGE.assert(this instanceof arguments.callee, "Constructor called as a function");

    var x = typeof (x) != 'undefined' ? x : 0;
    var y = typeof (y) != 'undefined' ? y : 0;

    var bodies = new Array();

    this.getX = function() {
        return x;
    };

    this.getY = function() {
        return y;
    };

    this.getBodies = function() {
        return bodies;
    };

    this.addBody = function(body) {
        OGE.assert(body instanceof OGE.Body, "Argument not instance of OGE.Body");
        bodies.push(body);
    };
    
    this.removeBody = function(body) {
      OGE.assert(body instanceof OGE.Body, "Argument not instance of OGE.Body");
      bodies.pop(body);
    }

}
