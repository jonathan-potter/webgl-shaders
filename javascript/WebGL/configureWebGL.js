/* utility */
import compileShader from 'webgl-utilities/compileShader'
import prepareGeometry from 'webgl-utilities/prepareGeometry'
import createProgram from 'webgl-utilities/createProgram'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import fragmentShaderSource from 'shaders/julia.glsl'

const { Float32Array } = window

export default function ({ context }) {
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

  /* eslint-disable no-multi-spaces, indent */
  const vertices = new Float32Array([
    -1.0,  1.0, // top left
    -1.0, -1.0, // bottom left
     1.0,  1.0, // top right
     1.0, -1.0  // bottom right
  ])
  /* eslint-enable no-multi-spaces, indent */

  prepareGeometry({context, program, vertices})

  return { program }
}
