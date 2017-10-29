import React from 'react';

const AppIntro = () => {
  const showRandomImage = (imageSrc) => {
    return (
      <div>
        <img src={imageSrc} width='100%' />
      </div>
    );
  };

  return (
    <div>
      {showRandomImage('images/egusi.jpg')}
      <div className="intro">
        <h3 className="full-title">More-Recipes</h3>
        <p> More-Recipes is your social media for
        connecting with wonderful delicacies! </p>
        <ul>
          <li> ~ Share your recipe ideas and inventions with the world</li>
          <li> ~ Try something new from others' recipe ideas </li>
          <li> ~ Share your feedback about the new experience
          (Upvote, downvote or express how you feel in your own words!)</li>
          <li> ~ Like a recipe? go on and add it to your favorite
          recipes list !</li>
        </ul>
      </div>
      {showRandomImage('images/efo.jpg')}
    </div>
  );
};

export default AppIntro;
