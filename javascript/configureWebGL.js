/* utility */
import compileShader from 'utility/compileShader'
import prepareGeometry from 'utility/prepareGeometry'
import createProgram from 'utility/createProgram'
import setUniformValue from 'utility/setUniformValue'

/* state accessors */
import { getCurrentFractal, getFractalConfig, getFractalViewport } from 'reducers'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import fragmentShaderSource from 'shaders/fractal.glsl'

/* libraries */
import forEach from 'lodash/forEach'

const FRACTAL_ENUM = {
  'julia set': 0,
  'mandelbrot set': 1
}

const { Float32Array, requestAnimationFrame } = window

export default function ({ store }) {
  const canvas = document.getElementById('main')
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

  /* eslint-disable no-multi-spaces, indent */
  const vertices = new Float32Array([
    -1.0,  1.0, // top left
    -1.0, -1.0, // bottom left
     1.0,  1.0, // top right
     1.0, -1.0  // bottom right
  ])
  /* eslint-enable no-multi-spaces, indent */

  prepareGeometry({context, program, vertices})

  /**
   * Draw
   */

  let time = Date.now()
  function drawFrame (store) {
    const state = store.getState()
    const currentFractal = getCurrentFractal(state)
    const { center, range } = getFractalViewport(state, currentFractal)
    const config = getFractalConfig(state, currentFractal)

    time += parseFloat(config.speed)

    setUniformValue('fractal', FRACTAL_ENUM[currentFractal], context, program)
    forEach(config, (value, name) => setUniformValue(name, value, context, program))
    setUniformValue('center', [center.x, center.y], context, program)
    setUniformValue('range', [range.x, range.y], context, program)

    setUniformValue('WIDTH', window.innerWidth, context, program)
    setUniformValue('HEIGHT', window.innerHeight, context, program)
    setUniformValue('C_REAL', -0.795 + Math.sin(time / 2000) / 40, context, program)
    setUniformValue('C_IMAG', 0.2321 + Math.cos(time / 1330) / 40, context, program)

    context.drawArrays(context.TRIANGLE_STRIP, 0, 4)

    resize(context)

    requestAnimationFrame(drawFrame.bind(null, store))
  }

  requestAnimationFrame(drawFrame.bind(null, store))

  function resize (context) {
    /* http://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html */
    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight

    if (context.canvas.width !== WIDTH || context.canvas.height !== HEIGHT) {
      canvas.width = WIDTH
      canvas.height = HEIGHT

      context.viewport(0, 0, WIDTH, HEIGHT)
    }
  }
}
