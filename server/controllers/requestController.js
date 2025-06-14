// controllers/requestController.js
const Request = require("../models/requestModel");
const Item = require("../models/itemModel");
const Rating = require("../models/ratingModel");

const createRequest = async (req, res) => {
  try {
    const { itemId } = req.body;
    const requesterId = req.user._id;

    const item = await Item.findById(itemId);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    if (item.user.equals(requesterId)) {
      return res
        .status(400)
        .json({ success: false, message: "You can't request your own item" });
    }

    const existingRequest = await Request.findOne({
      item: itemId,
      requester: requesterId,
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "You already requested this item" });
    }

    const newRequest = new Request({
      item: itemId,
      requester: requesterId,
      type: item.exchangeType,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json({ success: true, data: savedRequest });
  } catch (err) {
    console.error("🔴 createRequest Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Request.find()
      .populate({
        path: "item",
        match: { user: userId },
      })
      .populate("requester", "email");

    const filtered = requests.filter((r) => r.item !== null);
    res.json({ success: true, data: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // 'Accepted', 'Rejected', 'Completed'

    const request = await Request.findById(requestId).populate("item");
    if (!request || !["Accepted", "Rejected", "Completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request or status" });
    }

    if (!request.item.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    if (status === "Accepted") {
      await Item.findByIdAndUpdate(request.item._id, { status: "Claimed" });
    }

    if (status === "Completed") {
      await Item.findByIdAndUpdate(request.item._id, { status: "Completed" });

      const owner = await User.findById(request.item.user);
      if (owner) {
        owner.sustainabilityScore += 10; // each completed item = 10 points
        await owner.save();
      }
    }

    res.json({ success: true, data: request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOutgoingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id })
      .populate("item")
      .populate({
        path: "item",
        populate: { path: "user", select: "email" },
      });

    const requestsWithRatings = await Promise.all(
      requests.map(async (req) => {
        const hasRated = await Rating.exists({
          fromUser: req.requester,
          toUser: req.item.user._id,
          item: req.item._id,
        });

        return {
          ...req.toObject(),
          rated: !!hasRated,
        };
      })
    );

    res.json({ success: true, data: requestsWithRatings });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = {
  createRequest,
  getIncomingRequests,
  updateRequestStatus,
  getOutgoingRequests,
};
