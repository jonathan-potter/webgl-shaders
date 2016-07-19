import parseLocationHash from 'javascript/utility/parseLocationHash';
import setLocationHash from 'javascript/utility/setLocationHash';

const DEFAULT_CONFIG = {
  x_min: -2.0,
  x_max:  2.0,
  y_min: -1.25,
  y_max:  1.25,

  brightness: 4.0
};

const Config = {
  currentConfig: {},
  getConfig(locationHash = parseLocationHash()) {
    Config.currentConfig = Object.assign({}, DEFAULT_CONFIG, locationHash);

    return Config.currentConfig;
  },
  setConfig(configChanges) {
    const newConfig = Object.assign({}, Config.getConfig(), configChanges);

    setLocationHash(newConfig);
  }
};

export default Config;
