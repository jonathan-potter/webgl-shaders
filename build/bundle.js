/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _fractal = __webpack_require__(1);
	
	var _fractal2 = _interopRequireDefault(_fractal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var canvas = document.getElementById("main");
	
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	
	var context = canvas.getContext('webgl');
	
	/**
	 * Shaders
	 */
	
	// Utility to fail loudly on shader compilation failure
	function compileShader(shaderSource, shaderType) {
	  var shader = context.createShader(shaderType);
	  context.shaderSource(shader, shaderSource);
	  context.compileShader(shader);
	
	  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
	    throw "Shader compile failed with: " + context.getShaderInfoLog(shader);
	  }
	
	  return shader;
	}
	
	var vertexShader = compileShader('\n\
	  attribute vec2 position;\n\
	  \n\
	  void main() {\n\
	    // position specifies only x and y.\n\
	    // We set z to be 0.0, and w to be 1.0\n\
	    gl_Position = vec4(position, 0.0, 1.0);\n\
	  }\
	', context.VERTEX_SHADER);
	
	var fragmentShader = compileShader(_fractal2.default, context.FRAGMENT_SHADER);
	
	var program = context.createProgram();
	context.attachShader(program, vertexShader);
	context.attachShader(program, fragmentShader);
	context.linkProgram(program);
	context.useProgram(program);
	
	/**
	 * Geometry setup
	 */
	
	// Set up 4 vertices, which we'll draw as a rectangle
	// via 2 triangles
	//
	//   A---C
	//   |  /|
	//   | / |
	//   |/  |
	//   B---D
	//
	// We order them like so, so that when we draw with
	// context.TRIANGLE_STRIP, we draw triangle ABC and BCD.
	var vertexData = new Float32Array([-1.0, 1.0, // top left
	-1.0, -1.0, // bottom left
	1.0, 1.0, // top right
	1.0, -1.0]);
	var vertexDataBuffer = context.createBuffer();
	context.bindBuffer(context.ARRAY_BUFFER, vertexDataBuffer);
	context.bufferData(context.ARRAY_BUFFER, vertexData, context.STATIC_DRAW);
	
	/**
	 * Attribute setup
	 */
	
	// Utility to complain loudly if we fail to find the attribute
	
	function getAttribLocation(program, name) {
	  var attributeLocation = context.getAttribLocation(program, name);
	  if (attributeLocation === -1) {
	    throw 'Can not find attribute ' + name + '.';
	  }
	  return attributeLocation;
	}
	
	// To make the geometry information available in the shader as attributes, we
	// need to tell WebGL what the layout of our data in the vertex buffer is.
	var positionHandle = getAttribLocation(program, 'position');
	context.enableVertexAttribArray(positionHandle);
	context.vertexAttribPointer(positionHandle, 2, // position is a vec2
	context.FLOAT, // each component is a float
	context.FALSE, // don't normalize values
	2 * 4, // two 4 byte float components per vertex
	0 // offset into each span of vertex data
	);
	
	/**
	 * Draw
	 */
	
	function getUniformLocation(program, name) {
	  var uniformLocation = context.getUniformLocation(program, name);
	  if (uniformLocation === -1) {
	    throw 'Can not find uniform ' + name + '.';
	  }
	  return uniformLocation;
	}
	
	function drawFrame() {
	  var dataToSendToGPU = new Float32Array(5);
	
	  var time = performance.now();
	
	  dataToSendToGPU[0] = WIDTH;
	  dataToSendToGPU[1] = HEIGHT;
	  dataToSendToGPU[2] = -0.795 + Math.sin(time / 2000) / 40;
	  dataToSendToGPU[3] = 0.2321 + Math.cos(time / 1330) / 40;
	
	  var dataPointer = getUniformLocation(program, 'data');
	  context.uniform1fv(dataPointer, dataToSendToGPU);
	  context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
	
	  requestAnimationFrame(drawFrame);
	}
	
	requestAnimationFrame(drawFrame);
	
	// Render the 4 vertices specified above (starting at index 0)
	// in TRIANGLE_STRIP mode.

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "precision highp float;\n\n// WIDTH, HEIGHT, C_REAL, C_IMAGINARY, TIME\nuniform float data[5];\n\nfloat WIDTH  = data[0];\nfloat HEIGHT = data[1];\n\nconst int MAX_ITERATIONS = 512;\n\nvec2 iResolution = vec2(WIDTH, HEIGHT);\n\nstruct complex {\n  float real;\n  float imaginary;\n};\n\nint fractal(complex c, complex z) {\n  for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++) {\n\n    // z <- z^2 + c\n    float real = z.real * z.real - z.imaginary * z.imaginary + c.real;\n    float imaginary = 2.0 * z.real * z.imaginary + c.imaginary;\n\n    z.real = real;\n    z.imaginary = imaginary;\n\n    if (z.real * z.real + z.imaginary * z.imaginary > 4.0) {\n      return iteration;\n    }\n  }\n\n  return 0;\n}\n\nint mandelbrot(vec2 coordinate) {\n  complex c = complex(coordinate.x, coordinate.y);\n  complex z = complex(0.0, 0.0);\n\n  return fractal(c, z);\n}\n\nint julia(vec2 coordinate, vec2 offset) {\n  complex c = complex(offset.x, offset.y);\n  complex z = complex(coordinate.x, coordinate.y);\n\n  return fractal(c, z);\n}\n\nvec2 fragCoordToXY(vec4 fragCoord) {\n  vec2 relativePosition = fragCoord.xy / iResolution.xy;\n  float aspectRatio = iResolution.x / HEIGHT;\n\n  vec2 cartesianPosition = (relativePosition - 0.5) * 4.0;\n  cartesianPosition.x *= aspectRatio;\n\n  return cartesianPosition;\n}\n\nvoid main() {\n  vec2 coordinate = fragCoordToXY(gl_FragCoord);\n\n  // int fractalValue = mandelbrot(coordinate);\n  int fractalValue = julia(coordinate, vec2(data[2], data[3]));\n\n  float color = 5.0 * float(fractalValue) / float(MAX_ITERATIONS);\n\n  gl_FragColor = vec4(color, color, color, 1.0);\n}\n"

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjhjYTZmOTI5ZTEwNjM0YWMxMTgiLCJ3ZWJwYWNrOi8vLy4vamF2YXNjcmlwdC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2hhZGVycy9mcmFjdGFsLmdsc2wiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTs7Ozs7O0FBRUEsS0FBSSxTQUFVLFNBQVMsY0FBVCxDQUF3QixNQUF4QixDQUFkOztBQUVBLEtBQUksUUFBUyxPQUFPLFVBQXBCO0FBQ0EsS0FBSSxTQUFTLE9BQU8sV0FBcEI7O0FBRUEsUUFBTyxLQUFQLEdBQWdCLEtBQWhCO0FBQ0EsUUFBTyxNQUFQLEdBQWdCLE1BQWhCOztBQUVBLEtBQUksVUFBVSxPQUFPLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBZDs7QUFFQTs7OztBQUlBO0FBQ0EsVUFBUyxhQUFULENBQXVCLFlBQXZCLEVBQXFDLFVBQXJDLEVBQWlEO0FBQy9DLE9BQUksU0FBUyxRQUFRLFlBQVIsQ0FBcUIsVUFBckIsQ0FBYjtBQUNBLFdBQVEsWUFBUixDQUFxQixNQUFyQixFQUE2QixZQUE3QjtBQUNBLFdBQVEsYUFBUixDQUFzQixNQUF0Qjs7QUFFQSxPQUFJLENBQUMsUUFBUSxrQkFBUixDQUEyQixNQUEzQixFQUFtQyxRQUFRLGNBQTNDLENBQUwsRUFBaUU7QUFDL0QsV0FBTSxpQ0FBaUMsUUFBUSxnQkFBUixDQUF5QixNQUF6QixDQUF2QztBQUNEOztBQUVELFVBQU8sTUFBUDtBQUNEOztBQUVELEtBQUksZUFBZSxjQUFjOzs7Ozs7OztFQUFkLEVBUWhCLFFBQVEsYUFSUSxDQUFu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QUFJLHVDQUF1QywyQkFBMkIsNEJBQTRCLGVBQWUsK0ZBQStGLGlFQUFpRSxzQkFBc0IsOEJBQThCLGdFQUFnRSx5QkFBeUIsT0FBTyxLQUFLLGVBQWUsR0FBRyxxQ0FBcUMsb0RBQW9ELGtDQUFrQywyQkFBMkIsR0FBRyw2Q0FBNkMsNENBQTRDLG9EQUFvRCwyQkFBMkIsR0FBRyx3Q0FBd0MsMERBQTBELCtDQUErQyw4REFBOEQsdUNBQXVDLCtCQUErQixHQUFHLGlCQUFpQixrREFBa0QsbURBQW1ELGlFQUFpRSxzRUFBc0Usb0RBQW9ELEdBQUcsRyIsImZpbGUiOiJidWlsZC9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGY4Y2E2ZjkyOWUxMDYzNGFjMTE4XG4gKiovIiwiaW1wb3J0IHNoYWRlciBmcm9tICdzaGFkZXJzL2ZyYWN0YWwuZ2xzbCdcblxudmFyIGNhbnZhcyAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIik7XG5cbnZhciBXSURUSCAgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbnZhciBIRUlHSFQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbmNhbnZhcy53aWR0aCAgPSBXSURUSDtcbmNhbnZhcy5oZWlnaHQgPSBIRUlHSFQ7XG5cbnZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJyk7XG5cbi8qKlxuICogU2hhZGVyc1xuICovXG5cbi8vIFV0aWxpdHkgdG8gZmFpbCBsb3VkbHkgb24gc2hhZGVyIGNvbXBpbGF0aW9uIGZhaWx1cmVcbmZ1bmN0aW9uIGNvbXBpbGVTaGFkZXIoc2hhZGVyU291cmNlLCBzaGFkZXJUeXBlKSB7XG4gIHZhciBzaGFkZXIgPSBjb250ZXh0LmNyZWF0ZVNoYWRlcihzaGFkZXJUeXBlKTtcbiAgY29udGV4dC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzaGFkZXJTb3VyY2UpO1xuICBjb250ZXh0LmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICBpZiAoIWNvbnRleHQuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgY29udGV4dC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICB0aHJvdyBcIlNoYWRlciBjb21waWxlIGZhaWxlZCB3aXRoOiBcIiArIGNvbnRleHQuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuICB9XG5cbiAgcmV0dXJuIHNoYWRlcjtcbn1cblxudmFyIHZlcnRleFNoYWRlciA9IGNvbXBpbGVTaGFkZXIoJ1xcblxcXG4gIGF0dHJpYnV0ZSB2ZWMyIHBvc2l0aW9uO1xcblxcXG4gIFxcblxcXG4gIHZvaWQgbWFpbigpIHtcXG5cXFxuICAgIC8vIHBvc2l0aW9uIHNwZWNpZmllcyBvbmx5IHggYW5kIHkuXFxuXFxcbiAgICAvLyBXZSBzZXQgeiB0byBiZSAwLjAsIGFuZCB3IHRvIGJlIDEuMFxcblxcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLjAsIDEuMCk7XFxuXFxcbiAgfVxcXG4nLCBjb250ZXh0LlZFUlRFWF9TSEFERVIpO1xuXG52YXIgZnJhZ21lbnRTaGFkZXIgPSBjb21waWxlU2hhZGVyKHNoYWRlciwgY29udGV4dC5GUkFHTUVOVF9TSEFERVIpO1xuXG52YXIgcHJvZ3JhbSA9IGNvbnRleHQuY3JlYXRlUHJvZ3JhbSgpO1xuY29udGV4dC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcbmNvbnRleHQuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcbmNvbnRleHQubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5jb250ZXh0LnVzZVByb2dyYW0ocHJvZ3JhbSk7XG5cbi8qKlxuICogR2VvbWV0cnkgc2V0dXBcbiAqL1xuXG4vLyBTZXQgdXAgNCB2ZXJ0aWNlcywgd2hpY2ggd2UnbGwgZHJhdyBhcyBhIHJlY3RhbmdsZVxuLy8gdmlhIDIgdHJpYW5nbGVzXG4vL1xuLy8gICBBLS0tQ1xuLy8gICB8ICAvfFxuLy8gICB8IC8gfFxuLy8gICB8LyAgfFxuLy8gICBCLS0tRFxuLy9cbi8vIFdlIG9yZGVyIHRoZW0gbGlrZSBzbywgc28gdGhhdCB3aGVuIHdlIGRyYXcgd2l0aFxuLy8gY29udGV4dC5UUklBTkdMRV9TVFJJUCwgd2UgZHJhdyB0cmlhbmdsZSBBQkMgYW5kIEJDRC5cbnZhciB2ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheShbXG4gIC0xLjAsICAxLjAsIC8vIHRvcCBsZWZ0XG4gIC0xLjAsIC0xLjAsIC8vIGJvdHRvbSBsZWZ0XG4gICAxLjAsICAxLjAsIC8vIHRvcCByaWdodFxuICAgMS4wLCAtMS4wLCAvLyBib3R0b20gcmlnaHRcbl0pO1xudmFyIHZlcnRleERhdGFCdWZmZXIgPSBjb250ZXh0LmNyZWF0ZUJ1ZmZlcigpO1xuY29udGV4dC5iaW5kQnVmZmVyKGNvbnRleHQuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhEYXRhQnVmZmVyKTtcbmNvbnRleHQuYnVmZmVyRGF0YShjb250ZXh0LkFSUkFZX0JVRkZFUiwgdmVydGV4RGF0YSwgY29udGV4dC5TVEFUSUNfRFJBVyk7XG5cbi8qKlxuICogQXR0cmlidXRlIHNldHVwXG4gKi9cblxuLy8gVXRpbGl0eSB0byBjb21wbGFpbiBsb3VkbHkgaWYgd2UgZmFpbCB0byBmaW5kIHRoZSBhdHRyaWJ1dGVcblxuZnVuY3Rpb24gZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgbmFtZSkge1xuICB2YXIgYXR0cmlidXRlTG9jYXRpb24gPSBjb250ZXh0LmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIG5hbWUpO1xuICBpZiAoYXR0cmlidXRlTG9jYXRpb24gPT09IC0xKSB7XG4gICAgICB0aHJvdyAnQ2FuIG5vdCBmaW5kIGF0dHJpYnV0ZSAnICsgbmFtZSArICcuJztcbiAgfVxuICByZXR1cm4gYXR0cmlidXRlTG9jYXRpb247XG59XG5cbi8vIFRvIG1ha2UgdGhlIGdlb21ldHJ5IGluZm9ybWF0aW9uIGF2YWlsYWJsZSBpbiB0aGUgc2hhZGVyIGFzIGF0dHJpYnV0ZXMsIHdlXG4vLyBuZWVkIHRvIHRlbGwgV2ViR0wgd2hhdCB0aGUgbGF5b3V0IG9mIG91ciBkYXRhIGluIHRoZSB2ZXJ0ZXggYnVmZmVyIGlzLlxudmFyIHBvc2l0aW9uSGFuZGxlID0gZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgJ3Bvc2l0aW9uJyk7XG5jb250ZXh0LmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvc2l0aW9uSGFuZGxlKTtcbmNvbnRleHQudmVydGV4QXR0cmliUG9pbnRlcihwb3NpdGlvbkhhbmRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgMiwgLy8gcG9zaXRpb24gaXMgYSB2ZWMyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuRkxPQVQsIC8vIGVhY2ggY29tcG9uZW50IGlzIGEgZmxvYXRcbiAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5GQUxTRSwgLy8gZG9uJ3Qgbm9ybWFsaXplIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAyICogNCwgLy8gdHdvIDQgYnl0ZSBmbG9hdCBjb21wb25lbnRzIHBlciB2ZXJ0ZXhcbiAgICAgICAgICAgICAgICAgICAgICAgMCAvLyBvZmZzZXQgaW50byBlYWNoIHNwYW4gb2YgdmVydGV4IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuLyoqXG4gKiBEcmF3XG4gKi9cblxuZnVuY3Rpb24gZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIG5hbWUpIHtcbiAgdmFyIHVuaWZvcm1Mb2NhdGlvbiA9IGNvbnRleHQuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIG5hbWUpO1xuICBpZiAodW5pZm9ybUxvY2F0aW9uID09PSAtMSkge1xuICAgIHRocm93ICdDYW4gbm90IGZpbmQgdW5pZm9ybSAnICsgbmFtZSArICcuJztcbiAgfVxuICByZXR1cm4gdW5pZm9ybUxvY2F0aW9uO1xufVxuXG5mdW5jdGlvbiBkcmF3RnJhbWUoKSB7XG4gIHZhciBkYXRhVG9TZW5kVG9HUFUgPSBuZXcgRmxvYXQzMkFycmF5KDUpO1xuXG4gIHZhciB0aW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgZGF0YVRvU2VuZFRvR1BVWzBdID0gV0lEVEg7XG4gIGRhdGFUb1NlbmRUb0dQVVsxXSA9IEhFSUdIVDtcbiAgZGF0YVRvU2VuZFRvR1BVWzJdID0gLTAuNzk1ICsgTWF0aC5zaW4odGltZSAvIDIwMDApIC8gNDA7XG4gIGRhdGFUb1NlbmRUb0dQVVszXSA9IDAuMjMyMSArIE1hdGguY29zKHRpbWUgLyAxMzMwKSAvIDQwO1xuXG4gIHZhciBkYXRhUG9pbnRlciA9IGdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAnZGF0YScpO1xuICBjb250ZXh0LnVuaWZvcm0xZnYoZGF0YVBvaW50ZXIsIGRhdGFUb1NlbmRUb0dQVSk7XG4gIGNvbnRleHQuZHJhd0FycmF5cyhjb250ZXh0LlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcblxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhd0ZyYW1lKVxufVxuXG5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhd0ZyYW1lKVxuXG4vLyBSZW5kZXIgdGhlIDQgdmVydGljZXMgc3BlY2lmaWVkIGFib3ZlIChzdGFydGluZyBhdCBpbmRleCAwKVxuLy8gaW4gVFJJQU5HTEVfU1RSSVAgbW9kZS5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vamF2YXNjcmlwdC9hcHAuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbi8vIFdJRFRILCBIRUlHSFQsIENfUkVBTCwgQ19JTUFHSU5BUlksIFRJTUVcXG51bmlmb3JtIGZsb2F0IGRhdGFbNV07XFxuXFxuZmxvYXQgV0lEVEggID0gZGF0YVswXTtcXG5mbG9hdCBIRUlHSFQgPSBkYXRhWzFdO1xcblxcbmNvbnN0IGludCBNQVhfSVRFUkFUSU9OUyA9IDUxMjtcXG5cXG52ZWMyIGlSZXNvbHV0aW9uID0gdmVjMihXSURUSCwgSEVJR0hUKTtcXG5cXG5zdHJ1Y3QgY29tcGxleCB7XFxuICBmbG9hdCByZWFsO1xcbiAgZmxvYXQgaW1hZ2luYXJ5O1xcbn07XFxuXFxuaW50IGZyYWN0YWwoY29tcGxleCBjLCBjb21wbGV4IHopIHtcXG4gIGZvciAoaW50IGl0ZXJhdGlvbiA9IDA7IGl0ZXJhdGlvbiA8IE1BWF9JVEVSQVRJT05TOyBpdGVyYXRpb24rKykge1xcblxcbiAgICAvLyB6IDwtIHpeMiArIGNcXG4gICAgZmxvYXQgcmVhbCA9IHoucmVhbCAqIHoucmVhbCAtIHouaW1hZ2luYXJ5ICogei5pbWFnaW5hcnkgKyBjLnJlYWw7XFxuICAgIGZsb2F0IGltYWdpbmFyeSA9IDIuMCAqIHoucmVhbCAqIHouaW1hZ2luYXJ5ICsgYy5pbWFnaW5hcnk7XFxuXFxuICAgIHoucmVhbCA9IHJlYWw7XFxuICAgIHouaW1hZ2luYXJ5ID0gaW1hZ2luYXJ5O1xcblxcbiAgICBpZiAoei5yZWFsICogei5yZWFsICsgei5pbWFnaW5hcnkgKiB6LmltYWdpbmFyeSA+IDQuMCkge1xcbiAgICAgIHJldHVybiBpdGVyYXRpb247XFxuICAgIH1cXG4gIH1cXG5cXG4gIHJldHVybiAwO1xcbn1cXG5cXG5pbnQgbWFuZGVsYnJvdCh2ZWMyIGNvb3JkaW5hdGUpIHtcXG4gIGNvbXBsZXggYyA9IGNvbXBsZXgoY29vcmRpbmF0ZS54LCBjb29yZGluYXRlLnkpO1xcbiAgY29tcGxleCB6ID0gY29tcGxleCgwLjAsIDAuMCk7XFxuXFxuICByZXR1cm4gZnJhY3RhbChjLCB6KTtcXG59XFxuXFxuaW50IGp1bGlhKHZlYzIgY29vcmRpbmF0ZSwgdmVjMiBvZmZzZXQpIHtcXG4gIGNvbXBsZXggYyA9IGNvbXBsZXgob2Zmc2V0LngsIG9mZnNldC55KTtcXG4gIGNvbXBsZXggeiA9IGNvbXBsZXgoY29vcmRpbmF0ZS54LCBjb29yZGluYXRlLnkpO1xcblxcbiAgcmV0dXJuIGZyYWN0YWwoYywgeik7XFxufVxcblxcbnZlYzIgZnJhZ0Nvb3JkVG9YWSh2ZWM0IGZyYWdDb29yZCkge1xcbiAgdmVjMiByZWxhdGl2ZVBvc2l0aW9uID0gZnJhZ0Nvb3JkLnh5IC8gaVJlc29sdXRpb24ueHk7XFxuICBmbG9hdCBhc3BlY3RSYXRpbyA9IGlSZXNvbHV0aW9uLnggLyBIRUlHSFQ7XFxuXFxuICB2ZWMyIGNhcnRlc2lhblBvc2l0aW9uID0gKHJlbGF0aXZlUG9zaXRpb24gLSAwLjUpICogNC4wO1xcbiAgY2FydGVzaWFuUG9zaXRpb24ueCAqPSBhc3BlY3RSYXRpbztcXG5cXG4gIHJldHVybiBjYXJ0ZXNpYW5Qb3NpdGlvbjtcXG59XFxuXFxudm9pZCBtYWluKCkge1xcbiAgdmVjMiBjb29yZGluYXRlID0gZnJhZ0Nvb3JkVG9YWShnbF9GcmFnQ29vcmQpO1xcblxcbiAgLy8gaW50IGZyYWN0YWxWYWx1ZSA9IG1hbmRlbGJyb3QoY29vcmRpbmF0ZSk7XFxuICBpbnQgZnJhY3RhbFZhbHVlID0ganVsaWEoY29vcmRpbmF0ZSwgdmVjMihkYXRhWzJdLCBkYXRhWzNdKSk7XFxuXFxuICBmbG9hdCBjb2xvciA9IDUuMCAqIGZsb2F0KGZyYWN0YWxWYWx1ZSkgLyBmbG9hdChNQVhfSVRFUkFUSU9OUyk7XFxuXFxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCBjb2xvciwgY29sb3IsIDEuMCk7XFxufVxcblwiXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NoYWRlcnMvZnJhY3RhbC5nbHNsXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==