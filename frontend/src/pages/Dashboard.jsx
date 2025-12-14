import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sweetService } from '../services/sweetService';
import SearchFilter from '../components/SearchFilter';
import SweetCard from '../components/SweetCard';
import PurchaseModal from '../components/PurchaseModal';
import AddSweetModal from '../components/AddSweetModal';
import EditSweetModal from '../components/EditSweetModal';
import RestockModal from '../components/RestockModal';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for sweets
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100]);
  
  // Modal states
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);

  const isAdmin = user?.role === 'admin';

  // Fetch sweets on mount
  useEffect(() => {
    fetchSweets();
  }, []);

  // Filter sweets when search/filter changes
  useEffect(() => {
    filterSweets();
  }, [searchTerm, category, priceRange, sweets]);

  const fetchSweets = async () => {
  try {
    setLoading(true);
    const data = await sweetService.getAllSweets();
    setSweets(Array.isArray(data) ? data : []); // Ensure it's always an array
    setError('');
  } catch (err) {
    setError('Failed to load sweets. Please try again.');
    setSweets([]); // Set empty array on error
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const filterSweets = () => {
    let filtered = [...sweets];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter(sweet => sweet.category === category);
    }

    // Filter by price range
    filtered = filtered.filter(
      sweet => sweet.price >= priceRange[0] && sweet.price <= priceRange[1]
    );

    setFilteredSweets(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Purchase handlers
  const handlePurchaseClick = (sweet) => {
    setSelectedSweet(sweet);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = () => {
    setShowPurchaseModal(false);
    fetchSweets();
  };

  // Add sweet handlers
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchSweets();
  };

  // Edit sweet handlers
  const handleEditClick = (sweet) => {
    setSelectedSweet(sweet);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchSweets();
  };

  // Delete handler
  const handleDelete = async (sweet) => {
    if (window.confirm(`Are you sure you want to delete ${sweet.name}?`)) {
      try {
        await sweetService.deleteSweet(sweet._id);
        fetchSweets();
        alert('Sweet deleted successfully!');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete sweet');
      }
    }
  };

  // Restock handlers
  const handleRestockClick = (sweet) => {
    setSelectedSweet(sweet);
    setShowRestockModal(true);
  };

  const handleRestockSuccess = () => {
    setShowRestockModal(false);
    fetchSweets();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🍬</span>
              <div>
                <h1 className="text-2xl font-bold text-purple-600">Sweet Shop</h1>
                {isAdmin && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, <strong>{user?.name}</strong>!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            🍭 Sweet Collection
          </h2>
          {isAdmin && (
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg"
            >
              <Plus size={20} />
              Add New Sweet
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          </div>
        ) : filteredSweets.length === 0 ? (
          /* No Sweets Found */
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <span className="text-6xl mb-4 block">🍬</span>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Sweets Found</h3>
            <p className="text-gray-600">
              {sweets.length === 0
                ? 'There are no sweets available yet. Check back soon!'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          /* Sweets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchaseClick}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onRestock={handleRestockClick}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showPurchaseModal && (
        <PurchaseModal
          sweet={selectedSweet}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={handlePurchaseSuccess}
        />
      )}

      {showAddModal && (
        <AddSweetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {showEditModal && (
        <EditSweetModal
          sweet={selectedSweet}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showRestockModal && (
        <RestockModal
          sweet={selectedSweet}
          onClose={() => setShowRestockModal(false)}
          onSuccess={handleRestockSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;