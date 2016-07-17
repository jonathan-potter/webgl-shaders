precision highp float;

const int MAX_ITERATIONS = 512;

vec2 iResolution = vec2(500.0, 500.0);

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
  float aspectRatio = iResolution.x / 500.0;

  vec2 cartesianPosition = (relativePosition - 0.5) * 4.0;
  cartesianPosition.x *= aspectRatio;

  return cartesianPosition;
}

void main() {
  vec2 coordinate = fragCoordToXY(gl_FragCoord);

  int fractalValue = julia(coordinate, vec2(-0.795, 0.2321));

  float color = 5.0 * float(fractalValue) / float(MAX_ITERATIONS);

  gl_FragColor = vec4(color, color, color, 1.0);
}
