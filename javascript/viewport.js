const ZOOM_SIZE = 0.5

const VIEWPORT_PROTOTYPE = {
  init ({ center, range, rotation }) {
    this.center = center
    this.range = range
    this.rotation = rotation
  },

  aspectRatio () {
    return window.innerWidth / window.innerHeight
  },

  serialize () {
    return {
      center: this.center,
      range: this.range,
      rotation: this.rotation
    }
  },

  setCenter (location) {
    return Viewport.create({
      center: location,
      range: this.range,
      rotation: this.rotation
    })
  },

  cartesianLocation (normalizedLocation) {
    if (!normalizedLocation) { return }

    let { x, y } = normalizedLocation

    x -= 0.5
    y -= 0.5
    x *= this.aspectRatio()
    y *= -1

    const magnitude = Math.sqrt(x * x + y * y)
    const angle = Math.atan2(y, x)

    x = magnitude * Math.cos(angle + this.rotation)
    y = magnitude * Math.sin(angle + this.rotation)

    return {
      x: this.center.x + this.range.y * x,
      y: this.center.y + this.range.y * y
    }
  },

  zoomToLocation (location = this.center) {
    const newRange = {
      x: this.range.x * ZOOM_SIZE,
      y: this.range.y * ZOOM_SIZE
    }

    return Viewport.create({
      center: location,
      range: newRange,
      rotation: this.rotation
    })
  },

  zoomOut (location = this.center) {
    const newRange = {
      x: this.range.x / ZOOM_SIZE,
      y: this.range.y / ZOOM_SIZE
    }

    return Viewport.create({
      center: location,
      range: newRange,
      rotation: this.rotation
    })
  }
}

const Viewport = {
  create ({ center, range, rotation }) {
    const viewport = Object.create(VIEWPORT_PROTOTYPE)

    viewport.init({ center, range, rotation })

    return viewport
  }
}

export default Viewport
