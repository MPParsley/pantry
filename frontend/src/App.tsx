import { useState, useEffect } from 'react';
import {
  getInventory,
  getExpirationWarnings,
  getRecipeSuggestions,
  createProduct
} from './api';
import { Product, ExpirationWarning, RecipeSuggestion, StorageLocation } from './types';
import InventoryList from './components/InventoryList';
import ExpirationWarnings from './components/ExpirationWarnings';
import RecipeSuggestions from './components/RecipeSuggestions';
import AddProductForm from './components/AddProductForm';

function App() {
  const [activeTab, setActiveTab] = useState<
    'inventory' | 'warnings' | 'recipes' | 'add'
  >('inventory');
  const [inventory, setInventory] = useState<Product[]>([]);
  const [warnings, setWarnings] = useState<ExpirationWarning[]>([]);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inv, warn, sug] = await Promise.all([
        getInventory(),
        getExpirationWarnings(7),
        getRecipeSuggestions(2)
      ]);
      setInventory(inv);
      setWarnings(warn);
      setSuggestions(sug);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddProduct = async (productData: any) => {
    try {
      await createProduct(productData);
      await loadData();
      setActiveTab('inventory');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Fout bij toevoegen product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Pantry</h1>
          <p className="text-green-100">Slimme voorraadassistent</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'inventory'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-green-600'
              }`}
            >
              Voorraad ({inventory.length})
            </button>
            <button
              onClick={() => setActiveTab('warnings')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'warnings'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-green-600'
              }`}
            >
              Waarschuwingen ({warnings.length})
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'recipes'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-green-600'
              }`}
            >
              Wat eten we? ({suggestions.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'add'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-green-600'
              }`}
            >
              + Toevoegen
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'inventory' && (
          <InventoryList products={inventory} onRefresh={loadData} />
        )}
        {activeTab === 'warnings' && <ExpirationWarnings warnings={warnings} />}
        {activeTab === 'recipes' && <RecipeSuggestions suggestions={suggestions} />}
        {activeTab === 'add' && <AddProductForm onSubmit={handleAddProduct} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Pantry MVP - Linked Data voorraadbeheer met schema.org</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
