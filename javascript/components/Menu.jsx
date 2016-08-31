import React from 'react'
import { connect } from 'react-redux'
import MenuItemFractalSelect from 'components/MenuItemFractalSelect'
import MenuItemRange from 'components/MenuItemRange'
import MenuItemSelect from 'components/MenuItemSelect'
import MenuItemShareGroup from 'components/MenuItemShareGroup'
import cn from 'classnames'

import './menu.css'

const mapStateToProps = ({ menuOpen }) => ({ menuOpen })

export default connect(mapStateToProps)(({ menuOpen}) => {
  return (
    <menu className={cn('slide-out-menu', { 'menu-open': menuOpen })}>
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
})
