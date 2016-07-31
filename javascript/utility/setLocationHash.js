import map from 'lodash/map';

export default function(query) {
  const keyValuePairs = map(query, (value, key) => {
    return [key, value].join('=');
  });

  window.location.replace('#' + keyValuePairs.join('&'));
}
