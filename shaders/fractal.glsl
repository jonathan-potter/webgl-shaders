precision highp float;

// WIDTH, HEIGHT, C_REAL, C_IMAGINARY, X_MIN, X_MAX, Y_MIN, Y_MAX
uniform float data[9];

float WIDTH      = data[0];
float HEIGHT     = data[1];

float C_REAL     = data[2];
float C_IMAG     = data[3];

float BRIGHTNESS = data[4];

float X_MIN      = data[5];
float X_MAX      = data[6];
float Y_MIN      = data[7];
float Y_MAX      = data[8];

const int MAX_ITERATIONS = 255;

float X_RANGE = X_MAX - X_MIN;
float Y_RANGE = Y_MAX - Y_MIN;

vec2 iResolution = vec2(WIDTH, HEIGHT);
vec2 iPixelSize   = vec2(X_RANGE / WIDTH, Y_RANGE / HEIGHT);

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

  float N = float(fractalValue.x);
  float value = float(fractalValue.y);

  // mu = N + 1 - log (log  |Z(N)|) / log 2
  float mu = (N - log(log(sqrt(value))) / log(2.0));
  // float remainder = mod(mu, 1.0);

  // float baseValue = mu - remainder;

  mu = sin(mu / 20.0) * sin(mu / 20.0);

  float red = mu;
  float blue = mu;
  float green = mu;
  // if (0.3333 < remainder) {
  //   red += 1.0;
  // } else if (0.6666 < remainder) {
  //   red += 1.0;
  //   blue += 1.0;
  // }

  // red /= float(MAX_ITERATIONS);
  // blue /= float(MAX_ITERATIONS);
  // green /= float(MAX_ITERATIONS);

  // return vec4(red, blue, green, 0.0);
  return vec4(red, blue, green, 0.0);
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

vec2 msaaFractal(vec2 coordinate) {
  vec2 msaaCoordinate, fractalValue;
  msaaCoordinate  = vec2(coordinate.x + iPixelSize.x * 0.25, coordinate.y + iPixelSize.y * 0.25);
  fractalValue    = julia(coordinate, vec2(C_REAL, C_IMAG));
  msaaCoordinate  = vec2(coordinate.x + iPixelSize.x * 0.75, msaaCoordinate.y + iPixelSize.y * 0.25);
  fractalValue   += julia(msaaCoordinate, vec2(C_REAL, C_IMAG));
  msaaCoordinate  = vec2(coordinate.x + iPixelSize.x * 0.25, msaaCoordinate.y + iPixelSize.y * 0.75);
  fractalValue   += julia(msaaCoordinate, vec2(C_REAL, C_IMAG));
  msaaCoordinate  = vec2(coordinate.x + iPixelSize.x * 0.75, msaaCoordinate.y + iPixelSize.y / 0.75);
  fractalValue   += julia(msaaCoordinate, vec2(C_REAL, C_IMAG));

  return fractalValue / 4.0;
}

void main() {
  vec2 coordinate = fragCoordToXY(gl_FragCoord);

  vec2 fractalValue = msaaFractal(coordinate);

  float color = BRIGHTNESS * float(fractalValue) / float(MAX_ITERATIONS);
  gl_FragColor = vec4(color, color, color, 0.0);

  // vec4 color = colorize(fractalValue);
  // gl_FragColor = vec4(color[0], color[1], color[2], 0.0);
}
