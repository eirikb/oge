OGE, Overworld Game Engine
=============

This is a simple, fast and small engine which will only take care of controlling squares of variable size over a given world.
The only features given is collision detection and sliding bodies when colliding.
  

Testing
------------

To test the project you must do the following:
 
 * Run 'make update' to fetch dependecies
 * Open SpecRunner.html
  
Hopefully this will be runnable from v8 in the future 


Files
------------
 * lib/env.js: Environment file for making Jasmine work
 * lib/jasmine-print.js: My convert of jamsine-html.js to use log as print, no HTML
 * lib/spec-runner.js: Set up Jasmine and execute it similar to SpecRunner.html

 * spec/: Spec files, the main tests

 * src/base.js: Have to be first file, others depend on it
 * src/: Source files

 * Makefile: Testing and pulling dependent test framework
 * SpecRunner.html: For testing in browser
