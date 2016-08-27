import configureWebGL from 'javascript/configureWebGL'
import configureStore from 'utility/configureStore'

const store = configureStore()

configureWebGL({store})
