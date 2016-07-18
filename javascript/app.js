import compileShader from 'javascript/utility/compileShader'
import getAttribLocation from 'javascript/utility/getAttribLocation'
import getUniformLocation from 'javascript/utility/getUniformLocation'

import vertexShaderSource from 'shaders/vertexShader.glsl'
import shaderSource from 'shaders/fractal.glsl'

var canvas  = document.getElementById("main");

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

canvas.width  = WIDTH;
canvas.height = HEIGHT;

var context = canvas.getContext('webgl');

/**
 * Shaders
 */

var vertexShader = compileShader(vertexShaderSource, context.VERTEX_SHADER, context);
var fragmentShader = compileShader(shaderSource, context.FRAGMENT_SHADER, context);

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
var vertexData = new Float32Array([
  -1.0,  1.0, // top left
  -1.0, -1.0, // bottom left
   1.0,  1.0, // top right
   1.0, -1.0  // bottom right
]);
var vertexDataBuffer = context.createBuffer();
context.bindBuffer(context.ARRAY_BUFFER, vertexDataBuffer);
context.bufferData(context.ARRAY_BUFFER, vertexData, context.STATIC_DRAW);

/**
 * Attribute setup
 */

// To make the geometry information available in the shader as attributes, we
// need to tell WebGL what the layout of our data in the vertex buffer is.
var positionHandle = getAttribLocation(program, 'position', context);
context.enableVertexAttribArray(positionHandle);
context.vertexAttribPointer(positionHandle,
                       2, // position is a vec2
                       context.FLOAT, // each component is a float
                       context.FALSE, // don't normalize values
                       2 * 4, // two 4 byte float components per vertex
                       0 // offset into each span of vertex data
                       );

/**
 * Draw
 */

function drawFrame() {
  var dataToSendToGPU = new Float32Array(5);

  var time = performance.now();

  dataToSendToGPU[0] = WIDTH;
  dataToSendToGPU[1] = HEIGHT;
  dataToSendToGPU[2] = -0.795 + Math.sin(time / 2000) / 40;
  dataToSendToGPU[3] = 0.2321 + Math.cos(time / 1330) / 40;

  var dataPointer = getUniformLocation(program, 'data', context);
  context.uniform1fv(dataPointer, dataToSendToGPU);
  context.drawArrays(context.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(drawFrame)
}

requestAnimationFrame(drawFrame)

// Render the 4 vertices specified above (starting at index 0)
// in TRIANGLE_STRIP mode.
