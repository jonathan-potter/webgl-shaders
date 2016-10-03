import configureProgram from 'webgl-utilities/configureProgram'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import julia from 'shaders/julia.glsl'
import collatz from 'shaders/collatz.glsl'
import burningShip from 'shaders/burningShip.glsl'
import spinningCube from 'shaders/spinningCube.glsl'

const SHADER_SOURCES = {
  'julia set': julia,
  'mandelbrot set': julia,
  'modified collatz': collatz,
  'burning ship': burningShip,
  'spinning cube': spinningCube
}

const programs = {}
export default ({ context, shader }) => (
  programs[shader] = programs[shader] || configureProgram({
    context,
    fragmentShaderSource: SHADER_SOURCES[shader],
    vertexShaderSource: vertexShaderSource
  })
)
