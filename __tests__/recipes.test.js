require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Event = require('../lib/models/Event');

describe('recipe routes', () => {
  let recipe;
  let events;

  beforeAll(() => {
    connect();
  });

  beforeEach(async() => {
    await mongoose.connection.dropDatabase();
    recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    events = await Event.create([
      { recipe: recipe._id, dateOfEvent: Date.now(), rating: 3 },
      { recipe: recipe._id, dateOfEvent: Date.now(), rating: 2 },
      { recipe: recipe._id, dateOfEvent: Date.now(), rating: 3 },
      { recipe: recipe._id, dateOfEvent: Date.now(), rating: 5 }
    ]);
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        ingredients: [
          { name: 'flour', amount: 1, measurement: 'cup' }
        ],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          ingredients: [
            { _id: expect.any(String), name: 'flour', amount: 1, measurement: 'cup' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });

  it('gets recipes by ingredient', async() => {
    const flourRecipes = await Recipe.create([
      { name: 'cookies', directions: [], ingredients: [{ name:'flour', amount: 1, measurement: 'cup' }] },
      { name: 'cake', directions: [], ingredients: [{ name:'flour', amount: 1, measurement: 'cup' }] }
    ]);
    await Recipe.create([
      { name: 'fruit salad', directions: [], ingredients: [{ name:'apples', amount: 1, measurement: 'cup' }] },
      { name: 'mushroom soup', directions: [], ingredients: [{ name:'mushrooms', amount: 1, measurement: 'cup' }] }
    ]);
    return request(app)
      .get('/api/v1/recipes?ingredient=flour')
      .then(res => {
        flourRecipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });

  it('gets a recipe by id with all of its events', async() => {
    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        function compare_id(a, b) {
          if(a._id < b._id) return 1;
          if(a._id > b._id) return -1;
          return 0;
        }
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          ingredients: [
            { _id: expect.any(String), name: 'flour', amount: 1, measurement: 'cup' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          events: JSON.parse(JSON.stringify(events.sort(compare_id))),
          __v: 0
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'good cookies',
          ingredients: [
            { _id: expect.any(String), name: 'flour', amount: 1, measurement: 'cup' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        });
      });
  });

  it('deletes a recipe by id', async() => {
    return request(app)
      .delete(`/api/v1/recipes/${recipe._id}`)
      .then(async res => {
        const deletedEvents = await Event.find();
        expect(deletedEvents).toEqual([]);

        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          ingredients: [
            { _id: expect.any(String), name: 'flour', amount: 1, measurement: 'cup' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        });
      });
  });
});
