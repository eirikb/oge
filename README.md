## OGE, Overworld Game Engine


This is a simple, fast and small engine for overworld typed games, it will handle squares in a given world.
The only features are collision detection and sliding bodies when colliding.
  
### Files

 * <b>src</b>: Source files
   * <b>base.oge.js</b>: Have to be first file, others depend on it
 * <b>spec</b>: Spec files, main tests
 * <b>lib</b>: Libraries for testing and building
   * <b>compiler.jar</b>: Google Closure Compiler for compiling
   * <b>jslint4java-1.4.6.jar</b>: Java version of JSLint, for checking the source
 * <b>dist</b>: Built and ready to use files
   * <b>oge.js</b>: Bundled version of the source, readable
   * <b>oge.min.js</b>: Compiled version (Google Closure Compiler)
 * <b>Makefile</b>: Testing and pulling dependent test framework
 * <b>SpecRunner.html</b>: For testing in browser
 * <b>SpecRunnerDist.html</b>: For testing dist file (dist/oge.min.js) in browser

### Testing

To test the project you must do the following:
 
 * Run:
       make update 
   to fetch dependecies
 * Open SpecRunner.html in a browser
