function createGrid(world, width, height, size) {
    var x, y;
    for (y = size; y < height / 2; y += size * 4) {
        for (x = size; x < width / 2; x += size * 4) {
            utils.createBox(world, x, y, size, size, {
                userData: 'filled'
            });
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

    player = utils.createBox(world, 150, 250, 10, 10, {
        density: 1,
        friction: 0
    },
    {
        preventRotation: true,
        allowSleep: false
    });
    /*
bd = new box2d.BodyDef();
    bd.position.Set(150, 250);
    bd.preventRotation = true;
    bd.allowSleep = false;

    sd = new box2d.BoxDef();
    sd.density = 1;
    sd.friction = 0;
    sd.extents.Set(10, 20);
    bd.AddShape(sd);

    player = world.CreateBody(bd);
    */
    player.speed = 100;
    player.cos = 0;
    player.sin = 0;

    world.SetFilter({
        ShouldCollide: function(a, b) {
            if (a === player.m_shapeList || b === player.m_shapeList) {
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
        utils.createBox(world, e.offsetX, e.offsetY, 10, 10);
    };

    var time, dTime, gTime;
    setInterval(function() {
        time = Date.now();
        time = gTime = Date.now();
        world.Step(1.0 / 60, 1);
        gTime = Date.now() - gTime;
        player.GetLinearVelocity().Set(player.cos * player.speed, player.sin * player.speed);
        dTime = Date.now();
        draw.drawWorld(world, ctx);
        dTime = Date.now() - dTime;
        time = Date.now() - time;
        ctx.strokeText('fps: ' + Math.floor(1000 / time), 10, 10);
        ctx.strokeText('game time: ' + gTime, 10, 20);
        ctx.strokeText('drawing time: ' + dTime, 10, 30);
    },
    1000 / 60);
};

