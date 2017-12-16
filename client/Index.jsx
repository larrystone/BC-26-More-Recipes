import React from 'react';
import { render } from 'react-dom';

import './styles/index.scss';
import './styles/animate.css';

import Home from './src/components/Home';

render(<Home />, document.querySelector('#root'));
