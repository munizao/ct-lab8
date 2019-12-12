const mongoose = require('mongoose');
const Event = require('./Event');
const Recipe = require('./Recipe');

describe('Event model', () => {
  it('has a required recipe', () => {
    const event = new Event();
    const { errors } = event.validateSync();

    expect(errors.recipe.message).toEqual('Path `recipe` is required.');
  });

  it('has a required dateOfEvent', () => {
    const event = new Event();
    const { errors } = event.validateSync();

    expect(errors.dateOfEvent.message).toEqual('Path `dateOfEvent` is required.');
  });

  it('has a required rating', () => {
    const event = new Event();
    const { errors } = event.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });

  it('has a rating 0 or above', () => {
    const event = new Event({
      rating: -1
    });
    const { errors } = event.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` (-1) is less than minimum allowed value (0).');
  });

  it('has a rating 5 or below', () => {
    const event = new Event({
      rating: 6
    });
    const { errors } = event.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` (6) is more than maximum allowed value (5).');
  });

  const recipe = new Recipe({
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

  const eventForDateTests = new Event({
    rating: 3,
    dateOfEvent: new Date(1974, 6, 2, 17, 0),
    recipe: recipe
  });

  it('can get day of month from virtual field', () => {
    expect(eventForDateTests.day).toEqual(2);
  });

  it('can get month from virtual field', () => {
    expect(eventForDateTests.month).toEqual(6);
  });

  it('can get year from virtual field', () => {
    expect(eventForDateTests.year).toEqual(1974);
  });

  it('can set day of month from virtual field', () => {
    eventForDateTests.day = 14;
    expect(eventForDateTests.day).toEqual(14);
  });

  it('can set month from virtual field', () => {
    eventForDateTests.month = 6;
    expect(eventForDateTests.month).toEqual(6);
  });

  it('can set year from virtual field', () => {
    eventForDateTests.year = 1982;
    expect(eventForDateTests.year).toEqual(1982);
  });

});
