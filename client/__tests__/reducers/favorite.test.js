import expect from 'expect';
import Favorite from '../../src/reducers/favorite';
import mockData from '../../__mocks__/mockData';

describe('Favorite Reducer', () => {
  const { validFavoriteAction } = mockData;
  describe('SET_MY_FAVS', () => {
    it('set user favorite recipes with provided data', () => {
      const initialState = {
        myFavorites: {},
        isFav: false
      };
      const action = {
        type: 'SET_MY_FAVS',
        recipes: validFavoriteAction
      };
      const newState = Favorite(initialState, action);
      expect(newState.myFavorites).toEqual(validFavoriteAction);
    });
  });

  describe('SET_IS_FAV', () => {
    it('set isFav boolean value from provided data', () => {
      const initialState = {
        myFavorites: {},
        isFav: false
      };
      const action = {
        type: 'SET_IS_FAV',
        isFav: true
      };
      const newState = Favorite(initialState, action);
      expect(newState.isFav).toEqual(true);
    });
  });

  describe('REMOVE_FAV', () => {
    it('remove user favorite recipe', () => {
      const initialState = {
        myFavorites: validFavoriteAction,
        isFav: false
      };
      const action = {
        type: 'REMOVE_FAV',
        id: validFavoriteAction[1].id
      };
      const newState = Favorite(initialState, action);
      expect(newState.myFavorites).toEqual({});
    });
  });

  describe('DELETE_RECIPE', () => {
    it('remove user favorite recipe when recipe is deleted',
      () => {
        const initialState = {
          myFavorites: validFavoriteAction,
          isFav: false
        };
        const action = {
          type: 'DELETE_RECIPE',
          id: validFavoriteAction[1].id
        };
        const newState = Favorite(initialState, action);
        expect(newState.myFavorites).toEqual({});
      });
  });

  describe('Edge Cases', () => {
    it('return default state when no valid action provided',
      () => {
        const initialState = {
          myFavorites: validFavoriteAction,
          isFav: true
        };
        const action = {
          type: 'RECIPE_PEE',
          id: validFavoriteAction[1].id
        };
        const newState = Favorite(initialState, action);
        expect(newState.myFavorites).toEqual(initialState.myFavorites);
        expect(newState.isFav).toEqual(initialState.isFav);
      });

    it('set and return initial state when no state data provided',
      () => {
        const action = {
          type: 'DELETE_RECIPE',
          id: validFavoriteAction[1].id
        };
        const newState = Favorite(undefined, action);
        expect(newState).toEqual({
          myFavorites: {},
          isFav: false
        });
      });
  });
});
