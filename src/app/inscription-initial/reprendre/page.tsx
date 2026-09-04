import { Suspense } from 'react';
import ReprendreMandatPage from './ReprendreClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-light flex items-center justify-center p-6">
          <p className="text-gray-500 text-sm">Chargement…</p>
        </main>
      }
    >
      <ReprendreMandatPage />
    </Suspense>
  );
}
