/** Validate user input for signup
 * @exports validateSignUp
 * @param  {string} name - Full Name
 * @param  {string} username - Username
 * @param  {string} email - Username
 * @param  {string} password - Username
 * @return {string} The status
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

/** Validate user ID on protected routes
 * @exports validateUserId
 * @param  {string} userId - User ID
 * @return {string} The status
 */
export const validateUserId = (userId) => {
  if (isNaN(+userId)) {
    return 'Invalid User ID!';
  }

  return false;
};

/** Validate user input for recipe
 * @exports validateRecipeDetails
 * @param  {string} name - Recipe Name
 * @param  {string} ingredients - Recipe Ingredients
 * @param  {string} direction - Recipe directioins
 * @return {string} The status
 */
export const validateRecipeDetails = (name, ingredients, direction) => {
  if (name.length < 3) {
    return 'Enter a valid recipe name!';
  }

  if (ingredients.length < 10) {
    return 'Enter a valid list of ingredients!';
  }

  if (direction.length < 15) {
    return 'Explain the directions clearly please!';
  }
};

/** Validate user input for review on recipe
 * @exports validateReviewContent
 * @param  {string} message - Recipe review message
 * @return {string} The status
 */
export const validateReviewContent = (message) => {
  if (message.length < 5) {
    return 'Review message too short!';
  }
};

/** Validate recipe ID on protected routes
 * @exports validateRecipeId
 * @param  {object} req - Request
 * @param  {object} res - Response
 * @param  {function} next - Next controller
 * @return {object} The status/next()
 */
export const validateRecipeId = (req, res, next) => {
  const recipeId = req.params.recipeId;

  if (isNaN(+recipeId)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid Recipe ID!' });
  }

  next();
};

