/*
* ============================================================================
* "THE BEER-WARE LICENSE" (Revision 42):
* <eirikb@eirikb.no> wrote this file. As long as you retain this notice you
* can do whatever you want with this stuff. If we meet some day, and you think
* this stuff is worth it, you can buy me a beer in return Eirik Brandtzæg
* ============================================================================
*/

/**
 *
 * @author Eirik Brandtzæg <eirikb@eirikb.no>
 */

var OGE = {};

OGE.assert = function (expr, msg) {
    if (!msg) {
        msg = 'Assertion failed';
    }
    if (!expr) {
        throw new Error(msg);
    }
}