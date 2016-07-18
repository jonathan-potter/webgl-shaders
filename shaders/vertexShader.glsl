attribute vec2 position;

void main() {
  // position specifies only x and y.
  // We set z to be 0.0, and w to be 1.0
  gl_Position = vec4(position, 0.0, 1.0);
}
