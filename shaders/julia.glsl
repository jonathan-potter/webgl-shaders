precision highp float;

uniform vec2 RESOLUTION;
uniform vec2 CENTER;
uniform vec2 RANGE;
uniform vec2 JULIA_C;
uniform vec2 MSAA_COORDINATES[16];

uniform float FRACTAL;
uniform float BRIGHTNESS;
uniform float COLORSET;
uniform float EXPONENT;
uniform float SUPERSAMPLES;

const int MAX_ITERATIONS = 255;
const float pi = 3.1415926;

vec2 PIXEL_SIZE = RANGE / RESOLUTION;
float ASPECT_RATIO = RESOLUTION.x / RESOLUTION.y;

float amd_atan (float y, float x) {
  /* this was written to make AMD cards happy */

  float theta;
  if (x == 0.0) {
    theta = pi / 2.0 * sign(y);
  } else {
    theta = atan(y, x);
  }

  return theta;
}

vec2 lazy_cpow(vec2 z, float exponent) {
  float magnitude = pow(length(z), exponent);
  float argument = amd_atan(z.y, z.x) * exponent;

  return vec2(
    magnitude * cos(argument),
    magnitude * sin(argument)
  );
}

vec2 fractal(vec2 c, vec2 z) {
  for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++) {

    // z <- z^2 + c
    z = lazy_cpow(z, EXPONENT) + c;

    float magnitude = length(z);
    if (magnitude > 2.0) {
      return vec2(float(iteration), magnitude);
    }
  }

  return vec2(0.0, 0.0);
}

vec4 colorize(vec2 fractalValue) {
  float N = float(fractalValue.x / 4.0);
  float value = float(fractalValue.y / 4.0);

  float mu = (N - log(log(sqrt(value))) / log(2.0));

  mu = sin(mu / 20.0) * sin(mu / 20.0);

  return vec4(mu, mu, mu, 0.0);
}

vec2 mandelbrot(vec2 coordinate) {
  return fractal(coordinate, vec2(0.0, 0.0));
}

vec2 julia(vec2 coordinate, vec2 offset) {
  return fractal(offset, coordinate);
}

vec2 fragCoordToXY(vec4 fragCoord) {
  vec2 relativePosition = fragCoord.xy / RESOLUTION;

  vec2 cartesianPosition = CENTER + (relativePosition - 0.5) * RANGE.y;
  cartesianPosition.x *= ASPECT_RATIO;

  return cartesianPosition;
}

vec2 msaa(vec2 coordinate) {
  vec2 fractalValue = vec2(0.0, 0.0);

  for (int index = 0; index < 16; index++) {
    vec2 msaaCoordinate = coordinate + PIXEL_SIZE * MSAA_COORDINATES[index];

    if (FRACTAL == 0.0) {
      fractalValue += julia(msaaCoordinate, JULIA_C);
    } else {
      fractalValue += mandelbrot(msaaCoordinate);
    }

    if (SUPERSAMPLES <= float(index + 1)) {
      return fractalValue / SUPERSAMPLES;
    }
  }

  return fractalValue / 16.0;
}

void main() {
  vec2 coordinate = fragCoordToXY(gl_FragCoord);

  vec2 fractalValue = msaa(coordinate);

  if (COLORSET == 0.0) {
    float color = BRIGHTNESS * fractalValue.x / float(MAX_ITERATIONS);
    gl_FragColor = vec4(color, color, color, 0.0);
  } else if (COLORSET == 1.0) {
    gl_FragColor = BRIGHTNESS * colorize(fractalValue);
  }
}
