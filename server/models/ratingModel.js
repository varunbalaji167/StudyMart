const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rating", ratingSchema);