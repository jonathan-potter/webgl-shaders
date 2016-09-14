/* utility */
import compileShader from 'webgl-utilities/compileShader'
import createProgram from 'webgl-utilities/createProgram'

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

  return program
}
