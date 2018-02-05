const data = {
  signUpresponse: {
    success: true,
    message: 'New user created/token generated!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjU1LCJlbWFpbCI6Imx' +
      'hbmVzdG9uZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InN0b25lIiwiaWF0IjoxNTE0NDc3' +
      'MDYxfQ.SykhWSvG8IVSvIYaMEkSWdaeaUkuWmnnJYrwqB-UVII'
  },
  signUpData: {
    name: 'lanestone yakov',
    username: 'lanestone1',
    email: 'lanestione@gmail.com',
    password: 'abcdefg'
  },
  userProfileResponse: {
    user: {
      userId: 98,
      name: 'lane stone emmanuel',
      username: 'lanestone1',
      email: 'lanestone1@gmail.com',
      imageUrl: '',
      myRecipes: 1,
      myReviews: 1,
      myFavs: 0
    }
  },
  signInResponse: {
    success: true,
    message: 'User Signed In/token generated!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjU1LCJlbWFpbCI6Imx' +
      'hbmVzdG9uZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InN0b25lIiwiaWF0IjoxNTE0NDc3' +
      'MDYxfQ.SykhWSvG8IVSvIYaMEkSWdaeaUkuWmnnJYrwqB-UVII'
  },
  signInData: {
    name: 'lanestone yakov',
    username: 'lanestone1',
    email: 'lanestione@gmail.com',
    password: 'abcdefg'
  },
  validFavoriteResponse: [{
    id: 1,
    name: 'Fried Rice',
    description: 'Just the way you like it',
    ingredients: 'salt;;water;;sugar',
    imageUrl: null,
    imageId: null,
    procedure: 'Put the rice on the water and start cooking yourself',
    viewCount: 1,
    upvotes: 0,
    downvotes: 0,
    userId: 1,
    createdAt: '2018-02-05T10:48:12.563Z',
    updatedAt: '2018-02-05T18:16:35.134Z',
    User: {
      name: 'lane stone'
    }
  }],
  validFavoriteAction: {
    1: {
      id: 1,
      name: 'Fried Rice',
      description: 'Just the way you like it',
      ingredients: 'salt;;water;;sugar',
      imageUrl: null,
      imageId: null,
      procedure: 'Put the rice on the water and start cooking yourself',
      viewCount: 1,
      upvotes: 0,
      downvotes: 0,
      userId: 1,
      createdAt: '2018-02-05T10:48:12.563Z',
      updatedAt: '2018-02-05T18:16:35.134Z',
      User: {
        name: 'lane stone'
      }
    }
  },
  modal: { type: 'create_edit_recipe' },
  validPagedRecipe: {
    pagination: {
      currentPage: 1,
      currentPageSize: 3,
      totalPages: 2,
      totalRecords: 5
    },
    recipes: {
      1: {
        id: 1,
        name: 'Fried Rice',
        description: 'Just the way you like it',
        ingredients: 'salt;;water;;sugar',
        imageUrl: null,
        imageId: null,
        procedure: 'Put the rice on the water and start cooking yourself',
        viewCount: 1,
        upvotes: 0,
        downvotes: 0,
        userId: 1,
        createdAt: '2018-02-05T10:48:12.563Z',
        updatedAt: '2018-02-05T18:16:35.134Z',
        User: {
          name: 'lane stone'
        }
      },
      2: {
        id: 2,
        name: 'test food',
        description: '',
        ingredients: 'djkf dibfdbifd fidfbd bpd;dpf 9',
        imageUrl: '',
        imageId: '',
        procedure: 'ibdpf9id dipbfdf ibpd9fdpib9db dgipu[hgodgd',
        viewCount: 0,
        upvotes: 0,
        downvotes: 0,
        userId: 4,
        createdAt: '2018-02-05T20:40:05.939Z',
        updatedAt: '2018-02-05T20:40:05.939Z',
        User: {
          name: 'lane stone'
        }
      },
      3: {
        id: 3,
        name: 'dfdfdf',
        description: '',
        ingredients: 'fdfdfdfsbdgsdb sbwrdsdgdgs',
        imageUrl: '',
        imageId: '',
        procedure: "ds dgsdgdsg sdpgns dg'odsp ng'l ;sd'op gsd",
        viewCount: 0,
        upvotes: 0,
        downvotes: 0,
        userId: 4,
        createdAt: '2018-02-05T20:40:18.449Z',
        updatedAt: '2018-02-05T20:40:18.449Z',
        User: {
          name: 'lane stone'
        }
      }
    }
  },
  validPagedRecipeResponse: {
    pagination: {
      currentPage: 1,
      currentPageSize: 3,
      totalPages: 2,
      totalRecords: 5
    },
    recipes: [{
      id: 1,
      name: 'Fried Rice',
      description: 'Just the way you like it',
      ingredients: 'salt;;water;;sugar',
      imageUrl: null,
      imageId: null,
      procedure: 'Put the rice on the water and start cooking yourself',
      viewCount: 1,
      upvotes: 0,
      downvotes: 0,
      userId: 1,
      createdAt: '2018-02-05T10:48:12.563Z',
      updatedAt: '2018-02-05T18:16:35.134Z',
      User: {
        name: 'lane stone'
      }
    },
    {
      id: 2,
      name: 'test food',
      description: '',
      ingredients: 'djkf dibfdbifd fidfbd bpd;dpf 9',
      imageUrl: '',
      imageId: '',
      procedure: 'ibdpf9id dipbfdf ibpd9fdpib9db dgipu[hgodgd',
      viewCount: 0,
      upvotes: 0,
      downvotes: 0,
      userId: 4,
      createdAt: '2018-02-05T20:40:05.939Z',
      updatedAt: '2018-02-05T20:40:05.939Z',
      User: {
        name: 'lane stone'
      }
    },
    {
      id: 3,
      name: 'dfdfdf',
      description: '',
      ingredients: 'fdfdfdfsbdgsdb sbwrdsdgdgs',
      imageUrl: '',
      imageId: '',
      procedure: "ds dgsdgdsg sdpgns dg'odsp ng'l ;sd'op gsd",
      viewCount: 0,
      upvotes: 0,
      downvotes: 0,
      userId: 4,
      createdAt: '2018-02-05T20:40:18.449Z',
      updatedAt: '2018-02-05T20:40:18.449Z',
      User: {
        name: 'lane stone'
      }
    }
    ]
  },
  validCurrentRecipe: {
    id: 1,
    name: 'Fried Rice',
    description: 'Just the way you like it',
    ingredients: 'salt;;water;;sugar',
    imageUrl: null,
    imageId: null,
    procedure: 'Put the rice on the water and start cooking yourself',
    viewCount: 1,
    upvotes: 0,
    downvotes: 0,
    userId: 1,
    createdAt: '2018-02-05T10:48:12.563Z',
    updatedAt: '2018-02-05T18:16:35.134Z',
    User: {
      name: 'lane stone'
    }
  },
  validCurrentRecipeResponse: {
    recipe: {
      id: 1,
      name: 'Fried Rice',
      description: 'Just the way you like it',
      ingredients: 'salt;;water;;sugar',
      imageUrl: null,
      imageId: null,
      procedure: 'Put the rice on the water and start cooking yourself',
      viewCount: 1,
      upvotes: 0,
      downvotes: 0,
      userId: 1,
      createdAt: '2018-02-05T10:48:12.563Z',
      updatedAt: '2018-02-05T18:16:35.134Z',
      User: {
        name: 'lane stone'
      }
    }
  },
  validNewRecipe: {
    id: 4,
    name: 'Jollof Rice',
    description: 'Just the way you like it',
    ingredients: 'salt;;water;;sugar',
    imageUrl: null,
    imageId: null,
    procedure: 'Put the rice on the water and start cooking yourself',
    viewCount: 1,
    upvotes: 0,
    downvotes: 0,
    userId: 1,
    createdAt: '2018-02-05T10:48:12.563Z',
    updatedAt: '2018-02-05T18:16:35.134Z',
    User: {
      name: 'lane stone'
    }
  },
  validEditRecipe: {
    id: 3,
    name: 'Ewa Agoin',
    description: 'Just the way you like it',
    ingredients: 'salt;;water;;sugar',
    imageUrl: null,
    imageId: null,
    procedure: 'Put the rice on the water and start cooking yourself',
    viewCount: 1,
    upvotes: 0,
    downvotes: 0,
    userId: 1,
    createdAt: '2018-02-05T10:48:12.563Z',
    updatedAt: '2018-02-05T18:16:35.134Z',
    User: {
      name: 'lane stone'
    }
  },
  validReviews: [
    {
      id: 2,
      content: 'writing tests is fun',
      recipeId: 1,
      userId: 4,
      createdAt: '2018-02-05T21:43:11.533Z',
      updatedAt: '2018-02-05T21:43:11.533Z',
      User: {
        name: 'lane stone',
        imageUrl: ''
      }
    },
    {
      id: 1,
      content: 'i love this app',
      recipeId: 1,
      userId: 4,
      createdAt: '2018-02-05T21:42:58.388Z',
      updatedAt: '2018-02-05T21:42:58.388Z',
      User: {
        name: 'lane stone',
        imageUrl: ''
      }
    }
  ],

  validReviewsResponse: {
    reviews:
      [
        {
          id: 2,
          content: 'writing tests is fun',
          recipeId: 1,
          userId: 4,
          createdAt: '2018-02-05T21:43:11.533Z',
          updatedAt: '2018-02-05T21:43:11.533Z',
          User: {
            name: 'lane stone',
            imageUrl: ''
          }
        },
        {
          id: 1,
          content: 'i love this app',
          recipeId: 1,
          userId: 4,
          createdAt: '2018-02-05T21:42:58.388Z',
          updatedAt: '2018-02-05T21:42:58.388Z',
          User: {
            name: 'lane stone',
            imageUrl: ''
          }
        }
      ]
  },
  validNewReview: {
    id: 3,
    content: 'This is a new review by me',
    createdAt: '2018-02-05T21:44:44.074Z',
    User: {
      name: 'lane stone',
      imageUrl: ''
    }
  },
  validNewReviewResponse: {
    createdReview: {
      id: 3,
      content: 'This is a new review by me',
      createdAt: '2018-02-05T21:44:44.074Z',
      User: {
        name: 'lane stone',
        imageUrl: ''
      }
    }
  }
};

export default data;
