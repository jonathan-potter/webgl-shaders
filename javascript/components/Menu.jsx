import React from 'react'
import { connect } from 'react-redux'
import { DEFAULT_MENU_CONFIG } from 'javascript/config'
import MenuItemShaderSelect from 'components/MenuItemShaderSelect'
import MenuItemRange from 'components/MenuItemRange'
import MenuItemSelect from 'components/MenuItemSelect'
import MenuItemShareGroup from 'components/MenuItemShareGroup'
import * as actions from 'actions'
import map from 'lodash/map'
import cn from 'classnames'

import './menu.css'

const mapStateToProps = ({ currentShader, menuOpen }) => ({ currentShader, menuOpen })

export default connect(mapStateToProps, actions)(
  ({ currentShader, menuOpen, resetShader, zoomOut, zoomToLocation }) => {
    const { menuOrder: MENU_ORDER, controls: CONTROLS } = DEFAULT_MENU_CONFIG[currentShader]

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
          <li className='menu-item zoom-button-group'>
            <button
              className='reset-button button-primary'
              onClick={zoomOut}>
              zoom out
            </button>
            <button
              className='reset-button button-primary'
              onClick={zoomToLocation}>
              zoom in
            </button>
            <button
              className='reset-button button-primary'
              onClick={resetShader}>
              reset
            </button>
          </li>
          <MenuItemShaderSelect name='shader' options={Object.keys(DEFAULT_MENU_CONFIG)} />
          { controls }
        </ul>
      </menu>
    )
  }
)
