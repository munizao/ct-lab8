const mongoose = require('mongoose');
const Recipe = require('./Recipe');

describe('Recipe model', () => {

  it('has a required name', () => {
    const recipe = new Recipe();
    const { errors } = recipe.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });


  const cookieRecipe = new Recipe({
    name: 'Cookies',
    ingredients: [
      { name: 'flour', amount: 1, measurement: 'cup' }
    ],
    directions: [
      'preheat oven to 375',
      'mix ingredients',
      'put dough on cookie sheet',
      'bake for 10 minutes'
    ]
  });
  it('has a name and directions field', () => {
    expect(cookieRecipe.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Cookies',
      ingredients: [
        { _id: expect.any(mongoose.Types.ObjectId), name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });
});
