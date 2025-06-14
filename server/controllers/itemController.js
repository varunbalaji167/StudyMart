const Item = require('../models/itemModel');

const createItem = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    console.log('🟢 createItem called');

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    const {
      title,
      description,
      category,
      exchangeType,
      courseCode,
      department,
      condition,
      images,
    } = req.body;

    if (!title || !category || !exchangeType || !courseCode || !department || !condition) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newItem = new Item({
      user: userId,
      title,
      description,
      category,
      exchangeType,
      courseCode,
      department,
      condition,
      images: images || [],
    });

    const savedItem = await newItem.save();

    return res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error('🔴 Error in createItem:', error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const { search, courseCode, department, category } = req.query;

    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (courseCode) query.courseCode = { $regex: courseCode, $options: 'i' };
    if (department) query.department = { $regex: department, $options: 'i' };
    if (category) query.category = category;

    const items = await Item.find(query).populate('user', 'email name rollNo avatar');

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔴 Error fetching items:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getItemById = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const item = await Item.findById(req.params.id).populate('user', 'email name rollNo avatar bio major degree');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('🔴 Error in getItemById:', error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const deleteItem = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const userId = req.user._id;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (!item.user.equals(userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    return res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('🔴 Error in deleteItem:', error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  deleteItem,
};
