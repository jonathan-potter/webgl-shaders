export default function(query = window.location.hash) {
  var keyValuePairs;
  if (query.length > 0) {
    keyValuePairs = query.slice(1).split('&');
  } else {
    keyValuePairs = [];
  }

  return keyValuePairs.reduce((hash, keyValuePair) => {
    let [key, value] = keyValuePair.split('=');

    if (value && isNaN(value)) {
      hash[key] = value;
    } else {
      hash[key] = parseFloat(value);
    }

    return hash;
  }, {});
}
