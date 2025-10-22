import { useState, FormEvent } from 'react';
import { ProductCategory, StorageLocation, DietType } from '../types';

interface Props {
  onSubmit: (product: any) => void;
}

export default function AddProductForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'other' as ProductCategory,
    quantity: 1,
    unit: 'stuks',
    expirationDate: '',
    storedIn: 'Fridge' as StorageLocation,
    barcode: '',
    allergens: '',
    suitableForDiet: [] as DietType[]
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const product = {
      ...formData,
      quantity: Number(formData.quantity),
      allergens: formData.allergens
        ? formData.allergens.split(',').map((a) => a.trim())
        : [],
      barcode: formData.barcode || undefined,
      brand: formData.brand || undefined
    };

    onSubmit(product);

    // Reset form
    setFormData({
      name: '',
      brand: '',
      category: 'other',
      quantity: 1,
      unit: 'stuks',
      expirationDate: '',
      storedIn: 'Fridge',
      barcode: '',
      allergens: '',
      suitableForDiet: []
    });
  };

  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'dairy', label: 'Zuivel' },
    { value: 'meat', label: 'Vlees' },
    { value: 'fish', label: 'Vis' },
    { value: 'vegetables', label: 'Groente' },
    { value: 'fruit', label: 'Fruit' },
    { value: 'grains', label: 'Granen' },
    { value: 'bakery', label: 'Brood & Bakkerij' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'beverages', label: 'Dranken' },
    { value: 'condiments', label: 'Sauzen & Kruiden' },
    { value: 'other', label: 'Overig' }
  ];

  const locations: { value: StorageLocation; label: string }[] = [
    { value: 'Fridge', label: 'Koelkast' },
    { value: 'Freezer', label: 'Vriezer' },
    { value: 'Pantry', label: 'Voorraadkast' },
    { value: 'Countertop', label: 'Aanrecht' }
  ];

  const diets: { value: DietType; label: string }[] = [
    { value: 'VegetarianDiet', label: 'Vegetarisch' },
    { value: 'VeganDiet', label: 'Veganistisch' },
    { value: 'GlutenFreeDiet', label: 'Glutenvrij' },
    { value: 'LowLactoseDiet', label: 'Lactosearm' },
    { value: 'KetogenicDiet', label: 'Ketogeen' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Product toevoegen</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Productnaam *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="bijv. Melk"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Merk</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="bijv. Campina"
          />
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorie *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as ProductCategory })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Locatie *
            </label>
            <select
              required
              value={formData.storedIn}
              onChange={(e) =>
                setFormData({ ...formData, storedIn: e.target.value as StorageLocation })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hoeveelheid *
            </label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eenheid *
            </label>
            <input
              type="text"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="stuks, liter, gram"
            />
          </div>
        </div>

        {/* Expiration Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Houdbaarheidsdatum *
          </label>
          <input
            type="date"
            required
            value={formData.expirationDate}
            onChange={(e) =>
              setFormData({ ...formData, expirationDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
          <input
            type="text"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="bijv. 8710400043287"
          />
        </div>

        {/* Allergens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allergenen (komma gescheiden)
          </label>
          <input
            type="text"
            value={formData.allergens}
            onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="bijv. melk, lactose"
          />
        </div>

        {/* Diet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Geschikt voor dieet
          </label>
          <div className="space-y-2">
            {diets.map((diet) => (
              <label key={diet.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.suitableForDiet.includes(diet.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        suitableForDiet: [...formData.suitableForDiet, diet.value]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        suitableForDiet: formData.suitableForDiet.filter(
                          (d) => d !== diet.value
                        )
                      });
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{diet.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
        >
          Product toevoegen
        </button>
      </form>
    </div>
  );
}
