var keyboard = (function() {
    var last, codes = {
        37: {
            type: 'cos',
            val: - 1
        },
        38: {
            type: 'sin',
            val: - 1
        },
        39: {
            type: 'cos',
            val: 1
        },
        40: {
            type: 'sin',
            val: 1
        }
    };
    codes[65] = codes[37];
    codes[87] = codes[38];
    codes[68] = codes[39];
    codes[83] = codes[40];

    var init = function(player, down, up) {
        $(document).unbind().keydown(function(e) {
            var code = codes[e.keyCode];
            if (code) {
                if (last !== e.keyCode) {
                    player.direction[code.type] = code.val;
                    down && down(e.keyCode);
                    e.stopPropagation();
                    e.preventDefault();
                    last = e.keyCode;
                }
                return false;
            }
        }).keyup(function(e) {
            var code = codes[e.keyCode];
            last = 0;
            if (code) {
                player.direction[code.type] = 0;
                up && up(e.keyCode);
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }).keypress(function(e) {
            if (e.keyCode === 32) {
                down && down(e.keyCode);
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        });
    };

    return {
        init: init
    };
} ());

