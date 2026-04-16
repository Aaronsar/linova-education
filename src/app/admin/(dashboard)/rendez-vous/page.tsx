'use client';

import { useCallback, useEffect, useState } from 'react';
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
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  initial: { label: 'Initial', color: 'bg-blue-50 text-blue-700' },
  alternance: { label: 'Alternance', color: 'bg-purple-50 text-purple-700' },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Confirmé', color: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Annulé', color: 'bg-red-50 text-red-700' },
  completed: { label: 'Effectué', color: 'bg-gray-50 text-gray-600' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminRendezVousPage() {
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
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true });

    if (filter === 'upcoming') {
      query = query.gte('date', today).eq('status', 'confirmed');
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
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  const filtered = appointments.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      a.first_name.toLowerCase().includes(s) ||
      a.last_name.toLowerCase().includes(s) ||
      a.email.toLowerCase().includes(s)
    );
  });

  const today = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter((a) => a.date === today && a.status === 'confirmed').length;
  const upcomingCount = appointments.filter((a) => a.date >= today && a.status === 'confirmed').length;

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rendez-vous d’admission</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion des entretiens candidats</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Aujourd'hui", value: todayCount, color: 'text-blue-600' },
          { label: 'À venir', value: upcomingCount, color: 'text-green-600' },
          { label: 'Initial', value: appointments.filter(a => a.appointment_type === 'initial').length, color: 'text-purple-600' },
          { label: 'Alternance', value: appointments.filter(a => a.appointment_type === 'alternance').length, color: 'text-orange-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {(['upcoming', 'all', 'past'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'upcoming' ? 'À venir' : f === 'all' ? 'Tous' : 'Passés'}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Aucun rendez-vous trouvé
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Heure</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((appt) => {
                const typeInfo = TYPE_LABELS[appt.appointment_type];
                const statusInfo = STATUS_LABELS[appt.status];
                const isPast = appt.date < today;
                return (
                  <tr
                    key={appt.id}
                    className={`hover:bg-gray-50/50 transition-colors ${isPast ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 text-sm">
                        {appt.first_name} {appt.last_name}
                      </div>
                      {appt.current_studies && (
                        <div className="text-xs text-gray-400 mt-0.5">{appt.current_studies}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeInfo?.color}`}>
                        {typeInfo?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 capitalize">{formatDate(appt.date)}</div>
                      <div className="text-xs text-gray-400">{appt.time_slot}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <a href={`mailto:${appt.email}`} className="text-xs text-blue-600 hover:underline block">
                        {appt.email}
                      </a>
                      <span className="text-xs text-gray-400">{appt.phone}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelected(appt)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Voir détails"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {appt.status === 'confirmed' && !isPast && (
                          <button
                            onClick={() => updateStatus(appt.id, 'cancelled')}
                            disabled={updating === appt.id}
                            className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400 cursor-pointer"
                            title="Annuler"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        {appt.status === 'confirmed' && isPast && (
                          <button
                            onClick={() => updateStatus(appt.id, 'completed')}
                            disabled={updating === appt.id}
                            className="p-1.5 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors text-gray-400 cursor-pointer"
                            title="Marquer effectué"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {selected.first_name} {selected.last_name}
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_LABELS[selected.appointment_type]?.color}`}>
                  {TYPE_LABELS[selected.appointment_type]?.label}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="font-semibold text-gray-900 capitalize">{formatDate(selected.date)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Heure</p>
                  <p className="font-semibold text-gray-900">{selected.time_slot}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="font-medium text-blue-600 hover:underline">{selected.email}</a>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Téléphone</p>
                <a href={`tel:${selected.phone}`} className="font-medium text-gray-900">{selected.phone}</a>
              </div>
              {selected.current_studies && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Études actuelles</p>
                  <p className="font-medium text-gray-900">{selected.current_studies}</p>
                </div>
              )}
              {selected.message && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Message</p>
                  <p className="text-gray-700 leading-relaxed">{selected.message}</p>
                </div>
              )}
              {selected.google_event_id && (
                <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-blue-700">Événement Google Agenda synchronisé</span>
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
              {selected.status === 'confirmed' && (
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
