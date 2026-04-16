'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type AppointmentType = 'initial' | 'alternance';

interface BookingState {
  step: 1 | 2 | 3 | 4 | 5;
  appointmentType: AppointmentType | null;
  date: string | null; // YYYY-MM-DD
  timeSlot: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentStudies: string;
  message: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const APPOINTMENT_TYPES = [
  {
    id: 'initial' as AppointmentType,
    title: 'Formation Initiale',
    subtitle: 'Étudiant post-bac',
    duration: '45 min',
    icon: '🎓',
    desc: 'Pour les candidats souhaitant intégrer le BTS Biologie Médicale en formation classique.',
  },
  {
    id: 'alternance' as AppointmentType,
    title: 'Alternance',
    subtitle: 'Formation en entreprise',
    duration: '45 min',
    icon: '🏥',
    desc: 'Pour les candidats souhaitant intégrer le BTS en alternance (contrat d’apprentissage ou pro).',
  },
];

const STEPS = [
  { n: 1, label: 'Type' },
  { n: 2, label: 'Date' },
  { n: 3, label: 'Heure' },
  { n: 4, label: 'Infos' },
  { n: 5, label: 'Confirmation' },
];

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getDaysInMonth(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first: convert Sunday=0 to 7
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  return cells;
}

function isWeekend(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day).getDay();
  return d === 0 || d === 6;
}

function isPast(year: number, month: number, day: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
}

function toDateString(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

// ─── Step Components ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                current > step.n
                  ? 'bg-teal text-white'
                  : current === step.n
                  ? 'bg-navy text-white shadow-lg scale-110'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {current > step.n ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.n
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium hidden sm:block ${
                current === step.n ? 'text-navy' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-8 sm:w-12 mx-1 mt-[-10px] sm:mt-[-10px] transition-all duration-500 ${
                current > step.n ? 'bg-teal' : 'bg-gray-100'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Step 1 — Choose type
function StepType({
  onSelect,
}: {
  onSelect: (t: AppointmentType) => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2 text-center">
        Quel type d’entretien ?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Choisissez le parcours qui correspond à votre projet
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {APPOINTMENT_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="group text-left p-6 rounded-2xl border-2 border-gray-100 hover:border-teal hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer"
          >
            <div className="text-3xl mb-3">{type.icon}</div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-navy text-lg">{type.title}</h3>
                <p className="text-teal text-sm font-medium">{type.subtitle}</p>
              </div>
              <span className="text-xs bg-beige text-navy px-2.5 py-1 rounded-full font-medium shrink-0 ml-2">
                {type.duration}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">{type.desc}</p>
            <div className="mt-4 flex items-center text-teal text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Choisir
              <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 2 — Choose date
function StepDate({
  selectedDate,
  onSelect,
}: {
  selectedDate: string | null;
  onSelect: (date: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(y => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(y => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth();

  const cells = getDaysInMonth(viewYear, viewMonth);

  return (
    <div className="animate-fade-in-up max-w-sm mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2 text-center">
        Choisissez une date
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Disponible du lundi au vendredi
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-bold text-navy">
            {MONTHS_FR[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 px-3 pt-3">
          {DAYS_FR.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 pb-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 px-3 pb-4 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            const dateStr = toDateString(viewYear, viewMonth, day);
            const weekend = isWeekend(viewYear, viewMonth, day);
            const past = isPast(viewYear, viewMonth, day);
            const disabled = weekend || past;
            const selected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => !disabled && onSelect(dateStr)}
                disabled={disabled}
                className={`
                  aspect-square rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                  ${selected
                    ? 'bg-navy text-white shadow-md scale-105'
                    : disabled
                    ? 'text-gray-200 cursor-not-allowed'
                    : 'hover:bg-teal-light hover:text-navy text-dark hover:scale-105'
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <p className="text-center text-sm text-teal font-medium mt-4 capitalize">
          ✓ {formatDisplayDate(selectedDate)}
        </p>
      )}
    </div>
  );
}

// Step 3 — Choose time slot
function StepTime({
  date,
  selectedSlot,
  onSelect,
}: {
  date: string;
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}) {
  const [state, setLoadState] = useState<{
    slots: string[] | null;
    loading: boolean;
    error: boolean;
  }>({ slots: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/rendez-vous/available-slots?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setLoadState({ slots: data.slots || [], loading: false, error: false });
      })
      .catch(() => {
        if (cancelled) return;
        setLoadState({ slots: null, loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const { slots, loading, error } = state;

  const morningSlots = (slots || []).filter((s) => parseInt(s) < 12);
  const afternoonSlots = (slots || []).filter((s) => parseInt(s) >= 14);

  return (
    <div className="animate-fade-in-up max-w-sm mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2 text-center">
        Choisissez un créneau
      </h2>
      <p className="text-gray-500 text-center mb-8 capitalize">
        {formatDisplayDate(date)}
      </p>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          Erreur lors du chargement des créneaux.
        </div>
      )}

      {!loading && !error && slots?.length === 0 && (
        <div className="text-center py-8 bg-beige rounded-2xl">
          <p className="text-navy font-semibold">Aucun créneau disponible</p>
          <p className="text-gray-500 text-sm mt-1">Veuillez choisir une autre date.</p>
        </div>
      )}

      {!loading && !error && slots && slots.length > 0 && (
        <div className="space-y-6">
          {morningSlots.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Matin</p>
              <div className="grid grid-cols-3 gap-2">
                {morningSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => onSelect(slot)}
                    className={`
                      py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                      ${selectedSlot === slot
                        ? 'bg-navy text-white shadow-md scale-105'
                        : 'bg-gray-50 text-navy hover:bg-teal-light hover:scale-105'
                      }
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
          {afternoonSlots.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Après-midi</p>
              <div className="grid grid-cols-3 gap-2">
                {afternoonSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => onSelect(slot)}
                    className={`
                      py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                      ${selectedSlot === slot
                        ? 'bg-navy text-white shadow-md scale-105'
                        : 'bg-gray-50 text-navy hover:bg-teal-light hover:scale-105'
                      }
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Step 4 — Personal info
function StepInfo({
  state,
  onChange,
}: {
  state: BookingState;
  onChange: (field: string, value: string) => void;
}) {
  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all text-dark placeholder-gray-400 text-sm font-quicksand';

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2 text-center">
        Vos informations
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Ces informations nous permettront de préparer votre entretien
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Prénom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={state.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="Marie"
              className={inputClass}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Nom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={state.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              placeholder="Dupont"
              className={inputClass}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={state.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="marie.dupont@gmail.com"
            className={inputClass}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Téléphone <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={state.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="06 12 34 56 78"
            className={inputClass}
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Études actuelles
          </label>
          <input
            type="text"
            value={state.currentStudies}
            onChange={(e) => onChange('currentStudies', e.target.value)}
            placeholder="Terminale STL, Licence 1 Biologie..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Message (optionnel)
          </label>
          <textarea
            value={state.message}
            onChange={(e) => onChange('message', e.target.value)}
            placeholder="Questions, précisions sur votre projet..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}

// Step 5 — Confirmation
function StepConfirmation({
  state,
  loading,
  error,
  onSubmit,
}: {
  state: BookingState;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  const type = APPOINTMENT_TYPES.find((t) => t.id === state.appointmentType);

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2 text-center">
        Confirmez votre rendez-vous
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Vérifiez les informations avant de valider
      </p>

      <div className="bg-gray-50 rounded-2xl p-6 space-y-4 mb-6">
        {/* Appointment summary */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
          <div className="text-2xl">{type?.icon}</div>
          <div>
            <p className="font-bold text-navy">{type?.title}</p>
            <p className="text-sm text-gray-500">BTS Biologie Médicale · {type?.duration}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date</p>
            <p className="font-semibold text-navy text-sm capitalize">
              {state.date ? formatDisplayDate(state.date) : ''}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Heure</p>
            <p className="font-semibold text-navy text-sm">{state.timeSlot}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nom</p>
            <p className="font-semibold text-navy text-sm">
              {state.firstName} {state.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
            <p className="font-semibold text-navy text-sm truncate">{state.email}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4 text-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          85 Avenue Ledru-Rollin, 75012 Paris
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-navy text-white py-4 rounded-xl font-bold text-base hover:bg-navy-dark transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Confirmation en cours...
          </>
        ) : (
          <>
            Confirmer le rendez-vous
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        Un email de confirmation vous sera envoyé à {state.email}
      </p>
    </div>
  );
}

// Step 6 — Success
function StepSuccess({ state }: { state: BookingState }) {
  const type = APPOINTMENT_TYPES.find((t) => t.id === state.appointmentType);

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto text-center py-8">
      <div className="w-20 h-20 bg-yellow rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-3">
        Rendez-vous confirmé !
      </h2>
      <p className="text-gray-500 mb-8">
        Un email de confirmation a été envoyé à <strong className="text-navy">{state.email}</strong>
      </p>

      <div className="bg-navy/5 rounded-2xl p-6 text-left space-y-3 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{type?.icon}</span>
          <div>
            <p className="font-bold text-navy">{type?.title}</p>
            <p className="text-sm text-teal">{type?.duration}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-navy capitalize">
              {state.date ? formatDisplayDate(state.date) : ''}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Heure</span>
            <span className="font-semibold text-navy">{state.timeSlot}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Lieu</span>
            <span className="font-semibold text-navy">Paris 12e</span>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-teal font-semibold hover:text-navy transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à l’accueil
      </Link>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RendezVousBooking() {
  const [state, setState] = useState<BookingState>({
    step: 1,
    appointmentType: null,
    date: null,
    timeSlot: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentStudies: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = useCallback((fields: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...fields }));
  }, []);

  const goToStep = useCallback((step: BookingState['step']) => {
    update({ step });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [update]);

  const handleTypeSelect = (type: AppointmentType) => {
    update({ appointmentType: type, step: 2 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateSelect = (date: string) => {
    update({ date, timeSlot: null, step: 3 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSlotSelect = (slot: string) => {
    update({ timeSlot: slot, step: 4 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFieldChange = (field: string, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedFromInfo =
    state.firstName.trim() &&
    state.lastName.trim() &&
    state.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) &&
    state.phone.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/rendez-vous/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentType: state.appointmentType,
          date: state.date,
          timeSlot: state.timeSlot,
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          phone: state.phone,
          currentStudies: state.currentStudies,
          message: state.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }
      setSuccess(true);
    } catch {
      setSubmitError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <StepSuccess state={state} />;
  }

  return (
    <div>
      {state.step < 5 && <StepIndicator current={state.step} />}

      {state.step === 1 && <StepType onSelect={handleTypeSelect} />}

      {state.step === 2 && (
        <>
          <StepDate selectedDate={state.date} onSelect={handleDateSelect} />
          <div className="text-center mt-6">
            <button
              onClick={() => goToStep(1)}
              className="text-gray-400 hover:text-navy text-sm font-medium transition-colors cursor-pointer"
            >
              ← Retour
            </button>
          </div>
        </>
      )}

      {state.step === 3 && state.date && (
        <>
          <StepTime key={state.date} date={state.date} selectedSlot={state.timeSlot} onSelect={handleSlotSelect} />
          <div className="text-center mt-6">
            <button
              onClick={() => goToStep(2)}
              className="text-gray-400 hover:text-navy text-sm font-medium transition-colors cursor-pointer"
            >
              ← Changer de date
            </button>
          </div>
        </>
      )}

      {state.step === 4 && (
        <>
          <StepInfo state={state} onChange={handleFieldChange} />
          <div className="max-w-lg mx-auto mt-6 flex items-center justify-between">
            <button
              onClick={() => goToStep(3)}
              className="text-gray-400 hover:text-navy text-sm font-medium transition-colors cursor-pointer"
            >
              ← Retour
            </button>
            <button
              onClick={() => goToStep(5)}
              disabled={!canProceedFromInfo}
              className="bg-navy text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-navy-dark transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Continuer →
            </button>
          </div>
        </>
      )}

      {state.step === 5 && (
        <>
          <StepIndicator current={state.step} />
          <StepConfirmation
            state={state}
            loading={submitting}
            error={submitError}
            onSubmit={handleSubmit}
          />
          <div className="text-center mt-4">
            <button
              onClick={() => goToStep(4)}
              className="text-gray-400 hover:text-navy text-sm font-medium transition-colors cursor-pointer"
            >
              ← Modifier mes informations
            </button>
          </div>
        </>
      )}
    </div>
  );
}
