import parseLocationHash from 'utility/parseLocationHash'
import setLocationHash from 'utility/setLocationHash'

import assign from 'lodash/assign'

export const DEFAULT_CONFIG = {
  x_min: -2.0,
  x_max:  2.0,
  y_min: -1.25,
  y_max:  1.25,

  brightness: 4.0,
  colorset: 0,
  exponent: 2,
  fractal: 0,
  speed: 16,
  supersamples: 1
}

export const keys = Object.keys(DEFAULT_CONFIG)

let config
const Config = {
  getConfig() {
    config = config || assign({}, DEFAULT_CONFIG, parseLocationHash())

    return config
  },
  setConfig(configChanges) {
    config = assign({}, Config.getConfig(), configChanges)

    setLocationHash(config)
  }
}

export default Config
