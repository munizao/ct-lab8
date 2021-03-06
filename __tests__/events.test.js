require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Event = require('../lib/models/Event');
const Recipe = require('../lib/models/Recipe');

describe('event routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(async() => {
    await mongoose.connection.dropDatabase();
    return Recipe.create({
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
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an event', () => {
    const recipe = Recipe.findOne();
    return request(app)
      .post('/api/v1/events')
      .send({
        recipeId: recipe._id,
        dateOfEvent: Date.now(),
        notes: 'It went well',
        rating: 4
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe._id,
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });

  it('gets all events', async() => {
    const events = await Event.create([
      { recipeId: '1234', dateOfEvent: Date.now(), rating: 3 },
      { recipeId: '3456', dateOfEvent: Date.now(), rating: 2 },
      { recipeId: '2345', dateOfEvent: Date.now(), rating: 3 },
      { recipeId: '6544', dateOfEvent: Date.now(), rating: 5 },
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(event => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify(event)));
        });
      });
  });

  it('gets an event by id', async() => {
    const event = await Event.create({
      recipeId: '1234',
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .get(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: '1234',
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });

  it('updates an event by id', async() => {
    const event = await Event.create({
      recipeId: '1234',
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .patch(`/api/v1/events/${event._id}`)
      .send({ rating: 5 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: '1234',
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 5,
          __v: 0
        });
      });
  });

  it('deletes an event by id', async() => {
    const event = await Event.create({
      recipeId: '1234',
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .delete(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: '1234',
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });
});
