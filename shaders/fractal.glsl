precision highp float;

uniform vec2 CENTER;
uniform vec2 RANGE;
uniform vec2 RESOLUTION;
uniform vec2 JULIA_C;

uniform float FRACTAL;
uniform float BRIGHTNESS;
uniform float COLORSET;
uniform float EXPONENT;
uniform float SUPERSAMPLES;

const int MAX_ITERATIONS = 255;
const float pi = 3.1415926;

vec2 PIXEL_SIZE = RANGE / RESOLUTION;
vec2 msaaCoords[16];

struct complex {
  float real;
  float imaginary;
};

complex complexExp(complex z, float exponent) {
  float magnitude = sqrt(z.real * z.real + z.imaginary * z.imaginary);

  float theta;
  if (z.real == 0.0) {
    theta = pi / 2.0 * sign(z.imaginary);
  } else {
    theta = atan(z.imaginary, z.real);
  }

  float newMagnitude = pow(magnitude, exponent);
  float newTheta = theta * exponent;

  complex newZ;
  newZ.real      = newMagnitude * cos(newTheta);
  newZ.imaginary = newMagnitude * sin(newTheta);

  return newZ;
}

vec2 fractal(complex c, complex z) {
  for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++) {

    // z <- z^2 + c
    complex z2 = complexExp(z, EXPONENT);

    z.real = z2.real + c.real;
    z.imaginary = z2.imaginary + c.imaginary;

    if (z.real * z.real + z.imaginary * z.imaginary > 4.0) {
      int N = iteration;
      float value = (z.real * z.real + z.imaginary * z.imaginary);

      return vec2(float(N), value);
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
  complex c = complex(coordinate.x, coordinate.y);
  complex z = complex(0.0, 0.0);

  return fractal(c, z);
}

vec2 julia(vec2 coordinate, vec2 offset) {
  complex c = complex(offset.x, offset.y);
  complex z = complex(coordinate.x, coordinate.y);

  return fractal(c, z);
}

vec2 fragCoordToXY(vec4 fragCoord) {
  vec2 relativePosition = fragCoord.xy / RESOLUTION;
  float aspectRatio = RESOLUTION.x / RESOLUTION.y;

  vec2 cartesianPosition = (relativePosition - 0.5) * RANGE.x;
  cartesianPosition.x += CENTER.x;
  cartesianPosition.y += CENTER.y;
  cartesianPosition.x *= aspectRatio;

  return cartesianPosition;
}

void initializeMSAA() {
  if (SUPERSAMPLES == 1.0) {
    msaaCoords[0] = vec2(0.5, 0.5);
  } else if (SUPERSAMPLES == 4.0) {
    msaaCoords[0] = vec2(0.25, 0.25);
    msaaCoords[1] = vec2(0.25, 0.75);
    msaaCoords[2] = vec2(0.75, 0.25);
    msaaCoords[3] = vec2(0.75, 0.75);
  } else {
    msaaCoords[0]  = vec2(0.125 + 0.0 * 0.25 + -0.0375, 0.125 + 0.0 * 0.25 + -0.0375);
    msaaCoords[1]  = vec2(0.125 + 0.0 * 0.25 + -0.0125, 0.125 + 1.0 * 0.25 + -0.0375);
    msaaCoords[2]  = vec2(0.125 + 0.0 * 0.25 +  0.0125, 0.125 + 2.0 * 0.25 + -0.0375);
    msaaCoords[3]  = vec2(0.125 + 0.0 * 0.25 +  0.0375, 0.125 + 3.0 * 0.25 + -0.0375);
    msaaCoords[4]  = vec2(0.125 + 1.0 * 0.25 + -0.0375, 0.125 + 0.0 * 0.25 + -0.0125);
    msaaCoords[5]  = vec2(0.125 + 1.0 * 0.25 + -0.0125, 0.125 + 1.0 * 0.25 + -0.0125);
    msaaCoords[6]  = vec2(0.125 + 1.0 * 0.25 +  0.0125, 0.125 + 2.0 * 0.25 + -0.0125);
    msaaCoords[7]  = vec2(0.125 + 1.0 * 0.25 +  0.0375, 0.125 + 3.0 * 0.25 + -0.0125);
    msaaCoords[8]  = vec2(0.125 + 2.0 * 0.25 + -0.0375, 0.125 + 0.0 * 0.25 +  0.0125);
    msaaCoords[9]  = vec2(0.125 + 2.0 * 0.25 + -0.0125, 0.125 + 1.0 * 0.25 +  0.0125);
    msaaCoords[10] = vec2(0.125 + 2.0 * 0.25 +  0.0125, 0.125 + 2.0 * 0.25 +  0.0125);
    msaaCoords[11] = vec2(0.125 + 2.0 * 0.25 +  0.0375, 0.125 + 3.0 * 0.25 +  0.0125);
    msaaCoords[12] = vec2(0.125 + 3.0 * 0.25 + -0.0375, 0.125 + 0.0 * 0.25 +  0.0375);
    msaaCoords[13] = vec2(0.125 + 3.0 * 0.25 + -0.0125, 0.125 + 1.0 * 0.25 +  0.0375);
    msaaCoords[14] = vec2(0.125 + 3.0 * 0.25 +  0.0125, 0.125 + 2.0 * 0.25 +  0.0375);
    msaaCoords[15] = vec2(0.125 + 3.0 * 0.25 +  0.0375, 0.125 + 3.0 * 0.25 +  0.0375);
  }
}

vec2 msaa(vec2 coordinate) {
  vec2 fractalValue = vec2(0.0, 0.0);

  initializeMSAA();

  for (int index = 0; index < 16; index++) {
    vec2 msaaCoordinate = coordinate + PIXEL_SIZE * msaaCoords[index];

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
