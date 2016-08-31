/* core */
import Viewport from 'javascript/viewport'

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

export default function ({store}) {
  const canvas  = document.getElementById("main")

  let WIDTH  = window.innerWidth
  let HEIGHT = window.innerHeight

  canvas.width  = WIDTH
  canvas.height = HEIGHT

  const state = store.getState()
  const currentFractal = state.fractal
  const bounds = state.propertiesByFractal[currentFractal].bounds
  Viewport.create({
    canvas: canvas,
    getConfig: () => bounds, /* UPDATE */
    setConfig: bounds => { /* UPDATE */
      store.dispatch({
        type: 'SET_BOUNDS',
        fractal: store.getState().fractal,
        bounds
      })
    }
  })

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
  function drawFrame(store) {
    const state = store.getState()
    const currentFractal = state.fractal
    const properties = state.propertiesByFractal[currentFractal]

    const config = properties.config
    const bounds = properties.bounds

    time += parseFloat(config.speed)

    setUniformValue('fractal', currentFractal)
    forEach(config, (value, name) => setUniformValue(name, value))
    forEach(bounds, (value, name) => setUniformValue(name, value))

    setUniformValue('WIDTH', WIDTH)
    setUniformValue('HEIGHT', HEIGHT)
    setUniformValue('C_REAL', -0.795 + Math.sin(time / 2000) / 40)
    setUniformValue('C_IMAG', 0.2321 + Math.cos(time / 1330) / 40)

    context.drawArrays(context.TRIANGLE_STRIP, 0, 4)

    resize(context)

    requestAnimationFrame(drawFrame.bind(null, store))
  }

  requestAnimationFrame(drawFrame.bind(null, store))

  function setUniformValue(name, value) {
    let dataPointer = getUniformLocation({
      program,
      name: name.toUpperCase(),
      context
    })

    context.uniform1fv(dataPointer, new Float32Array([value]))
  }

  function resize(context) {
    /* http://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html */
    WIDTH = window.innerWidth
    HEIGHT = window.innerHeight

    if (context.canvas.width  !== WIDTH || context.canvas.height !== HEIGHT) {
      canvas.width  = WIDTH;
      canvas.height = HEIGHT;

      context.viewport(0, 0, WIDTH, HEIGHT);
    }
  }
}
