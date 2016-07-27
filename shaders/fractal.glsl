precision highp float;

// WIDTH, HEIGHT, C_REAL, C_IMAGINARY, X_MIN, X_MAX, Y_MIN, Y_MAX
uniform float data[10];

float WIDTH      = data[0];
float HEIGHT     = data[1];

float C_REAL     = data[2];
float C_IMAG     = data[3];

float BRIGHTNESS = data[4];

float X_MIN      = data[5];
float X_MAX      = data[6];
float Y_MIN      = data[7];
float Y_MAX      = data[8];

float SUPERSAMPLES = data[9];

const int MAX_ITERATIONS = 255;

float X_RANGE = X_MAX - X_MIN;
float Y_RANGE = Y_MAX - Y_MIN;

vec2 iResolution = vec2(WIDTH, HEIGHT);
vec2 iPixelSize  = vec2(X_RANGE / WIDTH, Y_RANGE / HEIGHT);

vec2 msaa4xCoords[4];
vec2 altMsaa4xCoords[4];
vec2 msaa16xCoords[16];

struct complex {
  float real;
  float imaginary;
};

vec2 fractal(complex c, complex z) {
  for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++) {

    // z <- z^2 + c
    float real = z.real * z.real - z.imaginary * z.imaginary + c.real;
    float imaginary = 2.0 * z.real * z.imaginary + c.imaginary;

    z.real = real;
    z.imaginary = imaginary;

    if (z.real * z.real + z.imaginary * z.imaginary > 4.0) {
      int N = iteration;
      float value = (z.real * z.real + z.imaginary * z.imaginary);

      return vec2(float(N), value);
    }
  }

  return vec2(0.0, 0.0);
}

vec4 colorize(vec2 fractalValue) {
  /* save for later */

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
  vec2 relativePosition = fragCoord.xy / iResolution.xy;
  float aspectRatio = iResolution.x / HEIGHT;

  vec2 center = vec2((X_MAX + X_MIN) / 2.0, (Y_MAX + Y_MIN) / 2.0);

  vec2 cartesianPosition = (relativePosition - 0.5) * (X_MAX - X_MIN);
  cartesianPosition.x += center.x;
  cartesianPosition.y -= center.y;
  cartesianPosition.x *= aspectRatio;

  return cartesianPosition;
}

void initializeMSAA() {
  // I really wish I had bitwise operators...
  vec2 start = vec2(0.125, 0.125);
  altMsaa4xCoords[0] = start + vec2(0.5 * 0.0 + 0.25 * 0.0, 0.5 * 0.0 + 0.25 * 0.0);
  altMsaa4xCoords[1] = start + vec2(0.5 * 0.0 + 0.25 * 1.0, 0.5 * 1.0 + 0.25 * 0.0);
  altMsaa4xCoords[2] = start + vec2(0.5 * 1.0 + 0.25 * 0.0, 0.5 * 0.0 + 0.25 * 1.0);
  altMsaa4xCoords[3] = start + vec2(0.5 * 1.0 + 0.25 * 1.0, 0.5 * 1.0 + 0.25 * 1.0);

  msaa4xCoords[0] = vec2(0.25, 0.25);
  msaa4xCoords[1] = vec2(0.25, 0.75);
  msaa4xCoords[2] = vec2(0.75, 0.25);
  msaa4xCoords[3] = vec2(0.75, 0.75);

  msaa16xCoords[0]  = vec2(0.125 + 0.0 * 0.25 + -0.0375, 0.125 + 0.0 * 0.25 + -0.0375);
  msaa16xCoords[1]  = vec2(0.125 + 0.0 * 0.25 + -0.0125, 0.125 + 1.0 * 0.25 + -0.0375);
  msaa16xCoords[2]  = vec2(0.125 + 0.0 * 0.25 +  0.0125, 0.125 + 2.0 * 0.25 + -0.0375);
  msaa16xCoords[3]  = vec2(0.125 + 0.0 * 0.25 +  0.0375, 0.125 + 3.0 * 0.25 + -0.0375);
  msaa16xCoords[4]  = vec2(0.125 + 1.0 * 0.25 + -0.0375, 0.125 + 0.0 * 0.25 + -0.0125);
  msaa16xCoords[5]  = vec2(0.125 + 1.0 * 0.25 + -0.0125, 0.125 + 1.0 * 0.25 + -0.0125);
  msaa16xCoords[6]  = vec2(0.125 + 1.0 * 0.25 +  0.0125, 0.125 + 2.0 * 0.25 + -0.0125);
  msaa16xCoords[7]  = vec2(0.125 + 1.0 * 0.25 +  0.0375, 0.125 + 3.0 * 0.25 + -0.0125);
  msaa16xCoords[8]  = vec2(0.125 + 2.0 * 0.25 + -0.0375, 0.125 + 0.0 * 0.25 +  0.0125);
  msaa16xCoords[9]  = vec2(0.125 + 2.0 * 0.25 + -0.0125, 0.125 + 1.0 * 0.25 +  0.0125);
  msaa16xCoords[10] = vec2(0.125 + 2.0 * 0.25 +  0.0125, 0.125 + 2.0 * 0.25 +  0.0125);
  msaa16xCoords[11] = vec2(0.125 + 2.0 * 0.25 +  0.0375, 0.125 + 3.0 * 0.25 +  0.0125);
  msaa16xCoords[12] = vec2(0.125 + 3.0 * 0.25 + -0.0375, 0.125 + 0.0 * 0.25 +  0.0375);
  msaa16xCoords[13] = vec2(0.125 + 3.0 * 0.25 + -0.0125, 0.125 + 1.0 * 0.25 +  0.0375);
  msaa16xCoords[14] = vec2(0.125 + 3.0 * 0.25 +  0.0125, 0.125 + 2.0 * 0.25 +  0.0375);
  msaa16xCoords[15] = vec2(0.125 + 3.0 * 0.25 +  0.0375, 0.125 + 3.0 * 0.25 +  0.0375);
}

vec2 msaa1x(vec2 coordinate) {
  return julia(coordinate, vec2(C_REAL, C_IMAG));
}

vec2 msaa4x(vec2 coordinate) {
  vec2 fractalValue = vec2(0.0, 0.0);

  for (int index = 0; index < 4; index++) {
    vec2 msaaCoordinate = coordinate + iPixelSize * msaa4xCoords[index];

    fractalValue += julia(msaaCoordinate, vec2(C_REAL, C_IMAG));
  }

  return fractalValue / 4.0;
}

vec2 altMsaa4x(vec2 coordinate) {
  vec2 fractalValue = vec2(0.0, 0.0);

  for (int index = 0; index < 4; index++) {
    vec2 msaaCoordinate = coordinate + iPixelSize * altMsaa4xCoords[index];

    fractalValue += julia(msaaCoordinate, vec2(C_REAL, C_IMAG));
  }

  return fractalValue / 4.0;
}

vec2 msaa16x(vec2 coordinate) {
  vec2 fractalValue = vec2(0.0, 0.0);

  for (int index = 0; index < 16; index++) {
    vec2 msaaCoordinate = coordinate + iPixelSize * msaa16xCoords[index];

    fractalValue += julia(msaaCoordinate, vec2(C_REAL, C_IMAG));
  }


  return fractalValue / 16.0;
}

void main() {
  initializeMSAA();

  vec2 coordinate = fragCoordToXY(gl_FragCoord);

  vec2 fractalValue;
  if (SUPERSAMPLES == 16.0) {
    fractalValue = msaa16x(coordinate);
  } else if (SUPERSAMPLES == 4.0) {
    fractalValue = msaa4x(coordinate);
  } else {
    fractalValue = msaa1x(coordinate);
  }

  float color = BRIGHTNESS * fractalValue.x / float(MAX_ITERATIONS);
  gl_FragColor = vec4(color, color, color, 0.0);

  // vec4 color = colorize(fractalValue);
  // gl_FragColor = vec4(color[0], color[1], color[2], 0.0);
}
