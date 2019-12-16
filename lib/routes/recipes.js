const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Event = require('../models/Event');

module.exports = Router()
  .post('/', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })

  .get('/', (req, res) => {
    Recipe
      .find()
      .select({ name: true })
      .then(recipes => res.send(recipes));
  })

  .get('/:id', (req, res) => {
    Recipe.findById(req.params.id)
      .populate('events')
      .then(recipe => {
        function compare_id(a, b) {
          if(a._id < b._id) return 1;
          if(a._id > b._id) return -1;
          return 0;
        }
        recipe.events.sort(compare_id);
        return res.send(recipe);
      });
  })

  .patch('/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })

  .delete('/:id', async(req, res) => {
    await Event.deleteMany({ recipe: req.params.id });
    Recipe.findByIdAndDelete(req.params.id)
      .then(recipe => res.send(recipe));
  });
