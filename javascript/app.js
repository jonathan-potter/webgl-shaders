/* core */
import Config from 'javascript/config'
import Viewport from 'javascript/viewport'

/* utility */
import compileShader from 'javascript/utility/compileShader'
import getAttribLocation from 'javascript/utility/getAttribLocation'
import getUniformLocation from 'javascript/utility/getUniformLocation'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import shaderSource from 'shaders/fractal.glsl'

/* libraries */
import HashSubscriber from 'hash-subscriber'

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
const sliders = document.getElementsByTagName('input')
Array.from(sliders).forEach(slider => {
  slider.addEventListener('input', sliderEventHandler.bind(null, slider))
})

let brightness, colorset, speed, supersamples, x_min, x_max, y_min, y_max
HashSubscriber.subscribe(['brightness', 'colorset', 'speed', 'supersamples', 'x_min', 'x_max', 'y_min', 'y_max'], setConfigValues)

const SLIDER_VALUES = {
  supersamples: [1, 4, 16]
}

function setConfigValues() {
  const config = Config.getConfig()

  x_min = config.x_min
  x_max = config.x_max
  y_min = config.y_min
  y_max = config.y_max

  brightness = config.brightness
  colorset = config.colorset
  speed = config.speed

  supersamples = config.supersamples

  Array.from(sliders).forEach(slider => {
    const currentValue = config[slider.name]
    const values = SLIDER_VALUES[slider.name]

    let valueIndex
    if (values) {
      valueIndex = values.indexOf(currentValue)
    }

    if (valueIndex === undefined) {
      slider.value = currentValue
    } else {
      slider.value = valueIndex
    }
  })
}

setConfigValues()

function sliderEventHandler(slider) {
  const values = SLIDER_VALUES[slider.name]

  Config.setConfig({
    [slider.name]: values && values[slider.value] || slider.value
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
const fragmentShader = compileShader(shaderSource, context.FRAGMENT_SHADER, context)

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
  const dataToSendToGPU = new Float32Array(11)

  time += speed

  dataToSendToGPU[0] = WIDTH
  dataToSendToGPU[1] = HEIGHT
  dataToSendToGPU[2] = -0.795 + Math.sin(time / 2000) / 40
  dataToSendToGPU[3] = 0.2321 + Math.cos(time / 1330) / 40
  dataToSendToGPU[4] = brightness
  dataToSendToGPU[5] = x_min
  dataToSendToGPU[6] = x_max
  dataToSendToGPU[7] = y_min
  dataToSendToGPU[8] = y_max
  dataToSendToGPU[9] = supersamples
  dataToSendToGPU[10] = colorset

  const dataPointer = getUniformLocation(program, 'data', context)
  context.uniform1fv(dataPointer, dataToSendToGPU)

  context.drawArrays(context.TRIANGLE_STRIP, 0, 4)

  requestAnimationFrame(drawFrame)
}

requestAnimationFrame(drawFrame)

