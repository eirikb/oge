window.onload = function() {
    function drawWorld(ctx) {
        var i, body;

        ctx.clearRect(0, 0, width, height);
        for (i = 0; i < bodies.length; i++) {
            body = bodies[i];

            ctx.fillStyle = body.slide ? 'rgb(200,0,0)': 'rgb(0,00,200)';
            ctx.fillRect(body.x, body.y, body.width, body.height);
        }
    }

    var i, width = 1000,
    height = 1000,
    bodies = [],
    world = new oge.World(width, height),
    player = world.addCircle(100, 100, 10),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

    console.log(world.addCircle(100, 200, 10));

    canvas.width = 1000;
    canvas.height = 1000;

    player.speed = 100;
    player.cos = 0;
    player.sin = 0;

    document.body.appendChild(canvas);

    document.onkeydown = function(e) {
        switch (e.keyCode) {
        case 65:
            player.cos = - 1;
            break;
        case 68:
            player.cos = 1;
            break;
        case 87:
            player.sin = - 1;
            break;
        case 83:
            player.sin = 1;
            break;
        }
    };
    document.onkeyup = function(e) {
        var k = e.keyCode;
        if ((k === 65 && player.cos === - 1) || (k === 68 && player.cos === 1)) {
            player.cos = 0;
        }
        if ((k === 87 && player.sin === - 1) || (k === 83 && player.sin === 1)) {
            player.sin = 0;
        }
    };

    for (i = 0; i < 4; i++) {
        world.addBox(100 + i * 60, i * 45, 60, 45);
    }

    world.addBox(100, 200);
    world.addBox(70, 250);
    world.addBox(100, 300);

    var t1, t2, t3;
    setInterval(function() {
        t1 = t2 = Date.now();
        t1 = Date.now();

        world.step();

        player.GetLinearVelocity().Set(player.cos * player.speed, player.sin * player.speed);
        t2 = Date.now();
        drawWorld(ctx);
        draw.drawWorld(world.w, ctx);
        
        t3 = Date.now();

        t3 = t3 - t1;
        t2 = t2 - t1;
        t1 = Date.now() - t1;
        ctx.fillText('FPS: ' + Math.floor(1000 / t1) + '. Game: ' + t2 + '. Draw: ' + t3, 0, 10);
    },
    1000 / 60);

};

