export default function ({ context, vertexShader, fragmentShader }) {
  const program = context.createProgram()

  context.attachShader(program, vertexShader)
  context.attachShader(program, fragmentShader)

  return program
}
