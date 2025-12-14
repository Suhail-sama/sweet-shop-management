const express = require('express');
const router = express.Router();
const {
  getAllSweets,
  getSweet,
  searchSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} = require('../controllers/sweetController');
const { protect, authorize } = require('../middleware/auth');

// Public search (but protected - requires login)
router.get('/search', protect, searchSweets);

// Get all sweets and create sweet
router.route('/')
  .get(protect, getAllSweets)
  .post(protect, authorize('admin'), createSweet); // Only admin can create

// Get single sweet, update, delete
router.route('/:id')
  .get(protect, getSweet)
  .put(protect, authorize('admin'), updateSweet) // Only admin can update
  .delete(protect, authorize('admin'), deleteSweet); // Only admin can delete

// Purchase sweet (any authenticated user)
router.post('/:id/purchase', protect, purchaseSweet);

// Restock sweet (admin only)
router.post('/:id/restock', protect, authorize('admin'), restockSweet);

module.exports = router;