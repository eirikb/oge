OGE, Overworld Game Engine
-


This is a simple, fast and small engine for overworld typed games, it will handle squares in a given world.  
The only features are collision detection and sliding bodies when colliding.

Demo
--
http://eirikb.github.com/oge/
 
Example
--

  var world = new oge.World(100, 100),
  player = {
    x: 10,
    y: 10,
    width: 15,
    height: 15,
    speed: 3,
    direction: {
      cos: 1,
      sin: 0
    },
    slide: true
  };

  world.addBody(player, true);
  world.addBody({
    x: 50,
    y: 50,
    width: 10,
    height: 20
  });
