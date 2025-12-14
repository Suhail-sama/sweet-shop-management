const Sweet = require('../models/Sweet');

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Private
exports.getAllSweets = async (req, res, next) => {
  try {
    const sweets = await Sweet.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: sweets.length,
      data: sweets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single sweet
// @route   GET /api/sweets/:id
// @access  Private
exports.getSweet = async (req, res, next) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    res.status(200).json({
      success: true,
      data: sweet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Private
exports.searchSweets = async (req, res, next) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query = {};

    // Search by name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: sweets.length,
      data: sweets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new sweet
// @route   POST /api/sweets
// @access  Private/Admin
exports.createSweet = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const sweet = await Sweet.create(req.body);

    res.status(201).json({
      success: true,
      data: sweet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
exports.updateSweet = async (req, res, next) => {
  try {
    let sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: sweet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
exports.deleteSweet = async (req, res, next) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    await sweet.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sweet deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Purchase sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
exports.purchaseSweet = async (req, res, next) => {
  try {
    const { quantity = 1 } = req.body;

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    // Check if enough quantity available
    if (sweet.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${sweet.quantity} items available in stock`,
      });
    }

    // Decrease quantity
    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json({
      success: true,
      message: `Successfully purchased ${quantity} ${sweet.name}(s)`,
      data: sweet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restock sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
exports.restockSweet = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity',
      });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found',
      });
    }

    // Increase quantity
    sweet.quantity += parseInt(quantity);
    await sweet.save();

    res.status(200).json({
      success: true,
      message: `Successfully restocked ${quantity} ${sweet.name}(s)`,
      data: sweet,
    });
  } catch (error) {
    next(error);
  }
};