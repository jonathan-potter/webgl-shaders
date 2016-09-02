import configureWebGL from 'webgl/configureWebGL'
import drawFrame from 'webgl/drawFrame'

const { requestAnimationFrame } = window

export default ({ store }) => {
  const canvas = document.getElementById('main')
  const context = canvas.getContext('webgl')

  const { program } = configureWebGL({ context })

  requestAnimationFrame(drawFrame.bind(null, { canvas, context, program, store }))
}
