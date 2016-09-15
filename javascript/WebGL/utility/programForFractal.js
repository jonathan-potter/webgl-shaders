import configureProgram from 'webgl-utilities/configureProgram'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import juliaShaderSource from 'shaders/julia.glsl'
import collatzShaderSource from 'shaders/collatz.glsl'

const SHADER_SOURCES = {
  'julia set': juliaShaderSource,
  'mandelbrot set': juliaShaderSource,
  'modified collatz': collatzShaderSource
}

const programs = {}
export default ({ context, fractal }) => (
  programs[fractal] = programs[fractal] || configureProgram({
    context,
    fragmentShaderSource: SHADER_SOURCES[fractal],
    vertexShaderSource: vertexShaderSource
  })
)
