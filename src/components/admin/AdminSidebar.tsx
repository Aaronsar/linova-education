'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavGroup {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
  defaultOpen?: boolean;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

import { useState } from 'react';

function NavGroupSection({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(group.defaultOpen ?? false);
  const isActive = group.items.some(i => pathname === i.href);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          isActive ? 'bg-teal/20 text-teal' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {group.icon}
          <span>{group.title}</span>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="mt-1 ml-4 space-y-0.5 border-l border-white/10 pl-3">
          {group.items.map(item => {
            const active = pathname === item.href;
            return item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
              >
                {item.label}
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  active
                    ? 'bg-teal/20 text-teal font-medium'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      title: 'Articles & Blog',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      defaultOpen: true,
      items: [
        { label: 'Tous les articles', href: '/admin/articles' },
        { label: '+ Nouvel article', href: '/admin/articles/new' },
        { label: '✅ To do articles (20)', href: '/admin/todo-articles' },
        // Static articles (read-only preview links)
        { label: '— Technicien de labo médical', href: '/blog/technicien-laboratoire-medical', external: true },
        { label: '— Préleveur de laboratoire', href: '/blog/preleveur-laboratoire', external: true },
        { label: '— Technicien microbiologie', href: '/blog/technicien-microbiologie', external: true },
        { label: '— Technicien hématologie', href: '/blog/technicien-hematologie', external: true },
        { label: '— Technicien anatomopathologie', href: '/blog/technicien-anatomopathologie', external: true },
        { label: '— Technicien biologie repro.', href: '/blog/technicien-biologie-reproduction', external: true },
        { label: '— Technicien qualité labo', href: '/blog/technicien-qualite-laboratoire', external: true },
        { label: '— Technicien recherche biomédic.', href: '/blog/technicien-recherche-biomedicale', external: true },
        { label: '— Technicien toxicologie', href: '/blog/technicien-toxicologie', external: true },
        { label: '— Technicien EFS', href: '/blog/technicien-efs', external: true },
        { label: '— Certification Qualiopi', href: '/blog/certification-qualiopi', external: true },
        { label: '— Qualités technicien labo', href: '/blog/qualites-technicien-laboratoire', external: true },
        { label: '— Stage BTS biologie médicale', href: '/blog/stage-bts-biologie-medicale', external: true },
        { label: '— BTS ou licence ?', href: '/blog/bts-biologie-medicale-ou-licence', external: true },
        { label: '— Inscription BTS', href: '/blog/inscription-bts-biologie-medicale', external: true },
        { label: '— Programme BTS', href: '/blog/programme-bts-biologie-medicale', external: true },
        { label: '— Salaire BTS biologie médicale', href: '/blog/salaire-bts-biologie-medicale', external: true },
      ],
    },
    {
      title: 'Formation',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      items: [
        { label: 'BTS Biologie Médicale', href: '/formations/bts-biologie-medicale', external: true },
        { label: 'Dossier inscription alternance', href: '/dossier-inscription-alternance', external: true },
      ],
    },
    {
      title: 'École',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      items: [
        { label: 'Pourquoi Linova ?', href: '/ecole/pourquoi-linova', external: true },
        { label: 'Notre expertise', href: '/ecole/notre-expertise', external: true },
        { label: 'Démarche qualité', href: '/ecole/demarche-qualite', external: true },
        { label: 'Qualiopi', href: '/ecole/qualiopi', external: true },
        { label: 'Accessibilité', href: '/ecole/accessibilite', external: true },
      ],
    },
    {
      title: 'Infos pratiques',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      items: [
        { label: 'Admission', href: '/infos-pratiques/admission', external: true },
        { label: 'Tarifs', href: '/infos-pratiques/tarifs', external: true },
        { label: 'Campus', href: '/infos-pratiques/campus', external: true },
        { label: 'Handicap & accessibilité', href: '/infos-pratiques/handicap-accessibilite', external: true },
      ],
    },
    {
      title: 'Pages du site',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      items: [
        { label: 'Vue d\'ensemble des pages', href: '/admin/pages' },
        { label: 'Entreprises', href: '/entreprises', external: true },
        { label: 'Accueil', href: '/', external: true },
      ],
    },
    {
      title: 'Rendez-vous',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      defaultOpen: true,
      items: [
        { label: 'Tous les rendez-vous', href: '/admin/rendez-vous' },
        { label: '+ Prendre rendez-vous', href: '/rendez-vous', external: true },
      ],
    },
    {
      title: 'SEO & Technique',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      items: [
        { label: 'Redirections', href: '/admin/redirections' },
        { label: 'Sitemap XML', href: '/sitemap.xml', external: true },
      ],
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-navy flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm">Linova Admin</div>
            <div className="text-gray-500 text-xs">Back office</div>
          </div>
        </div>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-4">
        <Link
          href="/admin"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/admin'
              ? 'bg-teal/20 text-teal'
              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Tableau de bord
        </Link>
      </div>

      {/* Navigation groups */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navGroups.map(group => (
          <NavGroupSection key={group.title} group={group} />
        ))}
      </nav>

      {/* Candidatures link */}
      <div className="px-3 py-3 border-t border-white/10">
        <a
          href="/espace-candidature"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-yellow hover:bg-yellow/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Candidatures
        </a>
      </div>
    </aside>
  );
}
