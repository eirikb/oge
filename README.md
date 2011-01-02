## OGE, Overworld Game Engine


This is a simple, fast and small engine for overworld typed games, it will handle squares in a given world.
The only features are collision detection and sliding bodies when colliding.
  
### Files
 * <b>lib/env.js</b>: Environment file for making Jasmine work in terminal (rhino, v8)
 * <b>lib/jasmine-print.js</b>: My version of jamsine-html.js to use log as print, no HTML

 * <b>spec/*.js</b>: Spec files, the main tests

 * <b>src/base.js</b>: Have to be first file, others depend on it
 * <b>src/*.js</b>: Source files

 * <b>Makefile</b>: Testing and pulling dependent test framework
 * <b>SpecRunner.html</b>: For testing in browser
 * <b>SpecRunner.js</b>: Set up Jasmine and execute it similar to SpecRunner.html, just for terminal (rhino, v8)

### Testing

To test the project you must do the following:
 
 * Run:
       make update 
   to fetch dependecies
 * Open SpecRunner.html in a browser
  
Hopefully this will be runnable from v8 in the future 

To try testing in v8 or rhino run these commands:
    make update
    make test