import parseLocationHash from 'javascript/utility/parseLocationHash';
import setLocationHash from 'javascript/utility/setLocationHash';

import assign from 'lodash/assign'

const DEFAULT_CONFIG = {
  animate: true,

  x_min: -2.0,
  x_max:  2.0,
  y_min: -1.25,
  y_max:  1.25,

  brightness: 8.0
};

const Config = {
  currentConfig: {},
  getConfig(locationHash = parseLocationHash()) {
    Config.currentConfig = assign({}, DEFAULT_CONFIG, locationHash);

    return Config.currentConfig;
  },
  setConfig(configChanges) {
    const newConfig = assign({}, Config.getConfig(), configChanges);

    setLocationHash(newConfig);
  }
};

export default Config;
