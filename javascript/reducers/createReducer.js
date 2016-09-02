export default function (name, defaultValue, parentType, parentName) {
  const UPPERCASE_NAME = name.toUpperCase()

  return function (state = defaultValue, action) {
    if (parentName && parentName !== action[parentType]) { return state }

    switch (action.type) {
      case `SET_${UPPERCASE_NAME}`:
        return action.value
      case `RESET_${UPPERCASE_NAME}`:
      case 'RESET':
        return defaultValue
      default:
        return state
    }
  }
}
