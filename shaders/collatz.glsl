precision highp float;

uniform vec2 RESOLUTION;
uniform vec2 CENTER;
uniform vec2 RANGE;

uniform float DEPTH;
uniform float CONSTANT_1;
uniform float ANGLE1;
uniform float ANGLE2;

const int MAX_ITERATIONS = 255;
const float pi = 3.1415926;

float ASPECT_RATIO = RESOLUTION.x / RESOLUTION.y;

vec2 cmult(vec2 a, vec2 b) {
  return vec2(
    a.x * b.x - a.y * b.y,
    a.x * b.y + a.y * b.x
  );
}

vec2 cexp(vec2 vector) {
  float magnitude = exp(vector.x);
  float argument  = vector.y;

  float real = magnitude * cos(argument);
  float imag = magnitude * sin(argument);

  return vec2(real, imag);
}

vec2 rotate(vec2 vector, float theta) {
  float magnitude = length(vector);
  float argument  = atan(vector.y, vector.x);

  float real = magnitude * cos(argument + theta);
  float imag = magnitude * sin(argument + theta);

  return vec2(real, imag);
}

vec2 ccos(vec2 c) {
  vec2 ci = cmult(c, vec2(0, 1));
  vec2 c1 = rotate(ci, ANGLE1);
  vec2 c2 = -rotate(ci, ANGLE2);

  return (cexp(c1) + cexp(c2)) / 2.0;
}

float collatz(vec2 position) {
  vec2 z = position;

  for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    z = (vec2(1.0, 0.0) + CONSTANT_1 * z - cmult(vec2(1.0,0.0) + 2.0 * z, ccos(pi * z))) / 4.0;

    if (length(z) > DEPTH) {
      return float(iteration);
    }
  }

  return 0.0;
}

vec2 fragCoordToXY(vec4 fragCoord) {
  vec2 relativePosition = fragCoord.xy / RESOLUTION;

  vec2 cartesianPosition = CENTER + (relativePosition - 0.5) * RANGE.y;
  cartesianPosition.x *= ASPECT_RATIO;

  return cartesianPosition;
}

float quickColorize(float value, float rate) {
  return pow(sin(value / rate), 2.0);
}

void main() {
  vec2 coordinate = fragCoordToXY(gl_FragCoord);

  float color = collatz(coordinate);

  gl_FragColor =  vec4(quickColorize(color, 1.0), quickColorize(color, 3.0), quickColorize(color, 5.0), 1.0);
}
