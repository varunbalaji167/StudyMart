const Conversation = require("../models/conversationModel");
const Request = require("../models/requestModel");

const createConversation = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Request.findById(requestId).populate("item requester");
    if (!request || request.status !== "Accepted") {
      return res.status(400).json({ success: false, message: "Invalid or unaccepted request" });
    }

    // Check if any conversation exists between these two users (regardless of item/request)
    const existing = await Conversation.findOne({
      participants: { $all: [request.item.user.toString(), request.requester._id.toString()] },
    }).populate("participants");

    if (existing) {
      const currentUserId = req.user._id.toString(); // assuming you're using auth middleware
      const otherUser = existing.participants.find(
        p => p._id.toString() !== currentUserId
      );

      return res.status(409).json({
        success: false,
        message: "Conversation already exists between these users.",
        otherUser: {
          name: otherUser?.name,
          email: otherUser?.email,
        },
      });
    }

    const newConversation = new Conversation({
      participants: [request.item.user, request.requester],
      request: request._id,
    });

    const saved = await newConversation.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("❌ Error creating conversation:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name email") 
      .populate({
        path: "request",
        populate: { path: "item", select: "title" },
      })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    console.log("👥 Conversations for user:", userId);
    res.json({ success: true, data: conversations });
  } catch (err) {
    console.error("❌ Error in getUserConversations:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getConversationByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const convo = await Conversation.findOne({ request: requestId });
    if (!convo) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: convo });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createConversation, getUserConversations, getConversationByRequest };