import trimWhiteSpaces from '../services/trimWhiteSpaces';

/**
 * @description - Validate if text is too long
 *
 * @exports validateSignUp
 *
 * @param  {string} text - text
 *
 * @param  {Number} maxLength - maximum length
 *
 * @return {boolean} status - The status
 */
const isTextTooLong = (text, maxLength) => text.length > maxLength;

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
export const validateSignUp = ({
  name = '',
  username = '',
  email = '',
  password = ''
}) => {
  const pattern = /\S{3,}@\S{2,}\.\S{2,}/;
  const errors = [];
  if (name.length < 3 || isTextTooLong(name, 100)) {
    errors.push('* Name must be between 3 to 100 characters!');
  }

  if (username.length < 3 || isTextTooLong(username, 50)) {
    errors.push('<br/>* Username must be between 3 to 50 characters!');
  }

  if (!pattern.test(email)) {
    errors.push('<br/>* Enter a valid email address');
  } else if (isTextTooLong(email, 50)) {
    errors.push('<br/>* Email address too long!');
  }

  if (password.trim().length === 0
    || password.length < 6 || isTextTooLong(password, 50)) {
    errors.push('<br/>* Password must be between 6 to 50 characters!');
  }

  return errors;
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
 * @description - Validate user input for recipe
 *
 * @exports validateRecipeDetails
 *
 * @param  {string} name - Recipe Name
 *
 * @param  {string} ingredients - Recipe Ingredients
 *
 * @param  {string} procedure - Recipe directioins
 *
 * @return {string} message - Validation error message
 */
export const validateRecipeDetails = ({ name, ingredients, procedure }) => {
  const errors = [];
  if (name.length < 3 || isTextTooLong(name, 100)) {
    errors.push('* Recipe name must be between 3 to 100 characters!');
  }

  if (ingredients.length < 10 || isTextTooLong(procedure, 2000)) {
    errors
      .push('<br/>* Ingredients list must be between 10 to 2000 characters!');
  }

  if (procedure.length < 15 || isTextTooLong(procedure, 4000)) {
    errors.push('<br/>* Procedures must be between 15 to 4000 characters!');
  }

  return errors;
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
  if (message.length < 3 || isTextTooLong(message, 4000)) {
    return 'Review message must be between 3 to 4000 characters!';
  }
};

