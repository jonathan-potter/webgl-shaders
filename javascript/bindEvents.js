export default function ({ store, viewport }) {
  const resetButton = document.getElementsByClassName('reset-button')[0]
  const fractalSelector = Array.from(document.getElementsByClassName('fractal-selector'))[0]
  const sliders = Array.from(document.getElementsByClassName('config-input'))
  const selects = Array.from(document.getElementsByClassName('config-selector'))
  const inputs = sliders.concat(selects)

  resetButton.addEventListener('click', () => {
    const fractal = store.getState().fractal

    store.dispatch({
      type: 'RESET_FRACTAL_CONFIG',
      fractal
    })

    viewport.update()
  })

  fractalSelector.addEventListener('input', function () {
    store.dispatch({
      type: 'SET_FRACTAL',
      value: fractalSelector.value
    })
  })

  inputs.forEach(input => {
    input.addEventListener('input', inputEventHandler.bind(null, input))
  })

  store.subscribe(setInputValuesToStateValues)
  store.subscribe(setFractalSelectorToStateValue)

  function setFractalSelectorToStateValue() {
    const fractal = store.getState().fractal

    fractalSelector.value = fractal
  }

  function setInputValuesToStateValues() {
    const fractal = store.getState().fractal
    const config = store.getState().propertiesByFractal[fractal].config

    inputs.forEach(input => {
      input.value = config[input.name]
    })
  }

  setFractalSelectorToStateValue()
  setInputValuesToStateValues()

  function inputEventHandler(input) {
    const fractal = store.getState().fractal

    store.dispatch({
      type: 'SET_CONFIG_VALUE',
      name: input.name,
      value: input.value,
      fractal
    })
  }

  const content = document.getElementsByClassName('content')[0]
  const hambergerMenu = document.getElementsByClassName('hamberger-menu')[0]

  hambergerMenu.addEventListener('click', () => {
    content.classList.toggle('menu-open')
  })
}
