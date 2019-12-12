const { Router } = require('express');
const Event = require('../models/Event');

module.exports = Router()
  .post('/', (req, res) => {
    Event
      .create(req.body)
      .then(event => res.send(event));
  })

  .get('/', (req, res) => {
    const ingredient = req.query.ingredient;
    if(ingredient) {
      Event
        .find({ ingredients: { name: ingredient } })
        .then(events => res.send(events));
    }
    else {
      Event
        .find()
        .select({ notes: false })
        .then(events => res.send(events));
    }
  })

  .get('/:id', (req, res) => {
    Event
      .findById(req.params.id)
      .populate('recipe')
      .then(event => res.send(event));
  })

  .patch('/:id', (req, res) => {
    Event
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(event => res.send(event));
  })

  .delete('/:id', (req, res) => {
    Event
      .findByIdAndDelete(req.params.id)
      .then(event => res.send(event));
  });
