import { RecipeSuggestion } from '../types';

interface Props {
  suggestions: RecipeSuggestion[];
}

export default function RecipeSuggestions({ suggestions }: Props) {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-2xl font-bold text-gray-700">Geen recepten beschikbaar</h2>
        <p className="text-gray-500 mt-2">
          Voeg meer producten toe aan je voorraad voor suggesties
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Wat eten we?</h2>
        <p className="text-gray-600 mt-2">
          Recepten op basis van wat je in huis hebt. Producten die binnenkort vervallen
          krijgen voorrang.
        </p>
      </div>

      <div className="space-y-6">
        {suggestions.map((suggestion) => {
          const { recipe, availableIngredients, missingIngredients, matchPercentage } =
            suggestion;

          return (
            <div
              key={recipe['@id']}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {recipe.name}
                    </h3>
                    {recipe.description && (
                      <p className="text-gray-600">{recipe.description}</p>
                    )}
                  </div>
                  <div className="ml-4 text-center">
                    <div
                      className={`text-2xl font-bold ${
                        matchPercentage === 100
                          ? 'text-green-600'
                          : matchPercentage >= 75
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {Math.round(matchPercentage)}%
                    </div>
                    <div className="text-xs text-gray-500">Match</div>
                  </div>
                </div>

                {/* Recipe Info */}
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  {recipe.recipeYield && <span>👥 {recipe.recipeYield}</span>}
                  {recipe.prepTime && <span>⏱️ Prep: {recipe.prepTime}</span>}
                  {recipe.cookTime && <span>🔥 Cook: {recipe.cookTime}</span>}
                </div>

                {/* Ingredients */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">
                      ✅ Beschikbaar ({availableIngredients.length})
                    </h4>
                    <ul className="space-y-1">
                      {availableIngredients.map((ing, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          • {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {missingIngredients.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">
                        ❌ Ontbreekt ({missingIngredients.length})
                      </h4>
                      <ul className="space-y-1">
                        {missingIngredients.map((ing, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            • {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold text-gray-700 hover:text-green-600">
                    Bereidingswijze
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                    {recipe.recipeInstructions}
                  </p>
                </details>

                {/* Diet & Allergens */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {recipe.suitableForDiet?.map((diet) => (
                    <span
                      key={diet}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {diet}
                    </span>
                  ))}
                  {recipe.allergens?.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                    >
                      ⚠️ {allergen}
                    </span>
                  ))}
                </div>
              </div>

              {matchPercentage === 100 && (
                <div className="bg-green-50 px-6 py-3 border-t border-green-200">
                  <p className="text-green-800 font-medium text-sm">
                    🎉 Je hebt alle ingrediënten in huis!
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
