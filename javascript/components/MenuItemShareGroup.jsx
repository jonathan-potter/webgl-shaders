import React, { Component } from 'react'
import 'social-share-kit' // exposes global

export default class MenuItemShareGroup extends Component {
  componentDidMount () {
    /* eslint-disable no-undef */
    SocialShareKit.init({
      url: 'https://jonathan-potter.github.io/webgl-shaders/'
    })
    /* eslint-enable no-undef */
  }

  render () {
    return (
      <li className='menu-item share-group'>
        <div className='ssk-group ssk-lg'>
          <a href='' className='ssk menu-size-mod ssk-facebook' />
          <a href='' className='ssk menu-size-mod ssk-twitter' />
          <a href='' className='ssk menu-size-mod ssk-google-plus' />
          <a href='' className='ssk menu-size-mod ssk-pinterest' />
          <a href='' className='ssk menu-size-mod ssk-tumblr' />
        </div>
      </li>
    )
  }
}
