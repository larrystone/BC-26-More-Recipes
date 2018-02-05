import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import {
  upvote,
  downvote,
} from '../../src/actions/voteActions';
import {
  UPVOTE, DOWNVOTE
} from '../../src/constants';

const middlewares = [thunk];

const url = '/api/v1/recipes';

const mockStore = configureMockStore(middlewares);

describe('Vote actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('upvote recipe', async (done) => {
    const recipe = { upvotes: 1, downvotes: 0 };
    moxios.stubRequest(`${url}/11/upvotes`, {
      status: 201,
      response: {
        recipe
      }
    });
    const expectedActions = [{
      type: UPVOTE,
      recipe
    }];
    const store = mockStore({});
    await store.dispatch(upvote(11))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('downvote recipe', async (done) => {
    const recipe = { upvotes: 1, downvotes: 0 };
    moxios.stubRequest(`${url}/12/downvotes`, {
      status: 201,
      response: {
        recipe
      }
    });
    const expectedActions = [{
      type: DOWNVOTE,
      recipe
    }];
    const store = mockStore({});
    await store.dispatch(downvote(12))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });
});
