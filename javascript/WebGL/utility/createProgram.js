export default function ({ context, vertexShaders, fragmentShaders }) {
  const program = context.createProgram()

  vertexShaders.forEach(vertexShader => context.attachShader(program, vertexShader))
  fragmentShaders.forEach(fragmentShader => context.attachShader(program, fragmentShader))

  context.linkProgram(program)
  context.useProgram(program)

  return program
}
