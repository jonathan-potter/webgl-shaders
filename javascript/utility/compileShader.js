export default function({shaderSource, shaderType, context}) {
  const shader = context.createShader(shaderType)

  context.shaderSource(shader, shaderSource)
  context.compileShader(shader)

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    throw 'Shader compile failed with: ' + context.getShaderInfoLog(shader)
  }

  return shader
}
