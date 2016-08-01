import parseLocationHash from 'javascript/utility/parseLocationHash'
import setLocationHash from 'javascript/utility/setLocationHash'

import assign from 'lodash/assign'

const DEFAULT_CONFIG = {
  x_min: -2.0,
  x_max:  2.0,
  y_min: -1.25,
  y_max:  1.25,

  animate: 'true',
  brightness: 4.0,
  speed: 16,
  supersamples: 1
}

const Config = {
  getConfig(locationHash = parseLocationHash()) {
    return assign({}, DEFAULT_CONFIG, locationHash)
  },
  setConfig(configChanges) {
    const newConfig = assign({}, Config.getConfig(), configChanges)

    setLocationHash(newConfig)
  }
}

export default Config
