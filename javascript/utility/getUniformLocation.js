export default function(program, name, context) {
  const uniformLocation = context.getUniformLocation(program, name)

  if (uniformLocation === -1) {
    throw 'Can not find uniform ' + name + '.'
  }

  return uniformLocation
}
