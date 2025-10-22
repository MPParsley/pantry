import { differenceInDays, parseISO } from 'date-fns';
import { Product } from '../types';
import { deleteProduct } from '../api';

interface Props {
  products: Product[];
  onRefresh: () => void;
}

const storageLocationNames: Record<string, string> = {
  Fridge: 'Koelkast',
  Freezer: 'Vriezer',
  Pantry: 'Voorraadkast',
  Countertop: 'Aanrecht'
};

export default function InventoryList({ products, onRefresh }: Props) {
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) {
      try {
        await deleteProduct(id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Fout bij verwijderen');
      }
    }
  };

  const getSeverityColor = (expirationDate: string) => {
    const days = differenceInDays(parseISO(expirationDate), new Date());
    if (days <= 1) return 'bg-red-100 border-red-300';
    if (days <= 3) return 'bg-orange-100 border-orange-300';
    if (days <= 7) return 'bg-yellow-100 border-yellow-300';
    return 'bg-white border-gray-200';
  };

  // Group by storage location
  const grouped = products.reduce((acc, product) => {
    if (!acc[product.storedIn]) {
      acc[product.storedIn] = [];
    }
    acc[product.storedIn].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Voorraad overzicht</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Vernieuwen
        </button>
      </div>

      {Object.entries(grouped).map(([location, items]) => (
        <div key={location}>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {storageLocationNames[location]} ({items.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => {
              const daysUntilExpiration = differenceInDays(
                parseISO(product.expirationDate),
                new Date()
              );

              return (
                <div
                  key={product['@id']}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(
                    product.expirationDate
                  )}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{product.name}</h4>
                      {product.brand && (
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(product['@id'], product.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>
                      Hoeveelheid:{' '}
                      <span className="font-medium">
                        {product.quantity} {product.unit}
                      </span>
                    </p>
                    <p>
                      Vervalt:{' '}
                      <span
                        className={`font-medium ${
                          daysUntilExpiration <= 1
                            ? 'text-red-600'
                            : daysUntilExpiration <= 3
                            ? 'text-orange-600'
                            : 'text-gray-700'
                        }`}
                      >
                        {product.expirationDate} ({daysUntilExpiration} dagen)
                      </span>
                    </p>
                    {product.allergens && product.allergens.length > 0 && (
                      <p className="text-orange-600">
                        Allergenen: {product.allergens.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Geen producten in voorraad</p>
        </div>
      )}
    </div>
  );
}
