const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  tag: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);