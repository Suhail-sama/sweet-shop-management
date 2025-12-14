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

// All routes require authentication
router.use(protect);

// Public sweet routes (for authenticated users)
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.get('/:id', getSweet);
router.post('/:id/purchase', purchaseSweet);

// Admin only routes
router.post('/', authorize('admin'), createSweet);
router.put('/:id', authorize('admin'), updateSweet);
router.delete('/:id', authorize('admin'), deleteSweet);
router.post('/:id/restock', authorize('admin'), restockSweet);

module.exports = router;