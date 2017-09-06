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
For this version, all html files and stylesheets, images, bootstrap are stored into the template directory

#### Client


#### Server
This directory holds all routes, controllers, middleware, migrations

# Testing
- install POSTMAN app
- run `npm start` then navigate to `localhost:3000` on POSTMAN

## Deployment


## Built With

* [ExpressJs](https://expressjs.com/) - The web framework used
* [Sequelize](http://docs.sequelizejs.com/) - The ORM used
* [Postgres](https://www.postgresql.org/) - Database Used
* [NPM](https://www.npmjs.com/) - Dependency Management

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

## Versioning

I used [Git](https://git-scm.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/larrystone/BC-26-More-Recipes.git).

## Getting Started

* git clone https://github.com/larrystone/BC-26-More-Recipes.git
* Run `npm install` to install all packages
* Run `sequelize db:migrate` to run pending migrations
* Run `npm start` to start application
* type localhost:3000 in browser to access application

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start:dev`

Starts app with nodemon watcher. Restarts app when changes are made to the source code

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run coveralls`

Launches the interactive test runner and display test coverage reports


## Author
* **Lawal Lanre E. (Larrystone)** -Aspiring Software Dev.

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Google Material Icons
* Materialise CSS
* Jquery
* Google Graph API