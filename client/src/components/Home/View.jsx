import React from 'react';

import Footer from '../commons/Footer';
import AppIntro from './AppIntro';
import SampleRecipes from './SampleRecipes';

const View = () => (
  <div className="body">
    <main>
      <AppIntro />
      <SampleRecipes />
    </main>
    <Footer />
  </div>
);

export default View;
