[![Build Status](https://travis-ci.org/larrystone/BC-26-More-Recipes.svg?branch=develop)](https://travis-ci.org/larrystone/BC-26-More-Recipes)
[![Coverage Status](https://coveralls.io/repos/github/larrystone/BC-26-More-Recipes/badge.svg?branch=develop)](https://coveralls.io/github/larrystone/BC-26-More-Recipes?branch=develop)
[![Code Climate](https://codeclimate.com/github/larrystone/BC-26-More-Recipes/badges/gpa.svg)](https://codeclimate.com/github/larrystone/BC-26-More-Recipes)
[![codecov](https://codecov.io/gh/larrystone/BC-26-More-Recipes/branch/develop/graph/badge.svg)](https://codecov.io/gh/larrystone/BC-26-More-Recipes)

# More-Recipes
More-Recipes is a full stack web app that provides a platform for sharing recipe ideas that users have invented or learnt.
Users can post their recipe ideas on More-Recipes and get feedback in form of reviews and votes from other users.

## Hosted Application
https://more-recipe.herokuapp.com/

## API Documentation
Click [here](https://more-recipe.herokuapp.com/api-docs) to view our detailed API documentation 

## Installation 
1. Install [`node`](https://nodejs.org/en/download/), version 5 or greater

2. Install [`postgres`](https://www.postgresql.org/download/)

3. Clone the repo and cd into it

    ```
    git clone https://github.com/larrystone/BC-26-More-Recipes.git
    cd BC-26-More-Recipes
    ```

4. Install all dependencies

    ```
    npm install
    ```

5. Configure Postgres

    ```
    configure your database settings for development and test in
    `./server/config/config.json` using .env.example file template
    ```

6.  Run database migrations

    ```
    $ sequelize db:migrate
    ```

7. Start the app

    ```
    npm start
    ```

8. Run the application on browser

    ```
    http://localhost:3001/
    ```    
## Features

- Create an account with username,email and password.
- Sign in with username/email and password
- Create recipes
- Modify recipes
- View recipes
- Search for recipes
- Post reviews on recipes
- Bookmark and manage bookmarked recipes
- Upvote or downvote recipes
- View/edit user profile

## Testing

The app uses: 
`Chai` and `Chai-Http` for backend testing, 
`Enzyme` and `Jest` for frontend testing

- `npm run test:server` - for backend testing
- `npm run test:client` - for client testing
- `npm run test:coverage` - for client and server side test (with coverage)

## Directories

#### Templates
All html files and stylesheets, images, bootstrap templates for the Client Side implementation are modelled in this folder. However, this is not final as it is subject to minor changes in the actual client side implementation

#### Client
This folder hosts the Client Side implementation (using React/Redux) powered by the Server Side backend

#### Server
This directory holds all routes, controllers, middleware, migrations that serves the backend for the app

## Built With
* [NodeJS](https://nodejs.org/en/) - A Javascript runtime built on chrome V8 engine that uses an event-driven non-blocking I/O model that makes it lightweight and efficient.
* [ExpressJs](https://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* [Sequelize](http://docs.sequelizejs.com/) - An ORM for Node.js that supports the dialects of PostgreSQL and features solid transaction support an relations.
* [Postgres](https://www.postgresql.org/) - A powerful, open source object-relational database system.
* [Semantic-ui-react]() - Official React integration for Semantic UI.
* [React](https://www.reactjs.org/) - A JavaScript library for building user interfaces by Facebook.
* [Redux](http://redux.js.org/) - A predictable state container for JavaScript apps.

## Author

* **Lawal Lanre E. (Larrystone)** - Aspiring Software Dev.

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Google Material Icons
* Materialise CSS
* Jquery
* Google Graph API
* ReactJS
* ReduxJS
* Semantic UI React Library
* React Google Charts Library
* Cloudinary
