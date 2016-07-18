import map from 'lodash/map';

export default function(query) {
  var keyValuePairs = map(query, (value, key) => {
    return [key, value].join('=');
  });

  window.location.replace('#' + keyValuePairs.join('&'));
}
