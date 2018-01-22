[![Build Status](https://travis-ci.org/larrystone/BC-26-More-Recipes.svg?branch=develop)](https://travis-ci.org/larrystone/BC-26-More-Recipes)
[![Coverage Status](https://coveralls.io/repos/github/larrystone/BC-26-More-Recipes/badge.svg?branch=develop)](https://coveralls.io/github/larrystone/BC-26-More-Recipes?branch=develop)
[![Code Climate](https://codeclimate.com/github/larrystone/BC-26-More-Recipes/badges/gpa.svg)](https://codeclimate.com/github/larrystone/BC-26-More-Recipes)
[![Issue Count](https://codeclimate.com/github/larrystone/BC-26-More-Recipes/badges/issue_count.svg)](https://codeclimate.com/github/larrystone/BC-26-More-Recipes)

# More-Recipes
A Recipe management and sharing app with great features!

# Features
- Sign up and sign in
- Create (and modify) recipes
- View recipes
- Search for recipes
- Post reviews on recipes
- Bookmark and manage bookmarked recipes
- Upvote or downvote recipes
- View/edit user profile

#### Templates
All html files and stylesheets, images, bootstrap templates for the Client Side implementation are modelled in this folder. However, this is not final as it is subject to minor changes in the actual client side implementation

#### Client
This folder hosts the Client Side implementation (using React/Redux) powered by the Server Side backend

#### Server
This directory holds all routes, controllers, middleware, migrations that serves the backend for the app

# Testing
- install POSTMAN app
- run `npm start` 
- Navigate to `localhost:3001` on POSTMAN to test the backend API routes OR
- Open up your browser and navigate to `localhost:3000` to test the Client Side

## Built With

* [ExpressJs](https://expressjs.com/) - The web framework used
* [Sequelize](http://docs.sequelizejs.com/) - The ORM used
* [Postgres](https://www.postgresql.org/) - Database Used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Semantic-ui-react]() - React npm library
* [React]() - ReactJS
* [Redux]() - ReduxJS

## API Documentation

- Navigate to `localhost:3001/api-docs` on your browser and select HTTP protocol to view/test 
- Or go to [https://more-recipe.herokuapp.com/api-docs](https://more-recipe.herokuapp.com/api-docs)

## Getting Started

* git clone https://github.com/larrystone/BC-26-More-Recipes.git
* Run `npm install` to install all packages
* Run `sequelize db:migrate` to run pending migrations
* Run `npm start` to start application
* Use localhost:3001 to access backend on POSTMAN
* Type localhost:3001 in browser to access client side

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run coveralls`

Launches the interactive test runner and display test coverage reports


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