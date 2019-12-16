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

schema.virtual('day').set(function(value) {
  return this.dateOfEvent.setDate(value);
});

schema.virtual('month').set(function(value) {
  return this.dateOfEvent.setMonth(value);
});

schema.virtual('year').set(function(value) {
  return this.dateOfEvent.setFullYear(value);
});

module.exports = mongoose.model('Event', schema);
