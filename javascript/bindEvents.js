import Config, { keys as ConfigKeys, DEFAULT_CONFIG } from 'javascript/config'
import HashSubscriber from 'hash-subscriber'

export default function ({ viewport }) {
  const resetZoomButton = document.getElementsByClassName('reset-zoom-button')[0]
  const sliders = Array.from(document.getElementsByTagName('input'))
  const selects = Array.from(document.getElementsByTagName('select'))
  const inputs = sliders.concat(selects)

  resetZoomButton.addEventListener('click', () => {
    Config.setConfig({
      x_min: DEFAULT_CONFIG.x_min,
      x_max: DEFAULT_CONFIG.x_max,
      y_min: DEFAULT_CONFIG.y_min,
      y_max: DEFAULT_CONFIG.y_max
    })

    viewport.update()
  })

  inputs.forEach(input => {
    input.addEventListener('input', inputEventHandler.bind(null, input))
  })

  HashSubscriber.subscribe(ConfigKeys, setInputValuesToConfigValues)

  let config
  function setInputValuesToConfigValues() {
    config = Config.getConfig()

    inputs.forEach(input => {
      input.value = config[input.name]
    })
  }

  setInputValuesToConfigValues()

  function inputEventHandler(input) {
    Config.setConfig({
      [input.name]: input.value
    })
  }

  const content = document.getElementsByClassName('content')[0]
  const hambergerMenu = document.getElementsByClassName('hamberger-menu')[0]

  hambergerMenu.addEventListener('click', () => {
    content.classList.toggle('menu-open')
  })
}
