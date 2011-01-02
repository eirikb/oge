OGE, Overworld Game Engine
=============

This is a simple, fast and small engine for overworld typed games, it will handle squares in a given world.
The only features are collision detection and sliding bodies when colliding.
  
Files
------------
 * lib/env.js: Environment file for making Jasmine work in terminal (rhino, v8)
 * lib/jasmine-print.js: My version of jamsine-html.js to use log as print, no HTML

 * spec/*.js: Spec files, the main tests

 * src/base.js: Have to be first file, others depend on it
 * src/*.js: Source files

 * Makefile: Testing and pulling dependent test framework
 * SpecRunner.html: For testing in browser
 * SpecRunner.js: Set up Jasmine and execute it similar to SpecRunner.html, just for terminal (rhino, v8)

Testing
------------

To test the project you must do the following:
 
 * Run 'make update' to fetch dependecies
 * Open SpecRunner.html in a browser
  
Hopefully this will be runnable from v8 in the future 

To try testing in v8 or rhino do:
 * make update
 * make test