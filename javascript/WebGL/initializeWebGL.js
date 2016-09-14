import { getCurrentFractal } from 'reducers'
import configureProgram from 'webgl-utilities/configureProgram'
import drawFrame from 'webgl/drawFrame'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import juliaShaderSource from 'shaders/julia.glsl'
import collatzShaderSource from 'shaders/collatz.glsl'

const { requestAnimationFrame } = window

export default ({ store }) => {
  const canvas = document.getElementById('main')
  const context = canvas.getContext('webgl')

  const programs = {
    'julia set': configureProgram({
      context,
      vertexShaderSource: vertexShaderSource,
      fragmentShaderSource: juliaShaderSource
    }),
    'mandelbrot set': configureProgram({
      context,
      vertexShaderSource: vertexShaderSource,
      fragmentShaderSource: juliaShaderSource
    }),
    'modified collatz': configureProgram({
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

      context.useProgram(currentProgram)
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
