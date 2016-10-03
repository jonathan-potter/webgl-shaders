import getAttribLocation from 'webgl-utilities/getAttribLocation'

export default function ({ context, program, vertices }) {
  const vertexDataBuffer = context.createBuffer()
  context.bindBuffer(context.ARRAY_BUFFER, vertexDataBuffer)
  context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW)

  /**
   * Attribute setup
   */

  // To make the geometry information available in the shader as attributes, we
  // need to tell WebGL what the layout of our data in the vertex buffer is.
  const positionHandle = getAttribLocation({program, name: 'position', context})
  context.enableVertexAttribArray(positionHandle)
  context.vertexAttribPointer(
    positionHandle,
    2, // position is a vec2
    context.FLOAT, // each component is a float
    context.FALSE, // don't normalize values
    2 * 4, // two 4 byte float components per vertex
    0 // offset into each span of vertex data
  )
}
