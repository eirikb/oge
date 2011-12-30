$(function() {
    var last, world = new oge.World(400, 300),
    player = {
        x: 192,
        y: 270,
        width: 16,
        height: 22,
        speed: 3,
        direction: {
            cos: 0,
            sin: 0
        },
        slide: true
    },
    $player = $('.player'),
    codes = {
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

    world.addBody(player, true);
    world.addBody({
        x: 0,
        y: 280,
        width: 190,
        height: 10
    });

    $player.show();

    $(document).keydown(function(e) {
        var code = codes[e.keyCode];
        if (code) {
            if (last !== e.keyCode) {
                player.direction[code.type] = code.val;
                last = e.keyCode;
                return false;
            }
        }
    }).keyup(function(e) {
        var code = codes[e.keyCode];
        last = 0;
        if (code) {
            player.direction[code.type] = 0;
            return false;
        }
    });

    setInterval(function() {
        world.step();

        $player.css({
            left: player.x,
            top: player.y
        });
    },
    (1000 / 30));
});

