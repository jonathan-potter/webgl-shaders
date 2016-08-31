import React from 'react'
import MenuItemFractalSelect from 'components/MenuItemFractalSelect'
import MenuItemRange from 'components/MenuItemRange'
import MenuItemSelect from 'components/MenuItemSelect'
import MenuItemShareGroup from 'components/MenuItemShareGroup'
import { connect } from 'react-redux'
import * as actions from 'actions'
import { getCurrentFractal, getFractalConfig } from 'reducers'
import map from 'lodash/map'

export default () => {
  return (
    <menu className="slide-out-menu">
      <ul className="menu-items">
        <MenuItemShareGroup />
        <MenuItemFractalSelect name="fractal" options={['Julia Set', 'Mandelbrot Set']} />
        <MenuItemSelect name="colorset" options={['linear', 'squared periodic']} />
        <MenuItemRange name="brightness" min="1" max="8" />
        <MenuItemRange name="speed" min="0" max="320" />
        <MenuItemRange name="exponent" min="0" max="10" />
        <MenuItemSelect name="supersamples" options={{ 1: '1x', 4: '4x', 16: '16x' }} />
      </ul>
    </menu>
  )
}
