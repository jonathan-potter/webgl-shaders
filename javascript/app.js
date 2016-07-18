import shader from 'shaders/fractal.glsl'

var canvas  = document.getElementById("main");

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

canvas.width  = WIDTH;
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

var fragmentShader = compileShader(shader, context.FRAGMENT_SHADER);

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
   1.0, -1.0, // bottom right
]);
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

  requestAnimationFrame(drawFrame)
}

requestAnimationFrame(drawFrame)

// Render the 4 vertices specified above (starting at index 0)
// in TRIANGLE_STRIP mode.
