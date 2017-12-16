[![Build Status](https://travis-ci.org/larrystone/BC-26-More-Recipes.svg?branch=develop)](https://travis-ci.org/larrystone/BC-26-More-Recipes)
[![Coverage Status](https://coveralls.io/repos/github/larrystone/BC-26-More-Recipes/badge.svg?branch=develop)](https://coveralls.io/github/larrystone/BC-26-More-Recipes?branch=develop)
[![Code Climate](https://codeclimate.com/github/larrystone/BC-26-More-Recipes/badges/gpa.svg)](https://codeclimate.com/github/larrystone/BC-26-More-Recipes)
[![Issue Count](https://codeclimate.com/github/larrystone/BC-26-More-Recipes/badges/issue_count.svg)](https://codeclimate.com/github/larrystone/BC-26-More-Recipes)

# More-Recipes
A Recipe management and sharing app with great features!

# Features
- Signup and Login
- Create (and modify) Recipes
- View recipes
- Post reviews on recipes
- Bookmark recipes (Favorite)
- Upvote or downvote recipes
- View User profile

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

## Deployment


## Built With

* [ExpressJs](https://expressjs.com/) - The web framework used
* [Sequelize](http://docs.sequelizejs.com/) - The ORM used
* [Postgres](https://www.postgresql.org/) - Database Used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Semantic-ui-react]() - React npm library
* [React]() - ReactJS
* [Redux]() - ReduxJS

## API Documentation

Navigate to `localhost:3001/api-docs` on your browser and select HTTP protocol to view/test Swagger API documentation


## API Routes

* [Signup] - POST http://localhost:3000/api/v1/users/signup
* [Signin] - POST http://localhost:3000/api/v1/users/signin
* [Signout] - POST http://localhost:3000/api/v1/users/signout
* [Create Recipe] - POST http://localhost:3000/api/v1/recipes
* [Modify Recipe] - PUT http://localhost:3000/api/v1/recipes/:recipeId
* [Delete Recipe] - DELETE http://localhost:3000/api/v1/recipes/:recipeId
* [Get Recipe and Update Count] - GET http://localhost:3000/api/v1/recipes/:recipeId
* [Fetch All Recipes] - GET http://localhost:3000/api/v1/recipes
* [Fetch Recipes by Most Upvotes] - GET http://localhost:3000/api/v1/recipes?sort=upvotes&order=ascending
* [Fetch My Recipes] - GET http://localhost:3000/api/v1/users/myRecipes
* [Post Recipe Review] - POST http://localhost:3000/api/v1/recipes/:recipeId/reviews
* [Fetch Recipe Reviews] - GET http://localhost:3000/api/v1/recipes/:recipeId/reviews
* [Add Recipe to Favorites] - POST http://localhost:3000/api/v1/users/:userId/recipes/:recipeId
* [Remove Recipe from Favorites] - DELETE http://localhost:3000/api/v1/users/:userId/recipes/:recipeId
* [Get Favaorite Recipes] - GET http://localhost:3000/api/v1/users/:userId/recipes
* [Upvote Recipe] - POST http://localhost:3000/api/v1/recipes/:recipeId/upvotes
* [Downvote Recipe] - POST http://localhost:3000/api/v1/recipes/:recipeId/downvotes
* [Get Upvote Recipe User List] - GET http://localhost:3000/api/v1/recipes/:recipeId/upvotes
* [Get Downvote Recipe User List] - GET http://localhost:3000/api/v1/recipes/:recipeId/downvotes


## Getting Started

* git clone https://github.com/larrystone/BC-26-More-Recipes.git
* Run `npm install` to install all packages
* Run `sequelize db:migrate` to run pending migrations
* Run `npm start` to start application
* Use localhost:3001 to access backend on POSTMAN
* Type localhost:3000 in browser to access client side

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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