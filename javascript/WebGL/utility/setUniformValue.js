import getUniformLocation from 'webgl-utilities/getUniformLocation'

export default (name, value, context, program) => {
  let dataPointer = getUniformLocation({
    program,
    name: name.toUpperCase(),
    context
  })

  if (value instanceof Array) {
    return setUniformVec2(dataPointer, value, context)
  } else {
    return setUniformFloat(dataPointer, value, context)
  }
}

function setUniformFloat (dataPointer, value, context) {
  context.uniform1fv(dataPointer, new Float32Array([value]))
}

function setUniformVec2 (dataPointer, values, context) {
  context.uniform2fv(dataPointer, new Float32Array(values))
}
