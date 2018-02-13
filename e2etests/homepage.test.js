module.exports = {
  'Display homepage and ensure all element are available': (browser) => {
    browser
      .url('http://localhost:3001')
      .waitForElementVisible('body', 5000)
      .assert.title('More Recipes')
      .assert.containsText('#signIn', 'Sign In')
      .assert.containsText('#signUp', 'Sign Up')
      .assert.containsText('.text--heading', 'More-Recipes')
      .assert.visible('.intro')
      .assert.visible('.banner--image')
      .assert.cssProperty('img', 'animation-name', 'foods')
      .expect.element('img').to.have.attribute('src')
      .which.contains('images/foods.png');
    browser.end();
  }
};
