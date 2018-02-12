import expect from 'expect';
import _ from 'lodash';
import Recipe from '../../src/reducers/recipe';
import mockData from '../../__mocks__/mockData';

describe('Recipe Reducer', () => {
  const {
    validPagedRecipe,
    validCurrentRecipe,
    validNewRecipe,
    validEditRecipe
  } = mockData;
  describe('SET_PAGED_RECIPE', () => {
    it('set allRecipes with provided data', () => {
      const initialState = {
        allRecipes: {
          recipes: {},
          pagination: {}
        },
        myRecipes: {
          recipes: {},
          pagination: {}
        },
        currentRecipe: {}
      };
      const action = {
        type: 'SET_PAGED_RECIPE',
        recipes: validPagedRecipe
      };
      const newState = Recipe(initialState, action);
      expect(newState.allRecipes).toEqual(validPagedRecipe);
    });
  });

  describe('SET_MY_RECIPES', () => {
    it('set myRecipes with provided data', () => {
      const initialState = {
        allRecipes: {
          recipes: {},
          pagination: {}
        },
        myRecipes: {
          recipes: {},
          pagination: {}
        },
        currentRecipe: {}
      };
      const action = {
        type: 'SET_MY_RECIPES',
        recipes: validPagedRecipe
      };
      const newState = Recipe(initialState, action);
      expect(newState.myRecipes).toEqual(validPagedRecipe);
    });
  });


  describe('SET_CURRENT_RECIPE', () => {
    it('set currentRecipe with provided data', () => {
      const initialState = {
        allRecipes: {
          recipes: {},
          pagination: {}
        },
        myRecipes: {
          recipes: {},
          pagination: {}
        },
        currentRecipe: {}
      };
      const action = {
        type: 'SET_CURRENT_RECIPE',
        recipe: validCurrentRecipe
      };
      const newState = Recipe(initialState, action);
      expect(newState.currentRecipe).toEqual(validCurrentRecipe);
    });
  });

  describe('DELETE_RECIPE', () => {
    it('remove recipe from user recipes', () => {
      const { id } = validCurrentRecipe;
      const initialState = {
        allRecipes: {
          recipes: {},
          pagination: {}
        },
        myRecipes: validPagedRecipe,
        currentRecipe: validCurrentRecipe
      };
      const action = {
        type: 'DELETE_RECIPE',
        id
      };
      const newState = Recipe(initialState, action);
      expect(newState.myRecipes[id]).toEqual(undefined);
      expect(_.size(newState.myRecipes.recipes)).toEqual(2);
      expect(newState.myRecipes.pagination.totalRecords)
        .toEqual(validPagedRecipe.pagination.totalRecords - 1);
      expect(newState.myRecipes[id - 1]).toEqual(validPagedRecipe[id - 1]);
      expect(newState.myRecipes[id + 1]).toEqual(validPagedRecipe[id + 1]);
    });
  });

  describe('UPVOTE', () => {
    it('set upvote and downvote counts from provided data', () => {
      const initialState = {
        allRecipes: {
          recipes: {},
          pagination: {}
        },
        myRecipes: validPagedRecipe,
        currentRecipe: {}
      };
      const action = {
        type: 'UPVOTE',
        recipe: {
          upvotes: 1,
          downvotes: 0
        }
      };
      const newState = Recipe(initialState, action);
      expect(newState.currentRecipe.upvotes).toEqual(action.recipe.upvotes);
      expect(newState.currentRecipe.downvotes).toEqual(action.recipe.downvotes);
    });
  });

  describe('DOWNVOTE', () => {
    it('set upvote and downvote counts from provided data', () => {
      const initialState = {
        allRecipes: {
          recipes: {},
          pagination: {}
        },
        myRecipes: validPagedRecipe,
        currentRecipe: {}
      };
      const action = {
        type: 'DOWNVOTE',
        recipe: {
          upvotes: 0,
          downvotes: 1
        }
      };
      const newState = Recipe(initialState, action);
      expect(newState.currentRecipe.upvotes).toEqual(action.recipe.upvotes);
      expect(newState.currentRecipe.downvotes).toEqual(action.recipe.downvotes);
    });
  });

  describe('ADD_RECIPE', () => {
    it('add recipe to myRecipes', () => {
      const initialState = {
        allRecipes: {
          recipes: {},
          pagination: {}
        },
        myRecipes: validPagedRecipe,
        currentRecipe: {}
      };
      const action = {
        type: 'ADD_RECIPE',
        recipe: validNewRecipe
      };
      const newState = Recipe(initialState, action);
      expect(_.size(newState.myRecipes.recipes)).toEqual(4);
      expect(newState.myRecipes.pagination.totalRecords)
        .toEqual(validPagedRecipe.pagination.totalRecords + 1);
      expect(newState.myRecipes.recipes[1])
        .toEqual(validPagedRecipe.recipes[1]);
      expect(newState.myRecipes.recipes[2])
        .toEqual(validPagedRecipe.recipes[2]);
      expect(newState.myRecipes.recipes[3])
        .toEqual(validPagedRecipe.recipes[3]);
      expect(newState.myRecipes.recipes[4])
        .toEqual(validNewRecipe);
    });
  });

  describe('EDIT_RECIPE', () => {
    it('edit recipe within myRecipes', () => {
      const initialState = {
        allRecipes: {
          recipes: {},
          pagination: {}
        },
        myRecipes: validPagedRecipe,
        currentRecipe: {}
      };
      const action = {
        type: 'EDIT_RECIPE',
        recipe: validEditRecipe
      };
      const newState = Recipe(initialState, action);
      expect(_.size(newState.myRecipes.recipes)).toEqual(3);
      expect(newState.myRecipes.pagination.totalRecords)
        .toEqual(validPagedRecipe.pagination.totalRecords);
      expect(newState.myRecipes.recipes[1])
        .toEqual(validPagedRecipe.recipes[1]);
      expect(newState.myRecipes.recipes[2])
        .toEqual(validPagedRecipe.recipes[2]);
      expect(newState.myRecipes.recipes[3])
        .toEqual(validEditRecipe);
    });
  });

  describe('Edge cases', () => {
    it('return default state when invalid action type provided',
      () => {
        const initialState = {
          allRecipes: {
            recipes: {},
            pagination: {}
          },
          myRecipes: validPagedRecipe,
          currentRecipe: {}
        };
        const action = {
          type: 'RECIPE_EDIT',
          recipe: validEditRecipe
        };
        const newState = Recipe(initialState, action);
        expect(newState).toEqual(initialState);
      });


    it('set and use default state when no initial state data is provided',
      () => {
        const action = {
          type: 'SET_CURRENT_RECIPE',
          recipe: validCurrentRecipe
        };
        const newState = Recipe(undefined, action);
        expect(newState).toEqual({
          allRecipes: {
            recipes: {},
            pagination: {}
          },
          myRecipes: {
            recipes: {},
            pagination: {}
          },
          currentRecipe: validCurrentRecipe
        });
      });
  });
});
