import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirections | Linova Admin',
};

// Current redirections from next.config.ts
const REDIRECTIONS = [
  {
    source: '/2025/09/17/bts-biologie-medicale-paris-linova-education',
    destination: '/formations/bts-biologie-medicale',
    permanent: true,
    reason: 'Ancienne URL WordPress → page formation',
  },
];

export default function RedirectionsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Redirections SEO</h1>
        <p className="text-sm text-gray-500 mt-1">
          Redirections 301 configurées dans <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">next.config.ts</code>
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="text-2xl shrink-0">⚙️</div>
        <div>
          <div className="font-semibold text-amber-900 text-sm">Configuration technique</div>
          <p className="text-sm text-amber-700 mt-1">
            Les redirections sont définies dans le fichier <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">next.config.ts</code> à la racine du projet. Pour ajouter une redirection, demandez à votre développeur ou modifiez directement ce fichier.
          </p>
          <div className="mt-3 bg-amber-100 rounded-lg p-3 font-mono text-xs text-amber-800">
            {`{ source: "/ancienne-url", destination: "/nouvelle-url", permanent: true }`}
          </div>
        </div>
      </div>

      {/* Current redirections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Redirections actives ({REDIRECTIONS.length})
          </h2>
        </div>

        {REDIRECTIONS.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">🔀</div>
            <p className="text-sm">Aucune redirection configurée</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source (ancienne URL)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Destination</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Raison</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {REDIRECTIONS.map((r, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs text-red-500 bg-red-50 px-2 py-1 rounded truncate max-w-xs">
                        {r.source}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <a
                        href={r.destination}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-green-600 bg-green-50 px-2 py-1 rounded hover:underline"
                      >
                        {r.destination}
                      </a>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        r.permanent
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {r.permanent ? '301 Permanent' : '302 Temporaire'}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-xs text-gray-500">
                      {r.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-navy text-sm mb-3">Comment ajouter une redirection ?</h3>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 bg-teal/20 text-teal rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Ouvrez le fichier <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">next.config.ts</code> à la racine du projet
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 bg-teal/20 text-teal rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Ajoutez un objet dans le tableau <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">redirects()</code>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 bg-teal/20 text-teal rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Redéployez le site sur Vercel pour que la redirection soit active
          </li>
        </ol>
      </div>
    </div>
  );
}
