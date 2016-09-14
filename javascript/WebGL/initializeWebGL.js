import { getCurrentFractal } from 'reducers'
import configureWebGL from 'webgl/configureWebGL'
import drawFrame from 'webgl/drawFrame'
import prepareGeometry from 'webgl-utilities/prepareGeometry'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import juliaShaderSource from 'shaders/julia.glsl'
import collatzShaderSource from 'shaders/collatz.glsl'

const { requestAnimationFrame, Float32Array } = window

export default ({ store }) => {
  const canvas = document.getElementById('main')
  const context = canvas.getContext('webgl')

  const programs = {
    'julia set': configureWebGL({
      context,
      vertexShaderSource: vertexShaderSource,
      fragmentShaderSource: juliaShaderSource
    }),
    'mandelbrot set': configureWebGL({
      context,
      vertexShaderSource: vertexShaderSource,
      fragmentShaderSource: juliaShaderSource
    }),
    'modified collatz': configureWebGL({
      context,
      vertexShaderSource: vertexShaderSource,
      fragmentShaderSource: collatzShaderSource
    })
  }

  let currentFractal = getCurrentFractal(store.getState())
  function startRunLoop (initialize) {
    const state = store.getState()

    if (currentFractal !== getCurrentFractal(state) || initialize) {
      currentFractal = getCurrentFractal(state)
      const currentProgram = programs[currentFractal]

      context.linkProgram(currentProgram)
      context.useProgram(currentProgram)

      /* eslint-disable no-multi-spaces, indent */
      const vertices = new Float32Array([
        -1.0,  1.0, // top left
        -1.0, -1.0, // bottom left
         1.0,  1.0, // top right
         1.0, -1.0  // bottom right
      ])
      /* eslint-enable no-multi-spaces, indent */

      prepareGeometry({ context, program: currentProgram, vertices })

      requestAnimationFrame(drawFrame.bind(null, {
        canvas,
        context,
        fractal: currentFractal,
        program: currentProgram,
        store
      }))
    }
  }

  store.subscribe(startRunLoop)

  startRunLoop(true)
}
