/* core */
import Config, { keys as ConfigKeys } from 'javascript/config'
import Viewport from 'javascript/viewport'

/* utility */
import compileShader from 'utility/compileShader'
import getAttribLocation from 'utility/getAttribLocation'
import getUniformLocation from 'utility/getUniformLocation'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import fragmentShaderSource from 'shaders/fractal.glsl'

/* libraries */
import HashSubscriber from 'hash-subscriber'
import forEach from 'lodash/forEach'

const canvas  = document.getElementById("main")

const WIDTH  = window.innerWidth
const HEIGHT = window.innerHeight

canvas.width  = WIDTH
canvas.height = HEIGHT

const context = canvas.getContext('webgl')

Viewport.create({
  canvas: canvas,
  getConfig: Config.getConfig,
  setConfig: Config.setConfig
})

/* IGNORING 'ITERATIONS' FOR NOW */
// HashSubscriber.subscribe(['iterations'], () => {
//   Fractal.MAX_ITERATIONS = getConfig().iterations
//   renderer.render()
// })
const resetZoomButton = document.getElementsByClassName('reset-zoom-button')[0]
const sliders = Array.from(document.getElementsByTagName('input'))
const selects = Array.from(document.getElementsByTagName('select'))
const inputs = sliders.concat(selects)

resetZoomButton.addEventListener('click', () => {
  Config.setConfig({
    x_min: Config.defaults.x_min,
    x_max: Config.defaults.x_max,
    y_min: Config.defaults.y_min,
    y_max: Config.defaults.y_max
  })
})

inputs.forEach(input => {
  input.addEventListener('input', inputEventHandler.bind(null, input))
})

HashSubscriber.subscribe(ConfigKeys, setConfigValues)

let config
function setConfigValues() {
  config = Config.getConfig()

  inputs.forEach(input => {
    input.value = config[input.name]
  })
}

setConfigValues()

function inputEventHandler(input) {
  Config.setConfig({
    [input.name]: input.value
  })
}

const content = document.getElementsByClassName('content')[0]
const hambergerMenu = document.getElementsByClassName('hamberger-menu')[0]

hambergerMenu.addEventListener('click', () => {
  content.classList.toggle('menu-open')
})

/**
 * Shaders
 */

const vertexShader = compileShader(vertexShaderSource, context.VERTEX_SHADER, context)
const fragmentShader = compileShader(fragmentShaderSource, context.FRAGMENT_SHADER, context)

const program = context.createProgram()
context.attachShader(program, vertexShader)
context.attachShader(program, fragmentShader)
context.linkProgram(program)
context.useProgram(program)

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
const vertexData = new Float32Array([
  -1.0,  1.0, // top left
  -1.0, -1.0, // bottom left
   1.0,  1.0, // top right
   1.0, -1.0  // bottom right
])
const vertexDataBuffer = context.createBuffer()
context.bindBuffer(context.ARRAY_BUFFER, vertexDataBuffer)
context.bufferData(context.ARRAY_BUFFER, vertexData, context.STATIC_DRAW)

/**
 * Attribute setup
 */

// To make the geometry information available in the shader as attributes, we
// need to tell WebGL what the layout of our data in the vertex buffer is.
const positionHandle = getAttribLocation(program, 'position', context)
context.enableVertexAttribArray(positionHandle)
context.vertexAttribPointer(positionHandle,
                       2, // position is a vec2
                       context.FLOAT, // each component is a float
                       context.FALSE, // don't normalize values
                       2 * 4, // two 4 byte float components per vertex
                       0 // offset into each span of vertex data
                       )

/**
 * Draw
 */

let time = Date.now()
function drawFrame() {
  time += config.speed

  forEach(config, (value, name) => setUniformValue(name, value))

  setUniformValue('WIDTH', WIDTH)
  setUniformValue('HEIGHT', HEIGHT)
  setUniformValue('C_REAL', -0.795 + Math.sin(time / 2000) / 40)
  setUniformValue('C_IMAG', 0.2321 + Math.cos(time / 1330) / 40)

  context.drawArrays(context.TRIANGLE_STRIP, 0, 4)

  requestAnimationFrame(drawFrame)
}

function setUniformValue(name, value) {
  let dataPointer = getUniformLocation(program, name.toUpperCase(), context)
  context.uniform1fv(dataPointer, new Float32Array([value]))
}

requestAnimationFrame(drawFrame)

