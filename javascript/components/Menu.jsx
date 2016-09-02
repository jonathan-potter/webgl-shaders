import React from 'react'
import { connect } from 'react-redux'
import { DEFAULT_MENU_CONFIG } from 'javascript/config'
import MenuItemFractalSelect from 'components/MenuItemFractalSelect'
import MenuItemRange from 'components/MenuItemRange'
import MenuItemSelect from 'components/MenuItemSelect'
import MenuItemShareGroup from 'components/MenuItemShareGroup'
import map from 'lodash/map'
import cn from 'classnames'

import './menu.css'

const mapStateToProps = ({ currentFractal, menuOpen }) => ({ currentFractal, menuOpen })

export default connect(mapStateToProps)(({ currentFractal, menuOpen }) => {
  const { menuOrder: MENU_ORDER, controls: CONTROLS } = DEFAULT_MENU_CONFIG[currentFractal]

  const controls = map(MENU_ORDER, (name) => {
    const {min, max, options, type} = CONTROLS[name]

    switch (type) {
      case 'range':
        return <MenuItemRange key={name} name={name} min={min} max={max} />
      case 'select':
        return <MenuItemSelect key={name} name={name} options={options} />
    }
  })

  return (
    <menu className={cn('slide-out-menu', { 'menu-open': menuOpen })}>
      <ul className='menu-items'>
        <MenuItemShareGroup />
        <MenuItemFractalSelect name='fractal' options={['Julia Set', 'Mandelbrot Set']} />
        { controls }
      </ul>
    </menu>
  )
})
