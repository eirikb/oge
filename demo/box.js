function createGrid(world, width, height, size) {
    var x, y;
    for (y = size * 4; y < height / 2; y += size * 4) {
        for (x = size; x < width / 2; x += size * 4) {
            utils.b(world, x, y).box(size, size, {
                userData: 'filled'
            }).c();
        }
    }
}

window.onload = function() {
    var canvas, bd, sd, worldAABB = new box2d.AABB(),
    gravity = new box2d.Vec2(0, 0),
    doSleep = true;

    worldAABB.minVertex.Set(0, 0);
    worldAABB.maxVertex.Set(1000, 1000);

    world = new box2d.World(worldAABB, gravity, doSleep);

    createGrid(world, 1000, 1000, 10);

    player = utils.b(world, 150, 250, {
        allowSleep: false,
        preventRotation: true
    }).circle(10, {
        density: 1,
        friction: 0
    }).c();
    player.speed = 100;
    player.cos = 0;
    player.sin = 0;

    world.SetFilter({
        ShouldCollide: function(a, b) {
            if (a === player.m_shapeList || b === player.m_shapeList) {
                console.log(a, b);
                player.canJump = true;
            }
        }
    });

    canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    ctx = canvas.getContext('2d');
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

    canvas.onclick = function(e) {
        utils.b(world, e.offsetX, e.offsetY).box(10, 10, {
            density: 1
        }).c();
    };

    var t1, t2, t3;
    setInterval(function() {
        t1 = t2 = Date.now();
        t1 = Date.now();
        player.GetLinearVelocity().Set(player.cos * player.speed, player.sin * player.speed);
        world.Step(1.0 / 60, 1);
        t2 = Date.now();
        draw.drawWorld(world, ctx);
        t3 = Date.now();

        t3 = t3 - t1;
        t2 = t2 - t1;
        t1 = Date.now() - t1;
        ctx.fillText('FPS: ' + Math.floor(1000 / t1) + '. Game: ' + t2 + '. Draw: ' + t3, 0, 10);
    },
    1000 / 60);
};

