/* core */
import Config from 'javascript/config'
import Viewport from 'javascript/viewport'
import bindEvents from 'javascript/bindEvents'

/* utility */
import compileShader from 'utility/compileShader'
import prepareGeometry from 'utility/prepareGeometry'
import createProgram from 'utility/createProgram'
import getUniformLocation from 'utility/getUniformLocation'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import fragmentShaderSource from 'shaders/fractal.glsl'

/* libraries */
import forEach from 'lodash/forEach'

const canvas  = document.getElementById("main")

let WIDTH  = window.innerWidth
let HEIGHT = window.innerHeight

canvas.width  = WIDTH
canvas.height = HEIGHT

const viewport = Viewport.create({
  canvas: canvas,
  getConfig: Config.getConfig,
  setConfig: Config.setConfig
})

bindEvents({ viewport })

const context = canvas.getContext('webgl')

/**
 * Shaders
 */
const vertexShader = compileShader({
  shaderSource: vertexShaderSource,
  shaderType: context.VERTEX_SHADER,
  context
})

const fragmentShader = compileShader({
  shaderSource: fragmentShaderSource,
  shaderType: context.FRAGMENT_SHADER,
  context
})

const program = createProgram({
  vertexShaders: [vertexShader],
  fragmentShaders: [fragmentShader],
  context
})

/**
 * Geometry
 */

const vertices = new Float32Array([
  -1.0,  1.0, // top left
  -1.0, -1.0, // bottom left
   1.0,  1.0, // top right
   1.0, -1.0  // bottom right
])

prepareGeometry({context, program, vertices})

/**
 * Draw
 */

let time = Date.now()
function drawFrame() {
  const config = Config.getConfig()

  time += parseFloat(config.speed)

  forEach(config, (value, name) => setUniformValue(name, value))

  setUniformValue('WIDTH', WIDTH)
  setUniformValue('HEIGHT', HEIGHT)
  setUniformValue('C_REAL', -0.795 + Math.sin(time / 2000) / 40)
  setUniformValue('C_IMAG', 0.2321 + Math.cos(time / 1330) / 40)

  context.drawArrays(context.TRIANGLE_STRIP, 0, 4)

  resize(context)

  requestAnimationFrame(drawFrame)
}

function setUniformValue(name, value) {
  let dataPointer = getUniformLocation({
    program,
    name: name.toUpperCase(),
    context
  })

  context.uniform1fv(dataPointer, new Float32Array([value]))
}

requestAnimationFrame(drawFrame)

function resize(context) {
  /* http://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html */
  var realToCSSPixels = window.devicePixelRatio || 1;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  var displayWidth  = Math.floor(window.innerWidth  * realToCSSPixels);
  var displayHeight = Math.floor(window.innerHeight * realToCSSPixels);

  WIDTH = window.innerWidth
  HEIGHT = window.innerHeight

  // Check if the canvas is not the same size.
  if (context.canvas.width  !== displayWidth || context.canvas.height !== displayHeight) {
    // Make the canvas the same size
    context.canvas.width  = displayWidth;
    context.canvas.height = displayHeight;

    // Set the viewport to match
    context.viewport(0, 0, context.canvas.width, context.canvas.height);
  }
}
