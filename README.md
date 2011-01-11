## OGE, Overworld Game Engine


This is a simple, fast and small engine for overworld typed games, it will handle squares in a given world.
The only features are collision detection and sliding bodies when colliding.
  
### Files
 * <b>lib</b>
   * <b>lib/compiler.jar</b>: Google Closure Compiler for compiling
 * <b>lib/jslint4java-1.4.6.jar</b>: Java version of JSLint, for checking the source

 * <b>spec/*.js</b>: Spec files, the main tests

 * <b>src/base.oge.js</b>: Have to be first file, others depend on it
 * <b>src/*.js</b>: Source files

 * <b>Makefile</b>: Testing and pulling dependent test framework
 * <b>SpecRunner.html</b>: For testing in browser

### Testing

To test the project you must do the following:
 
 * Run:
       make update 
   to fetch dependecies
 * Open SpecRunner.html in a browser
