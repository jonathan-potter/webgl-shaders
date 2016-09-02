export default function ({ program, name, context }) {
  const attributeLocation = context.getAttribLocation(program, name)

  if (attributeLocation === -1) {
    throw new Error('Can not find attribute ' + name + '.')
  }

  return attributeLocation
}
