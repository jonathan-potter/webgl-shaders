import getUniformLocation from 'utility/getUniformLocation'

export default (name, value, context, program) => {
  let dataPointer = getUniformLocation({
    program,
    name: name.toUpperCase(),
    context
  })

  switch (value.length) {
    case 2:
      return setUniformVec2(dataPointer, value, context)
    default:
      return setUniformFloat(dataPointer, value, context)
  }
}

function setUniformFloat (dataPointer, value, context) {
  context.uniform1fv(dataPointer, new Float32Array([value]))
}

function setUniformVec2 (dataPointer, values, context) {
  context.uniform2fv(dataPointer, new Float32Array(values))
}
