import { Recipe } from '../models';
import trimWhiteSpaces from '../services/trimWhiteSpaces';

/**
 * @description - Validate user input for signup
 *
 * @exports validateSignUp
 *
 * @param  {string} name - Full Name
 *
 * @param  {string} username - Username
 *
 * @param  {string} email - Username
 *
 * @param  {string} password - Username
 *
 * @return {string} status - The status
 */
export const validateSignUp = (name, username, email, password) => {
  const pattern = /\S{3,}@\S{2,}\.\S{2,}/;
  if (name.length < 6 || !name.includes(' ')) {
    return 'Enter a valid full name!';
  }

  if (username.length < 3) {
    return 'Username must contain at least 3 alphabets!';
  }

  if (!pattern.test(email)) {
    return 'Enter a valid email address';
  }

  if (password.trim().length === 0 || password.length < 6) {
    return 'Password must be at least 6 characters!';
  }

  return false;
};

/**
 * @description - Validate an ID to be sure its a valid  number
 *
 * @exports validateId
 *
 * @param  {string} id - ID
 *
 * @return {string} status - The status
 */
export const validateId = (id) => {
  if (isNaN(Number(id))) {
    return 'Invalid';
  }

  return 'Valid';
};

/**
 * @description - Validate user input for recipe
 *
 * @exports validateRecipeDetails
 *
 * @param  {string} name - Recipe Name
 *
 * @param  {string} ingredients - Recipe Ingredients
 *
 * @param  {string} direction - Recipe directioins
 *
 * @return {string} message - Validation error message
 */
export const validateRecipeDetails = (name, ingredients, direction) => {
  if (name.length < 3) {
    return 'Enter a valid recipe name!';
  }

  if (ingredients.length < 10) {
    return 'Enter a valid list of ingredients!';
  }

  if (direction.length < 15) {
    return 'Explain the procedures clearly please!';
  }
};

/**
 * @description - Validate user input for review on recipe
 *
 * @exports validateReviewContent
 *
 * @param  {string} message - Recipe review message
 *
 * @return {string} message - Validation error message
 */
export const validateReviewContent = (message) => {
  if (message.length < 5) {
    return 'Review message too short!';
  }
};

/**
 * @description - Validate recipe ID on protected routes
 *
 * @exports validateRecipeId
 *
 * @param  {object} req - HTTP Request
 *
 * @param  {object} res - HTTP Response
 *
 * @param  {function} next - HTTP Next function
 *
 * @return {object} response - HTTP response
 */
export const validateRecipeId = ({ params }, res, next) => {
  const isValid = validateId(params.recipeId);
  if (isValid === 'Invalid') {
    return res.status(422).json({
      success: false,
      message: `${isValid} Recipe ID`
    });
  }
  next();
};

/**
 * @description - Validates the user ID
 *
 * @param {object} req - HTTP request
 *
 * @param {object} res - HTTP response
 *
 * @param {object} next - HTTP next function
 *
 * @returns {object} response - HTTP response
 */
export const validateUserId = ({ params }, res, next) => {
  const isValid = validateId(params.userId);
  if (isValid === 'Invalid') {
    return res.status(401).json({
      success: false,
      message: `${isValid} User ID!`
    });
  }
  next();
};

/**
 * @description - Checks if a recipe exists in the database
 *
 * @param {object} req -  HTTP request
 *
 * @param {object} res - HTTP response
 *
 * @param {function} next - HTTP next function
 *
 * @returns {object} response - Status of request
 */
export const validateRecipeExist = ({ params }, res, next) => {
  const { recipeId } = params;

  Recipe
    .findById(recipeId)
    .then((recipe) => {
      if (recipe) {
        next();
      } else {
        res.status(404).json({
          success: false,
          message: 'Recipe does not exist!'
        });
      }
    });
};

/**
 * @description - Validate the username if taken
 *
 * @param {object} User - User model
 *
 * @param {string} username - User name
 *
 * @param {number} userId - User ID
 *
 * @returns {Promise} promise - Request status
 */
export const validateUserName = (User, username, userId) => {
  const promise = new Promise((resolve, reject) => {
    User
      .findOne({
        where: {
          username: {
            $iLike: trimWhiteSpaces(username)
          },
          id: {
            $ne: Number(userId)
          }
        },
        attributes: ['id']
      })
      .then((userFound) => {
        if (!userFound) {
          resolve();
        } else {
          reject({
            status: 409,
            message: 'Username already taken'
          });
        }
      });
  });
  return promise;
};

/**
 * @description - Validate if user has the right to manage recipe
 *
 * @param {any} recipeId - Recipe ID
 *
 * @param {any} userId - User ID
 *
 * @returns {Promise} promise - Status of request
 */
export const validateUserRight = (recipeId, userId) => {
  const promise = new Promise((resolve, reject) => {
    Recipe
      .findById(recipeId)
      .then((recipeFound) => {
        if (Number(recipeFound.userId) !== Number(userId)) {
          reject({
            status: 401,
            message: 'You cannot modify a recipe not created by You!'
          });
        }
        resolve(recipeFound);
      });
  });
  return promise;
};
