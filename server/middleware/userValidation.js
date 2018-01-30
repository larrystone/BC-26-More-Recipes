import { Recipe } from '../models';
import trimWhiteSpaces from '../services/trimWhiteSpaces';

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
 * @param {string} recipeId - Recipe ID
 *
 * @param {string} userId - User ID
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
