import { getCurrentShader } from 'reducers'
import createFrameRenderer from 'webgl/createFrameRenderer'
import programForShader from 'webgl-utilities/programForShader'

const { requestAnimationFrame } = window

export default ({ store }) => {
  const canvas = document.getElementById('main')

  const startRunLoop = createRunLoop({
    canvas,
    context: canvas.getContext('webgl'),
    shader: getCurrentShader(store.getState()),
    store
  })

  store.subscribe(startRunLoop)

  startRunLoop()
}

const createRunLoop = ({ canvas, context, shader, store, firstRun = true }) => () => {
  const state = store.getState()
  const currentShader = getCurrentShader(state)

  if (shader !== currentShader || firstRun) {
    shader = currentShader
    firstRun = false

    const program = programForShader({ context, shader })

    context.useProgram(program)
    requestAnimationFrame(createFrameRenderer({ canvas, context, shader, program, store }))
  }
}
