attribute vec4 a_Position;

attribute float a_PointSize;

uniform vec2 u_resolution;

void main() {

gl_Position = a_Position;

gl_PointSize = a_PointSize;

}
