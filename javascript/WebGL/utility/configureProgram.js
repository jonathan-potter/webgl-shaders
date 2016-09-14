/* utility */
import compileShader from 'webgl-utilities/compileShader'
import createProgram from 'webgl-utilities/createProgram'
import prepareGeometry from 'webgl-utilities/prepareGeometry'

const { Float32Array } = window

export default function ({ context, fragmentShaderSource, vertexShaderSource }) {
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
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    context
  })

  context.linkProgram(program)

  /* eslint-disable no-multi-spaces, indent */
  const vertices = new Float32Array([
    -1.0,  1.0, // top left
    -1.0, -1.0, // bottom left
     1.0,  1.0, // top right
     1.0, -1.0  // bottom right
  ])
  /* eslint-enable no-multi-spaces, indent */

  prepareGeometry({ context, program: program, vertices })

  return program
}
