import { ExpirationWarning } from '../types';

interface Props {
  warnings: ExpirationWarning[];
}

const severityConfig = {
  red: {
    bg: 'bg-red-100',
    border: 'border-red-500',
    text: 'text-red-800',
    icon: '🔴',
    label: 'Dringend'
  },
  orange: {
    bg: 'bg-orange-100',
    border: 'border-orange-500',
    text: 'text-orange-800',
    icon: '🟠',
    label: 'Binnenkort'
  },
  green: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    icon: '🟡',
    label: 'Let op'
  }
};

export default function ExpirationWarnings({ warnings }: Props) {
  if (warnings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-700">Alles is vers!</h2>
        <p className="text-gray-500 mt-2">Geen producten die binnenkort vervallen</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vervaldatum waarschuwingen</h2>

      <div className="space-y-4">
        {warnings.map((warning) => {
          const config = severityConfig[warning.severity];

          return (
            <div
              key={warning.product['@id']}
              className={`p-4 rounded-lg border-l-4 ${config.bg} ${config.border}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{config.icon}</span>
                    <h3 className={`text-lg font-bold ${config.text}`}>
                      {warning.product.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.text} border ${config.border}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <div className="ml-10 space-y-1 text-sm">
                    {warning.product.brand && (
                      <p className="text-gray-600">Merk: {warning.product.brand}</p>
                    )}
                    <p className="text-gray-700">
                      Vervaldatum:{' '}
                      <span className="font-medium">
                        {warning.product.expirationDate}
                      </span>
                    </p>
                    <p className={`font-bold ${config.text}`}>
                      {warning.daysUntilExpiration === 0
                        ? 'Vervalt VANDAAG!'
                        : warning.daysUntilExpiration === 1
                        ? 'Vervalt MORGEN!'
                        : `Nog ${warning.daysUntilExpiration} dagen`}
                    </p>
                    <p className="text-gray-600">
                      Locatie: {warning.product.storedIn} • {warning.product.quantity}{' '}
                      {warning.product.unit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">💡 Tip</h3>
        <p className="text-blue-800">
          Kijk bij "Wat eten we?" voor recepten die deze ingrediënten gebruiken!
        </p>
      </div>
    </div>
  );
}
