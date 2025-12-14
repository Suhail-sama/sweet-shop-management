const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a sweet name'],
      trim: true,
      maxlength: [100, 'Sweet name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: {
        values: ['Chocolate', 'Candy', 'Gummy', 'Lollipop', 'Hard Candy', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0.01, 'Price must be at least $0.01'],
      max: [10000, 'Price cannot exceed $10,000'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide a quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster searches
sweetSchema.index({ name: 'text', category: 1 });
sweetSchema.index({ price: 1 });

module.exports = mongoose.model('Sweet', sweetSchema);