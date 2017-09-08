/** Validate user input for signup
 * @exports validateSignUp
 * @param  {string} name - Full Name
 * @param  {string} username - Username
 * @param  {string} email - Username
 * @param  {string} password - Username
 * @return {string} The status
 */
export const validateSignUp = (name, username, email, password) => {
  if (name.length < 6 || !name.includes(' ')) {
    return 'Enter a valid full name!';
  }

  if (username.length < 3) {
    return 'Username must contain at least 3 alphabets!';
  }

  if (!/\S{3,}@\S{2,}\.\S{2,}/.test(email)) {
    return 'Enter a valid email address';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters!';
  }

  return false;
};

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


export const validateRecipeId = (req, res, next) => {
  const recipeId = req.params.recipeId;

  if (isNaN(+recipeId)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid Recipe ID!' });
  }

  next();
};

export const validateReviewContent = (message) => {
  if (message.length < 5) {
    return 'Review message too short!';
  }
};
