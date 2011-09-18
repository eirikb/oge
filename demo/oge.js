$(function() {
    function createBody(x, y, w, h) {
        if (arguments.length === 2) {
            w = 50;
            h = 50;
        }

        var body = {
            x: x,
            y: y,
            width: w,
            height: h
        };
        bodies.push(body);
        return body;
    }

    function draw(ctx) {
        var i, body;

        ctx.clearRect(0, 0, width, height);
        for (i = 0; i < bodies.length; i++) {
            body = bodies[i];

            ctx.fillStyle = body.slide ? 'rgb(200,0,0)': 'rgb(0,00,200)';
            ctx.fillRect(body.x, body.y, body.width, body.height);
        }
    }

    var i, width = 640,
    height = 480,
    bodies = [],
    world = new oge.World(width, height),
    player = createBody(0, 0),
    $canvas = $('<canvas>').attr('width', width).attr('height', height),
    ctx = $canvas[0].getContext('2d'),
    lastKey = 0;


    player.speed = 2;
    player.slide = true;
    player.direction = {
        cos: 0,
        sin: 0
    };

    world.addBody(player, true);

    $('body').append($canvas).keydown(function(e) {
        lastKey = e.keyCode;
        switch (e.keyCode) {
        case 37:
            player.direction.cos = - 1;
            break;
        case 38:
            player.direction.sin = - 1;
            break;
        case 39:
            player.direction.cos = 1;
            break;
        case 40:
            player.direction.sin = 1;
            break;
        }
    }).keyup(function(e) {
        switch (e.keyCode) {
        case 37:
            if (player.direction.cos === - 1) {
                player.direction.cos = 0;
            }
            break;
        case 38:
            if (player.direction.sin === - 1) {
                player.direction.sin = 0;
            }
            break;
        case 39:
            if (player.direction.cos === 1) {
                player.direction.cos = 0;
            }
            break;
        case 40:
            if (player.direction.sin === 1) {
                player.direction.sin = 0;
            }
            break;
        }
    });

    for (i = 0; i < 4; i++) {
        world.addBody(createBody(100 + i * 60, i * 45, 60, 45));
    }

        world.addBody(createBody(100, 200));
        world.addBody(createBody(70, 250));
        world.addBody(createBody(100, 300));

    setInterval(function() {
        world.step();
        draw(ctx);
    },
    50);

});

