import { ShoppingCart, Edit, Trash2, Package } from 'lucide-react';

const SweetCard = ({ sweet, onPurchase, onEdit, onDelete, onRestock, isAdmin }) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Sweet Image/Icon */}
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 h-48 flex items-center justify-center">
        <span className="text-6xl">🍬</span>
      </div>

      {/* Sweet Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {sweet.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Delicious {sweet.category.toLowerCase()} treat
        </p>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-purple-600">
            ${sweet.price.toFixed(2)}
          </span>
          <span
            className={`text-sm font-semibold ${
              isOutOfStock
                ? 'text-red-600'
                : sweet.quantity < 10
                ? 'text-orange-600'
                : 'text-green-600'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} in stock`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Purchase Button */}
          <button
            onClick={() => onPurchase(sweet)}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <ShoppingCart size={18} />
            {isOutOfStock ? 'Out of Stock' : 'Purchase'}
          </button>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => onRestock(sweet)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
              >
                <Package size={16} />
                Restock
              </button>
              <button
                onClick={() => onEdit(sweet)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => onDelete(sweet)}
                className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;