precision highp float;

const float CHECK_SIZE = 50.0;

void main(){
  float x_thing = step(CHECK_SIZE / 2.0, mod(gl_FragCoord.x, CHECK_SIZE));
  float y_thing = step(CHECK_SIZE / 2.0, mod(gl_FragCoord.y, CHECK_SIZE));

  bool condition1 = x_thing > 0.5 && y_thing < 0.5;
  bool condition2 = x_thing < 0.5 && y_thing > 0.5;

  float color;
  if (condition1 || condition2) {
    color = 1.0;
  } else {
    color = 0.0;
  }

  gl_FragColor = vec4(color, color, color, 1.0);
}
