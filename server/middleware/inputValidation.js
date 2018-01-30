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
  if (name.length < 6 || !name.includes(' ')) {
    errors.push('* Enter a valid full name!');
  } else if (isTextTooLong(name, 100)) {
    errors.push('* Name too long!');
  }

  if (username.length < 3) {
    errors.push('<br/>* Username must contain at least 3 alphabets!');
  } else if (isTextTooLong(username, 50)) {
    errors.push('<br/>* Username too long!');
  }

  if (!pattern.test(email)) {
    errors.push('<br/>* Enter a valid email address');
  } else if (isTextTooLong(email, 50)) {
    errors.push('<br/>* Email address too long!');
  }

  if (password.trim().length === 0 || password.length < 6) {
    errors.push('<br/>* Password must be at least 6 characters!');
  } else if (isTextTooLong(password, 50)) {
    errors.push('<br/>* Password too long!');
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
  if (name.length < 3) {
    errors.push('* Enter a valid recipe name!');
  } else if (isTextTooLong(name, 100)) {
    errors.push('* Recipe name is too long!');
  }

  if (ingredients.length < 10) {
    errors.push('<br/>* Enter a valid list of ingredients!');
  } else if (isTextTooLong(procedure, 2000)) {
    errors.push('<br/>* Ingredients list is too long!');
  }

  if (procedure.length < 15) {
    errors.push('<br/>* Explain the procedures clearly please!');
  } else if (isTextTooLong(procedure, 4000)) {
    errors.push('<br/>* Name too long!');
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
  if (message.length < 5) {
    return 'Review message too short!';
  } else if (isTextTooLong(message, 4000)) {
    return 'Review message too long!';
  }
};

