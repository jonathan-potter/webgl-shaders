import Config, { keys as ConfigKeys, DEFAULT_CONFIG } from 'javascript/config'
import HashSubscriber from 'hash-subscriber'

export default function ({ store, viewport }) {
  const resetZoomButton = document.getElementsByClassName('reset-button')[0]
  const sliders = Array.from(document.getElementsByTagName('input'))
  const selects = Array.from(document.getElementsByTagName('select'))
  const inputs = sliders.concat(selects)

  resetZoomButton.addEventListener('click', () => {
    store.dispatch({
      type: 'RESET'
    })

    viewport.update()
  })

  inputs.forEach(input => {
    input.addEventListener('input', inputEventHandler.bind(null, input))
  })

  store.subscribe(setInputValuesToStateValues)

  let state
  function setInputValuesToStateValues() {
    state = store.getState()

    inputs.forEach(input => {
      input.value = state[input.name]
    })
  }

  setInputValuesToStateValues()

  function inputEventHandler(input) {
    store.dispatch({
      type: `SET_${input.name.toUpperCase()}`,
      value: input.value
    })
  }

  const content = document.getElementsByClassName('content')[0]
  const hambergerMenu = document.getElementsByClassName('hamberger-menu')[0]

  hambergerMenu.addEventListener('click', () => {
    content.classList.toggle('menu-open')
  })
}
