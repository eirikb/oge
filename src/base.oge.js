/*!
 * ============================================================================
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <eirikb@eirikb.no> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return Eirik Brandtzæg
 * ============================================================================
 *
 * @author Eirik Brandtzæg <eirikb@eirikb.no>
 * @Version 0.1
 */

var OGE = {};

// Prevent protoype inheritance from calling constructors twice when using apply
// Thanks to eboyjr (##javascript @ freenode)
Object.construct_prototype = function(o) {
    var f = function() {
    };

    f.prototype = o.prototype;
    return new f();
};