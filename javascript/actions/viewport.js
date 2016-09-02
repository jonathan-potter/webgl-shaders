import { getCurrentFractal } from 'reducers'

export const zoomToLocation = ({ location, fractal }) => (dispatch, getState) => {
  dispatch({
    type: 'ZOOM_TO_LOCATION',
    fractal: getCurrentFractal(getState()),
    location
  })
}
