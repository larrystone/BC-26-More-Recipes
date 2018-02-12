import jsonwebtoken from 'jsonwebtoken';
import { User, Recipe, Review } from '../models';

const users = [
  {
    name: 'Make Music',
    email: 'makemusic@gmail.com',
    username: 'makemusic',
    password: 'douglaspass',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'Emmanuel',
    email: 'goodluck@gmail.com',
    username: 'goodluck0901',
    password: 'luckgood',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];

const recipes = [
  {
    id: 1,
    name: 'Fried Rice',
    description: 'Just the way you like it',
    ingredients: 'salt;;water;;sugar',
    imageUrl: null,
    imageId: null,
    procedure: 'Put the rice on the water and start cooking yourself',
    viewCount: 0,
    upvotes: 0,
    downvotes: 0,
    userId: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 2,
    name: 'Jollof Rice',
    description: '',
    ingredients: 'salt;;maggi;;sugar',
    imageUrl: null,
    imageId: null,
    procedure: 'Put the rice on the water and start cooking yourself',
    viewCount: 0,
    upvotes: 0,
    downvotes: 0,
    userId: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const reviews = [
  {
    recipeId: 1,
    userId: 1,
    content: 'This is a test review 2',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    recipeId: 1,
    userId: 1,
    content: 'This is a test review 3',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    recipeId: 1,
    userId: 1,
    content: 'This is a test review 4',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    recipeId: 1,
    userId: 1,
    content: 'This is a test review 5',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

/**
 * @description Insert seed data in user model
 *
 * @returns {void} Nothing
 */
export const insertUserSeed = () => {
  User.bulkCreate(users);
};

/**
 * @description Insert seed data in recipe model
 *
 * @returns {void} Nothing
 */
export const insertRecipeSeed = () => {
  Recipe.bulkCreate(recipes);
};

/**
 * @description Insert seed data in reviews model
 *
 * @returns {void} Nothing
 */
export const inserReviewSeed = () => {
  Review.bulkCreate(reviews);
};

/**
 * @description Generates token from seed data
 *
 * @param {Number} id - User ID
 *
 * @param {string} username - Username
 *
 * @returns {string} token - Generated token
 */
const generateToken = (id, username) => {
  const { JWT_SECRET } = process.env;
  const token = jsonwebtoken.sign({
    id,
    username,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  }, JWT_SECRET);

  return token;
};

export const user1token = generateToken(1, users[0].username);

export const user2token = generateToken(2, users[1].username);

export const validUser = {
  name: 'lane stone',
  email: 'stonelarry@yahoo.com',
  username: 'stonexy',
  password: 'lanestone'
};

export const validRecipe = {
  name: 'Fried Rice',
  description: 'Just the way you like it',
  ingredients: 'salt;;water;;sugar',
  procedure: 'Put the rice on the water and start cooking yourself',
  userId: 1
};

export const recipeWithNoName = {
  name: '',
  description: 'Just the way you like it',
  ingredients: 'salt;;water;;sugar',
  procedure: 'Put the rice on the water and start cooking yourself',
  userId: 1
};

export const recipeWithNoIngredient = {
  name: 'Fried Rice',
  description: 'Just the way you like it',
  ingredients: '',
  procedure: 'Put the rice on the water and start cooking yourself',
  userId: 1
};

export const recipeWithNoProcedure = {
  name: 'Fried Rice',
  description: 'Just the way you like it',
  ingredients: 'salt;;water;;sugar',
  procedure: '',
  userId: 1
};

export const validReview = {
  content: 'I love this food',
  recipeId: 1,
  userId: 1,
};

export const reviewWithNoContent = {
  content: '',
  recipeId: 1,
  userId: 1
};

export const validVote = {
  recipeId: 1,
  userId: 1
};

export const validFavorite = {
  recipeId: 1,
  userId: 1
};

export const inValidRecipeId = {
  recipeId: 2,
  userId: 1
};

export const inValidUserId = {
  recipeId: 1,
  userId: 20
};

export const userWithNoEmail = {
  name: 'lane stone',
  username: 'larrystone',
  email: '',
  password: 'meansystem'
};

export const userWithNoName = {
  name: '',
  username: 'lanestone',
  email: 'larrystone@mail.com',
  password: 'meansystem'
};

export const userWithNoUsername = {
  name: 'lane stone',
  username: '',
  email: 'larrystone@mail.com',
  password: 'meansystem'
};
export const userWithNoPassword = {
  name: 'lane stone',
  username: 'larrystone',
  email: 'larrystone@yahoo.com',
  password: ''
};
export const duplicateUsername = {
  name: 'lane stone',
  email: 'stonelarry@gmail.com',
  username: 'stonexy',
  password: 'meansystem'
};

export const badEmail = {
  name: 'lane stone',
  email: 'larrystone@',
  username: 'larrystone',
  password: 'meansystem'
};

export const duplicateEmail = {
  name: 'lane stone',
  email: 'stonelarry@yahoo.com',
  username: 'spencer',
  password: 'meansystem'
};

export const checkPassword = {
  name: 'lane stone',
  email: 'grapes@fruits.com',
  username: 'grapejuice',
  password: 'grapejuiced800'
};
