precision highp float;

uniform vec2 RESOLUTION;

uniform float TIME;
uniform float COLORSET;
uniform float FOV;
uniform float WOBBLE;

const float pi = 3.1415926;
float CHECK_SIZE = pi / 32.0;
float ASPECT_RATIO = RESOLUTION.x / RESOLUTION.y;

const vec3 LOOK_AT = vec3(0.0, 0.0, 0.0);
const vec3 UP      = vec3(0.0, 0.0, 1.0);

struct Ray {
  vec3 origin;
  vec3 direction;
};

mat3 rotateX(float angle) {
  float sin = sin(angle);
  float cos = cos(angle);

  return mat3(
    1.0,  0.0,  0.0,
    0.0,  cos, -sin,
    0.0,  sin,  cos
  );
}

mat3 rotateY(float angle) {
  float sin = sin(angle);
  float cos = cos(angle);

  return mat3(
    cos,  0.0, -sin,
    0.0,  1.0,  0.0,
    sin,  0.0,  cos
  );
}

float sineSquared(float number) {
  return pow(sin(number), 2.0);
}

float cosineSquared(float number) {
  return pow(cos(number), 2.0);
}

vec3 checkerboard(vec3 direction) {
  float theta = atan(direction.y, direction.x);
  float phi = acos(direction.z);

  float x_thing = step(CHECK_SIZE / 2.0, mod(theta, CHECK_SIZE));
  float y_thing = step(CHECK_SIZE / 2.0, mod(phi, CHECK_SIZE));

  bool condition1 = x_thing > 0.5 && y_thing < 0.5;
  bool condition2 = x_thing < 0.5 && y_thing > 0.5;

  vec3 color;
  if (condition1 || condition2) {
    if (COLORSET == 0.0) {
      color = vec3(1.0, 1.0, 1.0);
    } else if (COLORSET == 1.0) {
      color = vec3(sineSquared(theta * 16.0), cosineSquared(theta * 13.0), cosineSquared(phi * 7.0));
    }
  } else {
    color = vec3(0.0, 0.0, 0.0);
  }

  return color;
}

vec3 rayPlaneCollisionPoint(Ray ray, vec3 p0, vec3 pn) {
  // p0: point on plane, pn: plane normal

  vec3 l0 = ray.origin;
  vec3 l = ray.direction;

  /* https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection */
  float d = dot(p0 - l0, pn) / dot(l, pn);
  return d * l + l0;
}

vec4 boxCollisionAndNormal(Ray ray) {
  vec2 xy = vec2(1.0, 0.0);

  // w is negative flag for later
  vec4 colisionPoints[6];
  colisionPoints[0] = vec4(rayPlaneCollisionPoint(ray,  xy.xyy,  xy.xyy), 0.0);
  colisionPoints[1] = vec4(rayPlaneCollisionPoint(ray, -xy.xyy, -xy.xyy), 1.0);
  colisionPoints[2] = vec4(rayPlaneCollisionPoint(ray,  xy.yxy,  xy.yxy), 0.0);
  colisionPoints[3] = vec4(rayPlaneCollisionPoint(ray, -xy.yxy, -xy.yxy), 1.0);
  colisionPoints[4] = vec4(rayPlaneCollisionPoint(ray,  xy.yyx,  xy.yyx), 0.0);
  colisionPoints[5] = vec4(rayPlaneCollisionPoint(ray, -xy.yyx, -xy.yyx), 1.0);

  float minDistance = 100000.0;
  bool collides = false;

  vec4 closestPoint = vec4(0.0);
  for (int i = 0; i < 6; i++) {
    vec4 cp = colisionPoints[i];

    if (abs(cp.x) < 1.01 && abs(cp.y) < 1.01 && abs(cp.z) < 1.01) {
      float dist = length(ray.origin - cp.xyz);

      collides = true;
      if (dist < minDistance) {
        minDistance = dist;
        closestPoint = cp;
      }
    }
  }

  vec4 cp = closestPoint;
  float x = abs(closestPoint.x);
  float y = abs(closestPoint.y);
  float z = abs(closestPoint.z);
  bool negative = closestPoint.w == 1.0;

  vec3 normal = vec3(0.0);
  if (collides) {
    /* normalized values just didn't look right here :( */
    if (x > y && x > z) {
      normal = vec3(1.1, 0.0, 0.0);
    } else if (y > x && y > z) {
      normal = vec3(0.0, 1.1, 0.0);
    } else {
      normal = vec3(0.0, 0.0, 1.1);
    }

    if (negative) {
      normal = -normal;
    }
  }

  return vec4(normal, float(collides));
}

vec3 render(Ray ray) {
  vec4 collisionAndNormal = boxCollisionAndNormal(ray);
  bool collides = collisionAndNormal.w == 1.0;

  if (collides) {
    vec3 normalVector = collisionAndNormal.xyz;

    vec3 reflectionVector = reflect(ray.direction, normalVector);
    vec3 reflectionColor = checkerboard(reflectionVector);

    float rf = (1.0 - abs(dot(ray.direction, normalVector))) * 0.25;

    return reflectionColor * rf;
  }

  return checkerboard(ray.direction) * 1.0;
}

Ray createRay(vec3 origin, vec3 lookVector, vec3 up, vec2 uv, float fov) {
  up = normalize(up - lookVector * dot(lookVector, up));
  vec3 right = cross(lookVector, up);

  uv = 2.0 * uv - vec2(1.0, 1.0);

  vec3 direction = normalize(
    lookVector +
    tan(fov / 2.0) * right * uv.x +
    tan(fov / 2.0) / ASPECT_RATIO * up * uv.y
  );

  return Ray(origin, direction);
}

float vignette(vec2 uv) {
  float x = sin(uv.x * pi);
  float y = sin(uv.y * pi);

  return 0.05 + x * y * 0.95;
}

vec3 cameraPosition() {
  return vec3(
    10.0 * sin(TIME / 6.0),
    10.0 * cos(TIME / 6.0),
    10.0 * sin(TIME / 2.0)
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / RESOLUTION;

  // camera
  vec3 origin = cameraPosition();
  vec3 lookVector = normalize(-origin); // look toward 0, 0, 0
  vec3 up = rotateX(WOBBLE * sin(TIME / 0.50)) * UP; // wobble camera

  Ray ray = createRay(origin, lookVector, up, uv, FOV * pi / 180.0);

  vec3 col = render(ray) * vignette(uv);

  gl_FragColor = vec4(col,1.0);
}