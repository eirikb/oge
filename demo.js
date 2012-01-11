$(function() {
    var world = new oge.World(400, 300),
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
    $player = $('.player');

    keyboard.init(player);

    world.addBody(player, true);

    function ab(x, y, width, height) {
        world.addBody({
            x: x,
            y: y,
            width: width,
            height: height
        });
    }

    // Walls
    ab(0, 280, 190, 10);
    ab(210, 280, 190, 10);
    ab(0, 0, 40, 280);
    ab(40, 0, 360, 70);
    ab(360, 70, 40, 200);

    // Beds
    ab(40, 70, 20, 60);
    ab(60, 70, 40, 20);
    ab(105, 70, 20, 40);

    // Inner walls
    ab(125, 70, 20, 165);
    ab(40, 170, 40, 50);
    ab(105, 170, 20, 25);
    ab(145, 190, 150, 25);

    // Furniture 
    ab(40, 260, 40, 20);
    ab(145, 215, 20, 20);
    ab(235, 215, 60, 20);
    ab(340, 220, 20, 40);
    ab(340, 70, 20, 80);
    ab(290, 70, 30, 30);
    ab(170, 110, 60, 30);

    $player.show();

    setInterval(function() {
        world.step();
        $player.css({
            left: player.x,
            top: player.y
        });
    },
    (1000 / 30));

    $('img').first().bind('touchstart', function(e) {
        var x = e.originalEvent.touches[0].pageX,
        y = e.originalEvent.touches[0].pageY;

        var cos = Math.round(x / (width / 2)) - 1,
        sin = Math.round(y / (height / 2)) - 1;

        player.direction.cos = cos;
        player.direction.sin = sin;

        return false;
    }).bind('touchend', function() {
        player.direction.cos = 0;
        player.direction.sin = 0;
        return false;
    });
});

