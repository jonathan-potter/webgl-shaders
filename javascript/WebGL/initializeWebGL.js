import { getCurrentFractal } from 'reducers'
import drawFrame from 'webgl/drawFrame'
import programForFractal from 'webgl-utilities/programForFractal'

const { requestAnimationFrame } = window

export default ({ store }) => {
  const canvas = document.getElementById('main')

  const startRunLoop = createRunLoop({
    canvas,
    context: canvas.getContext('webgl'),
    fractal: getCurrentFractal(store.getState()),
    store
  })

  store.subscribe(startRunLoop)

  startRunLoop()
}

const createRunLoop = ({ canvas, context, fractal, store, firstRun = true }) => () => {
  const state = store.getState()
  const currentFractal = getCurrentFractal(state)

  if (fractal !== currentFractal || firstRun) {
    fractal = currentFractal
    firstRun = false

    const program = programForFractal({ context, fractal })

    context.useProgram(program)
    requestAnimationFrame(drawFrame({ canvas, context, fractal, program, store }))
  }
}
