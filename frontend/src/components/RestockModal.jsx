import { useState } from 'react';
import { X, Package, Plus, Minus } from 'lucide-react';
import { sweetService } from '../services/sweetService';

const RestockModal = ({ sweet, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const newTotalStock = sweet.quantity + quantity;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 1000) {
      setQuantity(newQuantity);
      setError('');
    }
  };

  const handleRestock = async () => {
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await sweetService.restockSweet(sweet._id, quantity);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Restock failed. Please try again.');
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
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Restock Sweet</h2>
          <p className="text-gray-600 text-sm mt-1">{sweet.name}</p>
        </div>

        {/* Current Stock Info */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-6 border border-orange-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Current Stock:</span>
            <span className={`font-bold text-lg ${
              sweet.quantity === 0 ? 'text-red-600' : 
              sweet.quantity < 10 ? 'text-orange-600' : 
              'text-green-600'
            }`}>
              {sweet.quantity} units
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Category:</span>
            <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              {sweet.category}
            </span>
          </div>
        </div>

        {/* Quantity to Add */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quantity to Add
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={20} />
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min="1"
              max="1000"
              className="w-24 text-center text-2xl font-bold border-2 border-green-300 rounded-lg py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 1000}
              className="bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Max: 1000 units per restock
          </p>
        </div>

        {/* New Total Preview */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center text-white">
            <div>
              <p className="text-sm opacity-90">New Total Stock</p>
              <p className="text-xs opacity-75 mt-1">
                {sweet.quantity} + {quantity}
              </p>
            </div>
            <span className="text-3xl font-bold">{newTotalStock}</span>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Select:</p>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((num) => (
              <button
                key={num}
                onClick={() => setQuantity(num)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  quantity === num
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                +{num}
              </button>
            ))}
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
            onClick={handleRestock}
            disabled={loading || quantity < 1}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Restocking...
              </>
            ) : (
              <>
                <Package size={20} />
                Restock
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestockModal;