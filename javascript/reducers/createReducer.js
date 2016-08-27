export default function (name, defaultValue) {
  const UPPERCASE_NAME = name.toUpperCase()

  return function (state = defaultValue, action) {
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
