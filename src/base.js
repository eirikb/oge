var OGE = {};

OGE.assert = function (expr, msg) {
    if (!msg) {
        msg = 'Assertion failed';
    }
    if (!expr) {
        throw new Error(msg);
    }
}