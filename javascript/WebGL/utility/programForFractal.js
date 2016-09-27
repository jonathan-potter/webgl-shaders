import configureProgram from 'webgl-utilities/configureProgram'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import julia from 'shaders/julia.glsl'
import collatz from 'shaders/collatz.glsl'
import burningShip from 'shaders/burningShip.glsl'

const SHADER_SOURCES = {
  'julia set': julia,
  'mandelbrot set': julia,
  'modified collatz': collatz,
  'burning ship': burningShip
}

const programs = {}
export default ({ context, fractal }) => (
  programs[fractal] = programs[fractal] || configureProgram({
    context,
    fragmentShaderSource: SHADER_SOURCES[fractal],
    vertexShaderSource: vertexShaderSource
  })
)
