const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");

const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.user._id;

    const message = new Message({ conversation: conversationId, sender, text });
    let saved = await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: saved._id,
      updatedAt: Date.now(),
    });

    saved = await saved.populate("sender", "name email");

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { sendMessage, getMessages };