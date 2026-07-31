'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Inscription {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  statut: string;
  created_at: string;
  entreprise_trouvee: string | null;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  nouveau: { label: 'Recu', bg: 'bg-gray-100', text: 'text-gray-700' },
  en_cours: { label: 'En traitement', bg: 'bg-yellow/20', text: 'text-yellow-700' },
  entretien: { label: 'Dossier complet', bg: 'bg-teal/15', text: 'text-teal-700' },
  accepte: { label: 'Inscrit', bg: 'bg-green-100', text: 'text-green-700' },
  accepte_alternance: { label: 'Inscrit · Alternance', bg: 'bg-green-100', text: 'text-green-700' },
  accepte_initial: { label: 'Inscrit · Initial', bg: 'bg-teal/20', text: 'text-teal-700' },
  refuse: { label: 'Refuse', bg: 'bg-red-100', text: 'text-red-700' },
};

export default function AdminDashboard() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('candidatures')
      .select('id, prenom, nom, email, telephone, statut, created_at, entreprise_trouvee')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInscriptions(data);
    }
    setLoading(false);
  };

  const filtered = inscriptions.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.prenom?.toLowerCase().includes(q) ||
      c.nom?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: inscriptions.length,
    nouveau: inscriptions.filter((c) => !c.statut || c.statut === 'nouveau').length,
    en_cours: inscriptions.filter((c) => c.statut === 'en_cours' || c.statut === 'entretien').length,
    accepte: inscriptions.filter((c) => c.statut === 'accepte' || c.statut === 'accepte_alternance' || c.statut === 'accepte_initial').length,
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatus = (statut: string | null) => {
    const key = statut || 'nouveau';
    return statusConfig[key] || statusConfig.nouveau;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="font-[var(--font-outfit)] text-2xl font-bold text-dark">Inscriptions</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion des dossiers d&apos;inscription BTS Biologie Medicale</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total inscriptions</p>
          <p className="text-3xl font-bold text-dark">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Recues</p>
          <p className="text-3xl font-bold text-gray-600">{stats.nouveau}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">En traitement</p>
          <p className="text-3xl font-bold text-teal">{stats.en_cours}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Inscrits</p>
          <p className="text-3xl font-bold text-green-600">{stats.accepte}</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, prenom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal bg-white"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="animate-spin h-8 w-8 text-teal mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500 text-sm">Chargement des inscriptions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 text-sm">
            {search ? 'Aucune inscription ne correspond a votre recherche.' : 'Aucune inscription pour le moment.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Etudiant</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telephone</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => {
                  const status = getStatus(c.statut);
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/espace-candidature/${c.id}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {(c.prenom?.[0] || '').toUpperCase()}{(c.nom?.[0] || '').toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-dark">{c.prenom} {c.nom}</p>
                            {(c.entreprise_trouvee || '').toLowerCase().includes('initial') ? (
                              <p className="text-xs text-teal font-medium">Formation initiale</p>
                            ) : c.entreprise_trouvee ? (
                              <p className="text-xs text-gray-400">Alternance</p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.telephone}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(c.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <svg className="w-4 h-4 text-gray-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((c) => {
              const status = getStatus(c.statut);
              return (
                <a
                  key={c.id}
                  href={`/espace-candidature/${c.id}`}
                  className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {(c.prenom?.[0] || '').toUpperCase()}{(c.nom?.[0] || '').toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-dark">{c.prenom} {c.nom}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="pl-12 space-y-0.5">
                    {(c.entreprise_trouvee || '').toLowerCase().includes('initial') ? (
                      <p className="text-xs text-teal font-medium">Formation initiale</p>
                    ) : c.entreprise_trouvee ? (
                      <p className="text-xs text-gray-400">Alternance</p>
                    ) : null}
                    <p className="text-sm text-gray-600">{c.email}</p>
                    <p className="text-xs text-gray-400">{formatDate(c.created_at)}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
