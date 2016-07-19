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

const int MAX_ITERATIONS = 1024;

vec2 iResolution = vec2(WIDTH, HEIGHT);

struct complex {
  float real;
  float imaginary;
};

int fractal(complex c, complex z) {
  for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++) {

    // z <- z^2 + c
    float real = z.real * z.real - z.imaginary * z.imaginary + c.real;
    float imaginary = 2.0 * z.real * z.imaginary + c.imaginary;

    z.real = real;
    z.imaginary = imaginary;

    if (z.real * z.real + z.imaginary * z.imaginary > 4.0) {
      return iteration;
    }
  }

  return 0;
}

int mandelbrot(vec2 coordinate) {
  complex c = complex(coordinate.x, coordinate.y);
  complex z = complex(0.0, 0.0);

  return fractal(c, z);
}

int julia(vec2 coordinate, vec2 offset) {
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

void main() {
  vec2 coordinate = fragCoordToXY(gl_FragCoord);

  // int fractalValue = mandelbrot(coordinate);
  int fractalValue = julia(coordinate, vec2(C_REAL, C_IMAG));

  float color = BRIGHTNESS * float(fractalValue) / float(MAX_ITERATIONS);

  gl_FragColor = vec4(color, color, color, 1.0);
}
