import React, { PureComponent } from 'react';
import WOW from 'wowjs';

import View from './View';

/**
 * Container component for the homepage (Landing page)
 *
 * @class Home
 * @extends {PureComponent}
 */
class Home extends PureComponent {
  componentDidMount() {
    new WOW.WOW().init();
  }

  render() {
    return (
      <View />
    );
  }
}

export default Home;
