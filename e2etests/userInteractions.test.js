/*eslint-disable*/

const veryShort = 500;
const short = 1000;
const long = 3000;
const baseUrl = 'http://localhost:3001';

module.exports = {
  'user receives error when the sign up form is not properly filled':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .resizeWindow(1700, 800)
        .maximizeWindow()
        .pause(long)
        .execute(function () { //eslint-disable-line
          document.querySelector('#signUp').click();
        })
        .waitForElementVisible('.form--signup', short)
        .setValue('input[name=name]', 'lovelace')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        '* Username must be between 3 to 50 characters!' +
        '\n* Enter a valid email address' +
        '\n* Password must be between 6 to 50 characters!')
        .pause(long)
        .setValue('input[name=password]', 'iloveyou')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        '* Username must be between 3 to 50 characters!' +
        '\n* Enter a valid email address')
        .pause(long)
        .setValue('input[name=username]', 'stonny')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', '* Enter a valid email address')
        .pause(long)
        .setValue('input[name=email]', 'stonny@mail.com')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Passwords don\'t match!')
        .pause(short);
    },
  'user gets automatically logged in when the sign up form is correctly filled':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .pause(long)
        .execute(function () { //eslint-disable-line
          document.querySelector('#signUp').click();
        })
        .waitForElementVisible('.form--signup', short)
        .setValue('input[name=name]', 'lovelace')
        .setValue('input[name=password]', 'iloveyou')
        .setValue('input[name=username]', 'stonny')
        .setValue('input[name=email]', 'stonny@mail.com')
        .setValue('input[name=confirmPassword]', 'iloveyou')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('footer', short)
        .assert.urlContains('/recipes')
        .pause(short);
    },
  'user can sign out of the app':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .pause(long)
        .execute(function () {//eslint-disable-line
          document.querySelector('#user').click();
        })
        .pause(short)
        .click('#signOut')
        .pause(short);
    },
  'user cannot sign up with an already taken email address or username':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .pause(long)
        .execute(function () {//eslint-disable-line
          document.querySelector('#signUp').click();
        })
        .waitForElementVisible('.form--signup', short)
        .setValue('input[name=name]', 'love lace')
        .setValue('input[name=password]', 'iloveyou')
        .setValue('input[name=username]', 'newuser')
        .setValue('input[name=email]', 'stonny@mail.com')
        .setValue('input[name=confirmPassword]', 'iloveyou')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Email already taken!')
        .pause(long)
        .setValue('input[name=email]', 's')
        .clearValue('input[name=username]')
        .pause(veryShort)
        .setValue('input[name=username]', 'stonny')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Username already taken!')
        .pause(short);
    },
  'user cannot sign in with invalid credentials':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .pause(long)
        .execute(function () {//eslint-disable-line
          document.querySelector('#signIn').click();
        })
        .waitForElementVisible('.form', short)
        .setValue('input[name=authName]', 'lovelace')
        .setValue('input[name=password]', 'iloveyou')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Invalid Login Credentials!')
        .pause(long)
        .setValue('input[name=authName]', 'stonny')
        .setValue('input[name=password]', 'iloeyou')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Invalid Login Credentials!')
        .pause(short);
    },
  'user can sign in with valid credentials':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .pause(long)
        .execute(function () {//eslint-disable-line
          document.querySelector('#signIn').click();
        })
        .waitForElementVisible('.form', short)
        .setValue('input[name=authName]', 'stonny')
        .setValue('input[name=password]', 'iloveyou')
        .pause(long)
        .click('.ui.brown.fluid.button')
        .waitForElementVisible('footer', short)
        .pause(short);
    },
  'AllRecipes: user sees no recipes when none is found':
    (browser) => {
      browser
        .url(`${baseUrl}/recipes/?page=1&limit=10`)
        .pause(long)
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Nothing found!')
        .assert.visible('.ui.brown.large.message.not-found--message')
        .assert.containsText('.header', 'Nothing found!')
        .assert.containsText('.content.error', 'Sorry, nothing found here!!!')
        .pause(short);
    },
  'MyRecipes: user sees no recipes when none is found':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Nothing found!')
        .assert.visible('.ui.brown.large.message.not-found--message')
        .assert.containsText('.header', 'Nothing found!')
        .assert.containsText('.content.error', 'Sorry, nothing found here!!!')
        .pause(short);
    },
  'MyFavorites: user sees no recipes when none is found':
    (browser) => {
      browser
        .url(`${baseUrl}/favorites`)
        .pause(long)
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Nothing found!')
        .assert.visible('.ui.brown.large.message.not-found--message')
        .assert.containsText('.header', 'Nothing found!')
        .assert.containsText('.content.error', 'Sorry, nothing found here!!!')
        .pause(short);
    },
  'Create Recipe: user cannot create new recipe with incorrectly filled form':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .assert.visible('.plus.icon')
        .assert.containsText('.ui.left.pointing.basic.label', 'New Recipe')
        .click('.plus.icon')
        .pause(veryShort)
        .assert.visible('.ui.page.modals.dimmer.transition.visible.active')
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        '* Recipe name must be between 3 to 100 characters!' +
        '\n* Ingredients list must be between 10 to 2000 characters!' +
        '\n* Procedures must be between 15 to 4000 characters!')
        .pause(short)
        .setValue('input[name=name]', 'Fried Rice')
        .pause(short)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        '* Ingredients list must be between 10 to 2000 characters!' +
        '\n* Procedures must be between 15 to 4000 characters!')
        .pause(short)
        .setValue('textarea[name=ingredients]', 'salt,water,sugar,maggi')
        .pause(short)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        '* Procedures must be between 15 to 4000 characters!')
        .pause(short)
        .setValue('textarea[name=procedure]', 'okay')
        .pause(short)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        '* Procedures must be between 15 to 4000 characters!')
        .pause(short);
    },
  'Create Recipe: user can create new recipes':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .click('.plus.icon')
        .setValue('input[name=name]', 'Fried Rice')
        .setValue('textarea[name=ingredients]', 'salt,water,sugar,maggi')
        .setValue('textarea[name=procedure]',
        'let us just start cooking, shall we?')
        .pause(long)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'New recipe created\nFried Rice')
        .assert.elementNotPresent('.ui.brown.large.message.not-found--message')
        .assert.visible('#recipe-1')
        .pause(long)
        .click('.plus.icon')
        .setValue('input[name=name]', 'Amala Soup')
        .setValue('textarea[name=ingredients]', 'salt,water,sugar,maggi')
        .setValue('textarea[name=procedure]',
        'let us just start cooking, shall we?')
        .pause(long)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'New recipe created\nAmala Soup')
        .assert.elementNotPresent('.ui.brown.large.message.not-found--message')
        .assert.visible('#recipe-2')
        .assert
        .elementNotPresent('.ui.page.modals.dimmer.transition.visible.active')
        .pause(long)
        .click('.plus.icon')
        .setValue('input[name=name]', 'Ewedu Soup')
        .setValue('textarea[name=ingredients]', 'salt,water,sugar,garri')
        .setValue('textarea[name=procedure]',
        'let us just start cooking, shall we?')
        .click('.ui.icon.positive.right.labeled.button')
        .pause(short)
        .click('.plus.icon')
        .setValue('input[name=name]', 'jollof Rice')
        .setValue('textarea[name=ingredients]', 'salt,water,sugar,maggi')
        .setValue('textarea[name=procedure]',
        'let us just start cooking, shall we?')
        .click('.ui.icon.positive.right.labeled.button')
        .pause(short)
        .click('.plus.icon')
        .setValue('input[name=name]', 'Efo Soup')
        .setValue('textarea[name=ingredients]', 'salt,water,efo,maggi')
        .setValue('textarea[name=procedure]',
        'let us just start cooking, shall we?')
        .click('.ui.icon.positive.right.labeled.button')
        .pause(short)
        .click('.plus.icon')
        .setValue('input[name=name]', 'Ewa agoin')
        .setValue('textarea[name=ingredients]', 'salt,water,beans,oil')
        .setValue('textarea[name=procedure]',
        'let us just start cooking, shall we?')
        .click('.ui.icon.positive.right.labeled.button')
        .pause(short);
    },
  'Create Recipe: a user cannot create two recipes with the same name':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .click('.plus.icon')
        .setValue('input[name=name]', 'Fried Rice')
        .setValue('textarea[name=ingredients]', 'salt,water,sugar,maggi')
        .setValue('textarea[name=procedure]',
        'let us just start cooking, shall we?')
        .pause(long)
        .click('.ui.icon.positive.right.labeled.button')
        .pause(long)
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Recipe name already picked!')
        .assert.elementNotPresent('.ui.brown.large.message.not-found--message')
        .assert.visible('.ui.page.modals.dimmer.transition.visible.active')
        .pause(short);
    },
  'Edit Recipe: users can edit recipes created by them':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .click('#recipe-5 .edit')
        .pause(long)
        .assert.value('input[name=name]', 'Efo Soup')
        .clearValue('input[name=name]')
        .pause(veryShort)
        .setValue('input[name=name]', 'Fried Rice')
        .pause(long)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Recipe name already picked!')
        .assert.visible('.ui.page.modals.dimmer.transition.visible.active')
        .pause(long)
        .clearValue('input[name=name]')
        .pause(veryShort)
        .setValue('input[name=name]', 'F')
        .pause(long)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        '* Recipe name must be between 3 to 100 characters!')
        .pause(long)
        .clearValue('input[name=name]')
        .pause(veryShort)
        .setValue('input[name=name]', 'Plaintain')
        .pause(long)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Recipe updated\nPlaintain')
        .assert
        .elementNotPresent('.ui.page.modals.dimmer.transition.visible.active')
        .pause(short);
    },
  'AllRecipes: user sees the six recipes created':
    (browser) => {
      browser
        .url(`${baseUrl}/recipes`)
        .pause(long)
        .assert.elementNotPresent('.ui.brown.large.message.not-found--message')
        .assert.visible('#recipe-1')
        .assert.visible('#recipe-2')
        .assert.visible('#recipe-3')
        .assert.visible('#recipe-4')
        .assert.visible('#recipe-5')
        .assert.visible('#recipe-6')
        .pause(short);
    },
  'AllRecipes: Pagination: user sees first two recipes (page 1, limit of 2)':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes/?page=1&limit=2`)
        .pause(long)
        .assert.elementNotPresent('.ui.brown.large.message.not-found--message')
        .assert.visible('#recipe-1')
        .assert.visible('#recipe-2')
        .pause(short);
    },
  'AllRecipes: Pagination: user sees last three recipes (page 2, limit of 3)':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes/?page=2&limit=3`)
        .pause(long)
        .assert.elementNotPresent('.ui.brown.large.message.not-found--message')
        .assert.visible('#recipe-4')
        .assert.visible('#recipe-5')
        .assert.visible('#recipe-6')
        .pause(short);
    },
  'AllRecipes: Search: user can search recipes':
    (browser) => {
      browser
        .url(`${baseUrl}/recipes`)
        .pause(long)
        .setValue('input', 'fried rice')
        .click('.ui.brown.animated.button')
        .pause(short)
        .assert.elementNotPresent('.ui.brown.large.message.not-found--message')
        .assert.visible('#recipe-1')
        .pause(long)
        .setValue('input', 'yam')
        .click('.ui.brown.animated.button')
        .pause(short)
        .assert.visible('.ui.brown.large.message.not-found--message')
        .assert.elementNotPresent('.food-card')
        .pause(short)
        .setValue('input', 'maggi')
        .click('.selection.dropdown')
        .click('div:nth-child(2).item')
        .pause(long)
        .click('.ui.brown.animated.button')
        .pause(short)
        .assert.elementNotPresent('.ui.brown.large.message.not-found--message')
        .assert.visible('.food-card')
        .pause(short);
    },
  'Delete Recipe: users can delete recipes created by them':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .click('#recipe-2 .delete')
        .assert.visible('.ui.page.modals.dimmer.transition.visible.active')
        .pause(long)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'You have removed Amala Soup')
        .assert.elementNotPresent('#recipe-2')
        .pause(short);
    },
  'Recipe Details: users can view recipe details':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .click('#recipe-3 .eye')
        .pause(veryShort)
        .assert.containsText('div.header', 'Ewedu Soup')
        .assert.containsText('div.meta', 'by lovelace')
        .assert.containsText('.ui.blue.left.pointing.basic.label', '1')
        .assert.attributeEquals('img', 'src', `${baseUrl}/images/noImage.jpg`)
        .pause(short);
    },
  'Recipe Details: a user can add/remove recipe from his/her favorite':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .click('#recipe-3 .eye')
        .pause(veryShort)
        .assert.visible('.star.large.icon')
        .click('.star.large.icon')
        .pause(long)
        .assert.cssClassPresent('.star.large.icon', 'yellow')
        .click('.star.large.icon')
        .pause(veryShort)
        .assert.cssClassNotPresent('.star.large.icon', 'yellow')
        .assert.cssClassPresent('.star.large.icon', 'empty')
        .pause(long)
        .click('.star.large.icon')
        .pause(veryShort);
    },
  'Recipe Details: a user can upvote/donwvote recipes':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .click('#recipe-3 .eye')
        .pause(veryShort)
        .assert.visible('.star.large.icon')
        .assert.containsText('.ui.red.left.pointing.basic.label', '0')
        .assert.containsText('.ui.green.left.pointing.basic.label', '0')
        .click('.ui.red.basic.button')
        .pause(short)
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Recipe downvoted')
        .assert.containsText('.ui.red.left.pointing.basic.label', '1')
        .assert.containsText('.ui.green.left.pointing.basic.label', '0')
        .pause(short)
        .click('.ui.red.basic.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Recipe already Downvoted!')
        .assert.containsText('.ui.red.left.pointing.basic.label', '1')
        .assert.containsText('.ui.green.left.pointing.basic.label', '0')
        .pause(short)
        .click('.ui.green.basic.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Recipe upvoted')
        .assert.containsText('.ui.red.left.pointing.basic.label', '0')
        .assert.containsText('.ui.green.left.pointing.basic.label', '1')
        .pause(short)
        .click('.ui.green.basic.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Recipe already Upvoted!')
        .assert.containsText('.ui.red.left.pointing.basic.label', '0')
        .assert.containsText('.ui.green.left.pointing.basic.label', '1')
        .pause(short);
    },
  'Recipe Details: Reviews: a user can view/post reviews on recipe':
    (browser) => {
      browser
        .url(`${baseUrl}/myrecipes`)
        .pause(long)
        .click('#recipe-1 .eye')
        .pause(veryShort)
        .assert.visible('.card--review')
        .assert.visible('.ui.brown.icon.left.labeled.button')
        .assert.attributeEquals('textarea', 'placeholder', 'Write a review')
        .assert.containsText('.comment .content .text',
        'No user posted a review')
        .assert.elementNotPresent('.comment__avatar')
        .pause(short)
        .setValue('textarea', 'A')
        .click('.ui.brown.icon.left.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        'Review message must be between 3 to 4000 characters!')
        .pause(long)
        .setValue('textarea', 'utomated food review')
        .pause(long)
        .click('.ui.brown.icon.left.labeled.button')
        .pause(long)
        .waitForElementVisible('.comment__avatar', long)
        .assert.visible('.comment__avatar')
        .assert.containsText('.content .text', 'Automated food review')
        .assert.containsText('.content .author', 'lovelace')
        .pause(short);
    },
  'MyFavorites: user can remove recipe from favorite':
    (browser) => {
      browser
        .url(`${baseUrl}/favorites`)
        .pause(long)
        .assert.visible('#recipe-3')
        .assert.elementNotPresent('.toast-message')
        .click('.red.close.icon')
        .assert.visible('.ui.page.modals.dimmer.transition.visible.active')
        .assert.containsText('.ui.header .content', 'Ewedu Soup')
        .pause(long)
        .click('.ui.icon.positive.right.labeled.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'You have removed Ewedu Soup')
        .assert.elementNotPresent('#recipe-3')
        .assert.visible('.ui.brown.large.message.not-found--message')
        .assert.containsText('.header', 'Nothing found!')
        .assert.containsText('.content.error', 'Sorry, nothing found here!!!')
        .pause(short);
    },
  'MyProfile: user can view his/her profile information':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .execute(function () {//eslint-disable-line
          document.querySelector('#user').click();
        })
        .pause(short)
        .click('.menu--dropdown .item')
        .pause(long)
        .assert.containsText('.card--profile:nth-child(1) h3',
        'Basic Information')
        .assert.containsText('.card--profile:nth-child(2) h3', 'Stats Chart')
        .assert.visible('.profile--img')
        .assert.value('input[name=name]', 'lovelace')
        .assert.value('input[name=username]', 'stonny')
        .assert.value('input[name=email]', 'stonny@mail.com')
        .assert.visible('#reactgooglegraph-1')
        .pause(short);
    },
  'MyProfile: user can edit his/her profile information with valid information':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .execute(function () {//eslint-disable-line
          document.querySelector('#user').click();
        })
        .pause(short)
        .click('.menu--dropdown .item')
        .pause(long)
        .clearValue('input[name=name]')
        .pause(veryShort)
        .setValue('input[name=name]', 'l')
        .click('.ui.positive.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        'Name must be between 3 to 100 characters!')
        .pause(long)
        .setValue('input[name=name]', 'ovelace york')
        .clearValue('input[name=username]')
        .pause(veryShort)
        .setValue('input[name=username]', 's')
        .pause(veryShort)
        .click('.ui.positive.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        'Username must be between 3 to 50 character!')
        .pause(long)
        .setValue('input[name=name]', 'ovelace york')
        .setValue('input[name=username]', 'tonnyman')
        .pause(long)
        .click('.ui.positive.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'User record updated')
        .assert.containsText('#user', 'stonnyman')
        .pause(short);
    },
  'MyProfile: user can change his/her password with valid information':
    (browser) => {
      browser
        .url(`${baseUrl}`)
        .execute(function () {//eslint-disable-line
          document.querySelector('#user').click();
        })
        .pause(short)
        .click('.menu--dropdown .item')
        .pause(long)
        .click('.ui.label.full-width')
        .pause(veryShort)
        .click('.ui.red.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message',
        'Password must be at least 6 characters in length!')
        .pause(veryShort)
        .setValue('input[name=currentPassword]', 'ovelace')
        .setValue('input[name=password]', 'ovelace york')
        .pause(veryShort)
        .click('.ui.red.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Passwords don\'t match!')
        .pause(long)
        .setValue('input[name=confirmPassword]', 'ovelace york')
        .pause(long)
        .click('.ui.red.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Unable to change password')
        .pause(veryShort)
        .clearValue('input[name=currentPassword]')
        .pause(long)
        .setValue('input[name=currentPassword]', 'iloveyou')
        .pause(long)
        .click('.ui.red.button')
        .waitForElementVisible('.toast-message', short)
        .assert.containsText('.toast-message', 'Password change successful')
        .pause(long);
    },
  'user gets redirected to the 404 page when requesting an invalid route':
    (browser) => {
      browser
        .url(`${baseUrl}/funnyplace`)
        .pause(long)
        .assert.containsText('h2', 'Oh no...the page you requested was not found')
        .assert.attributeEquals('img', 'src', `${baseUrl}/images/zero.svg`)
        .assert.visible('.ui.brown.large.button')
        .pause(long)
        .click('.ui.brown.large.button')
        .pause(long)
        .end();
    },
};
