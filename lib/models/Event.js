const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  dateOfEvent: {
    type: Date,
    required: true
  },
  notes: String,
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
});

schema.virtual('day').get(function() {
  return this.dateOfEvent.getDate();
});

schema.virtual('month').get(function() {
  return this.dateOfEvent.getMonth();
});

schema.virtual('year').get(function() {
  return this.dateOfEvent.getFullYear();
});

module.exports = mongoose.model('Event', schema);
