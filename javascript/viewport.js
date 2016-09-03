const ZOOM_SIZE = 0.5

const VIEWPORT_PROTOTYPE = {
  init ({ center, range }) {
    this.center = center
    this.range = range
  },

  serialize () {
    return {
      center: this.center,
      range: this.range
    }
  },

  setCenter (location) {
    return Viewport.create({
      center: location,
      range: this.range
    })
  },

  topLeft () {
    return {
      x: this.center.x - this.range.x / 2,
      y: this.center.y + this.range.y / 2
    }
  },

  cartesianLocation (normalizedLocation) {
    if (!normalizedLocation) { return }

    const topLeft = this.topLeft()

    return {
      x: topLeft.x + this.range.x * normalizedLocation.x,
      y: topLeft.y - this.range.y * normalizedLocation.y
    }
  },

  zoomToLocation (location = this.center) {
    const newRange = {
      x: this.range.x * ZOOM_SIZE,
      y: this.range.y * ZOOM_SIZE
    }

    return Viewport.create({
      center: location,
      range: newRange
    })
  },

  zoomOut (location = this.center) {
    const newRange = {
      x: this.range.x / ZOOM_SIZE,
      y: this.range.y / ZOOM_SIZE
    }

    return Viewport.create({
      center: location,
      range: newRange
    })
  }
}

const Viewport = {
  create ({ center, range }) {
    const viewport = Object.create(VIEWPORT_PROTOTYPE)

    viewport.init({ center, range })

    return viewport
  }
}

export default Viewport
