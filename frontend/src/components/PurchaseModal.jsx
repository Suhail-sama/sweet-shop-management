import { useState } from 'react';
import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import { sweetService } from '../services/sweetService';

const PurchaseModal = ({ sweet, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = (sweet.price * quantity).toFixed(2);
  const maxQuantity = sweet.quantity;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
      setError('');
    }
  };

  const handlePurchase = async () => {
    if (quantity > maxQuantity) {
      setError(`Only ${maxQuantity} items available in stock`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await sweetService.purchaseSweet(sweet._id, quantity);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🍬</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Purchase Sweet</h2>
          <p className="text-gray-600">{sweet.name}</p>
        </div>

        {/* Sweet Details */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Category:</span>
            <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              {sweet.category}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Price per unit:</span>
            <span className="text-purple-600 font-bold text-lg">${sweet.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Available:</span>
            <span className="text-green-600 font-semibold">{sweet.quantity} in stock</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Quantity
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={20} />
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min="1"
              max={maxQuantity}
              className="w-20 text-center text-2xl font-bold border-2 border-purple-300 rounded-lg py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center text-white">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-3xl font-bold">${totalPrice}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={loading || quantity > maxQuantity}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                Purchase
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;