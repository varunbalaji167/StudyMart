const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes your user model is 'User'
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  category: {
    type: String,
    enum: ['Textbooks', 'Labkits', 'Stationery'],
    required: true,
  },

  exchangeType: {
    type: String,
    enum: ['Donate', 'Swap'],
    required: true,
  },

  courseCode: {
    type: String,
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  condition: {
    type: String,
    enum: ['New', 'Good', 'Used', 'Worn'],
    required: true,
  },

  images: [{
    url: String,
    public_id: String,
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
  type: String,
  enum: ['Available', 'Claimed', 'Hidden'],
  default: 'Available'
},

  moderated: {
    type: Boolean,
    default: false, // can be auto-approved later
  }
});


module.exports = mongoose.model('Item', itemSchema);