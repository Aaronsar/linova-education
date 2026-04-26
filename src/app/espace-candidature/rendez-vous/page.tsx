'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Appointment {
  id: string;
  created_at: string;
  appointment_type: 'initial' | 'alternance';
  date: string;
  time_slot: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  current_studies: string | null;
  message: string | null;
  status: 'confirmed' | 'cancelled' | 'completed';
  google_event_id: string | null;
  reminder_24h_sent_at: string | null;
  reminder_2h_sent_at: string | null;
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  initial: { label: 'Initial', bg: 'bg-navy/10', text: 'text-navy' },
  alternance: { label: 'Alternance', bg: 'bg-teal/15', text: 'text-teal-700' },
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  confirmed: { label: 'Confirmé', bg: 'bg-green-100', text: 'text-green-700' },
  cancelled: { label: 'Annulé', bg: 'bg-red-100', text: 'text-red-700' },
  completed: { label: 'Effectué', bg: 'bg-gray-100', text: 'text-gray-700' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatLongDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function RendezVousAdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'all' | 'past'>('upcoming');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const fetchAppointments = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    let query = supabase
      .from('linova_appointments')
      .select('*')
      .order('date', { ascending: filter === 'past' ? false : true })
      .order('time_slot', { ascending: true });

    if (filter === 'upcoming') {
      query = query.gte('date', today);
    } else if (filter === 'past') {
      query = query.lt('date', today);
    }

    const { data, error } = await query;
    if (!error && data) setAppointments(data as Appointment[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchAppointments();
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchAppointments]);

  const updateStatus = async (id: string, status: Appointment['status']) => {
    setUpdating(id);
    await supabase.from('linova_appointments').update({ status }).eq('id', id);
    await fetchAppointments();
    setUpdating(null);
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status } : null));
  };

  const filtered = appointments.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      a.first_name?.toLowerCase().includes(s) ||
      a.last_name?.toLowerCase().includes(s) ||
      a.email?.toLowerCase().includes(s)
    );
  });

  const today = new Date().toISOString().split('T')[0];
  const stats = {
    today: appointments.filter((a) => a.date === today && a.status === 'confirmed').length,
    upcoming: appointments.filter((a) => a.date >= today && a.status === 'confirmed').length,
    initial: appointments.filter((a) => a.appointment_type === 'initial').length,
    alternance: appointments.filter((a) => a.appointment_type === 'alternance').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="font-[var(--font-outfit)] text-2xl font-bold text-dark">Rendez-vous</h1>
        <p className="text-gray-500 text-sm mt-1">Entretiens d&apos;admission BTS Biologie Médicale</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Aujourd&apos;hui</p>
          <p className="text-3xl font-bold text-dark">{stats.today}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">À venir</p>
          <p className="text-3xl font-bold text-teal">{stats.upcoming}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Initial (total)</p>
          <p className="text-3xl font-bold text-navy">{stats.initial}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Alternance (total)</p>
          <p className="text-3xl font-bold text-teal">{stats.alternance}</p>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex bg-white rounded-lg border border-gray-200 p-1 gap-1">
          {(['upcoming', 'all', 'past'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                filter === f ? 'bg-navy text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'upcoming' ? 'À venir' : f === 'all' ? 'Tous' : 'Passés'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal bg-white"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg
            className="animate-spin h-8 w-8 text-teal mx-auto mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-500 text-sm">Chargement des rendez-vous...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            {search ? 'Aucun rendez-vous ne correspond à votre recherche.' : 'Aucun rendez-vous pour le moment.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidat</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Heure</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((appt) => {
                  const typeInfo = TYPE_CONFIG[appt.appointment_type];
                  const statusInfo = STATUS_CONFIG[appt.status];
                  const isPast = appt.date < today;
                  return (
                    <tr
                      key={appt.id}
                      className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${isPast ? 'opacity-70' : ''}`}
                      onClick={() => setSelected(appt)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {(appt.first_name?.[0] || '').toUpperCase()}
                            {(appt.last_name?.[0] || '').toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-dark">
                              {appt.first_name} {appt.last_name}
                            </p>
                            {appt.current_studies && (
                              <p className="text-xs text-gray-400">{appt.current_studies}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo?.bg} ${typeInfo?.text}`}>
                          {typeInfo?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-dark capitalize">{formatDate(appt.date)}</p>
                        <p className="text-xs text-gray-500">{appt.time_slot}</p>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${appt.email}`} className="text-sm text-teal hover:underline block">
                          {appt.email}
                        </a>
                        <a href={`tel:${appt.phone}`} className="text-xs text-gray-500 hover:text-gray-700">
                          {appt.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo?.bg} ${statusInfo?.text}`}>
                          {statusInfo?.label}
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
            {filtered.map((appt) => {
              const typeInfo = TYPE_CONFIG[appt.appointment_type];
              const statusInfo = STATUS_CONFIG[appt.status];
              const isPast = appt.date < today;
              return (
                <button
                  key={appt.id}
                  onClick={() => setSelected(appt)}
                  className={`w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow ${isPast ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {(appt.first_name?.[0] || '').toUpperCase()}
                        {(appt.last_name?.[0] || '').toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark">
                          {appt.first_name} {appt.last_name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {formatDate(appt.date)} · {appt.time_slot}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo?.bg} ${statusInfo?.text}`}>
                      {statusInfo?.label}
                    </span>
                  </div>
                  <div className="pl-12 flex items-center gap-2 mt-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${typeInfo?.bg} ${typeInfo?.text}`}>
                      {typeInfo?.label}
                    </span>
                    <span className="text-xs text-gray-500 truncate">{appt.email}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-dark text-lg">
                  {selected.first_name} {selected.last_name}
                </h3>
                <span className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_CONFIG[selected.appointment_type]?.bg} ${TYPE_CONFIG[selected.appointment_type]?.text}`}>
                  {TYPE_CONFIG[selected.appointment_type]?.label}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Date & heure</p>
                <p className="font-semibold text-dark capitalize">{formatLongDate(selected.date)}</p>
                <p className="text-teal font-medium">à {selected.time_slot}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="font-medium text-teal hover:underline break-all">
                  {selected.email}
                </a>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Téléphone</p>
                <a href={`tel:${selected.phone}`} className="font-medium text-dark">
                  {selected.phone}
                </a>
              </div>
              {selected.current_studies && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Études actuelles</p>
                  <p className="font-medium text-dark">{selected.current_studies}</p>
                </div>
              )}
              {selected.message && (
                <div className="bg-beige rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Message du candidat</p>
                  <p className="text-dark leading-relaxed">{selected.message}</p>
                </div>
              )}

              {/* Reminder timeline */}
              <div className="border-t border-gray-100 pt-3 mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Relances envoyées</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={selected.reminder_24h_sent_at ? 'text-green-600' : 'text-gray-300'}>
                      {selected.reminder_24h_sent_at ? '✓' : '○'}
                    </span>
                    <span className={selected.reminder_24h_sent_at ? 'text-dark' : 'text-gray-400'}>
                      Email + SMS J-1
                    </span>
                    {selected.reminder_24h_sent_at && (
                      <span className="text-gray-400 ml-auto">
                        {new Date(selected.reminder_24h_sent_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={selected.reminder_2h_sent_at ? 'text-green-600' : 'text-gray-300'}>
                      {selected.reminder_2h_sent_at ? '✓' : '○'}
                    </span>
                    <span className={selected.reminder_2h_sent_at ? 'text-dark' : 'text-gray-400'}>
                      SMS J-0 (2h avant)
                    </span>
                    {selected.reminder_2h_sent_at && (
                      <span className="text-gray-400 ml-auto">
                        {new Date(selected.reminder_2h_sent_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selected.google_event_id && (
                <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-blue-700">Synchronisé avec Google Agenda admissions@</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
              <a
                href={`mailto:${selected.email}?subject=Votre entretien d'admission Linova`}
                className="flex-1 text-center py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-dark transition-colors"
              >
                Envoyer un email
              </a>
              {selected.status === 'confirmed' && selected.date < today && (
                <button
                  onClick={() => updateStatus(selected.id, 'completed')}
                  disabled={updating === selected.id}
                  className="px-4 py-2.5 border border-green-200 text-green-600 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Marquer effectué
                </button>
              )}
              {selected.status === 'confirmed' && selected.date >= today && (
                <button
                  onClick={() => updateStatus(selected.id, 'cancelled')}
                  disabled={updating === selected.id}
                  className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
