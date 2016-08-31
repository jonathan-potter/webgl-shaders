import React, { Component } from 'react'
import 'social-share-kit' // exposes global

export default class MenuItemShareGroup extends Component {
  componentDidMount() {
    SocialShareKit.init({
      url: 'https://jonathan-potter.github.io/webgl-shaders/'
    });
  }

  render() {
    return (
      <li className="menu-item share-group">
        <div className="ssk-group ssk-lg">
          <a href="" className="ssk menu-size-mod ssk-facebook"></a>
          <a href="" className="ssk menu-size-mod ssk-twitter"></a>
          <a href="" className="ssk menu-size-mod ssk-google-plus"></a>
          <a href="" className="ssk menu-size-mod ssk-pinterest"></a>
          <a href="" className="ssk menu-size-mod ssk-tumblr"></a>
        </div>
      </li>
    )
  }
}
