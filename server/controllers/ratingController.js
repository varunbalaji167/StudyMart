const mongoose = require("mongoose");
const Rating = require("../models/ratingModel");
const Request = require("../models/requestModel");
const Item = require("../models/itemModel");
const User = require("../models/userModel"); 

const createRating = async (req, res) => {
  try {
    const { toUserId, itemId, rating, review } = req.body;
    const fromUserId = req.user?._id || req.userId;

    if (!fromUserId || !toUserId || !itemId || rating == null) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    if (fromUserId.toString() === toUserId.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot rate yourself." });
    }

    const fromObjectId = new mongoose.Types.ObjectId(fromUserId);
    const toObjectId = new mongoose.Types.ObjectId(toUserId);
    const itemObjectId = new mongoose.Types.ObjectId(itemId);

    const item = await Item.findById(itemObjectId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found." });
    }

    if (item.user.toString() !== toUserId.toString()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "This item was not owned by the user you're trying to rate.",
        });
    }

    const completedRequest = await Request.findOne({
      item: itemObjectId,
      requester: fromObjectId,
      status: "Accepted",
    });

    if (!completedRequest) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No accepted request found for this item.",
        });
    }

    const existingRating = await Rating.findOne({
      fromUser: fromObjectId,
      toUser: toObjectId,
      item: itemObjectId,
    });

    if (existingRating) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already rated this user for this item.",
        });
    }

    const newRating = new Rating({
      fromUser: fromObjectId,
      toUser: toObjectId,
      item: itemObjectId,
      rating,
      review,
    });

    await newRating.save();

    const toUser = await User.findById(toObjectId);
    toUser.ratingsReceived.push({
      reviewer: fromObjectId,
      rating,
      review,
    });

    const allRatings = toUser.ratingsReceived.map((r) => r.rating);
    const avgRating =
      allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
    toUser.sustainabilityScore = Math.round(avgRating * 20); // e.g., 5 stars → 100 score

    await toUser.save();

    completedRequest.rated = true;
    await completedRequest.save();

    return res.status(201).json({ success: true, data: newRating });
  } catch (error) {
    console.error("🔴 createRating Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ toUser: userId }).populate(
      "fromUser",
      "email"
    );

    const avgRating =
      ratings.length === 0
        ? 0
        : ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

    res.json({ success: true, data: { ratings, avgRating } });
  } catch (err) {
    console.error("🔴 getUserRatings Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = {
  createRating,
  getUserRatings,
};
