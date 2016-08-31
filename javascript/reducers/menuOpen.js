export default (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return !state
    case 'RESET':
      return false
    default:
      return state
  }
}
