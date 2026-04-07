'use client';

import Link from 'next/link';
import { useState } from 'react';

const navigation = [
  {
    name: 'École',
    children: [
      { name: 'Pourquoi Linova', href: '/ecole/pourquoi-linova' },
      { name: 'Notre expertise', href: '/ecole/notre-expertise' },
      { name: 'Démarche qualité', href: '/ecole/demarche-qualite' },
      { name: 'Accessibilité', href: '/ecole/accessibilite' },
      { name: 'Qualiopi', href: '/ecole/qualiopi' },
    ],
  },
  {
    name: 'Formations',
    children: [
      { name: 'BTS Biologie Médicale', href: '/formations/bts-biologie-medicale' },
    ],
  },
  {
    name: 'Infos pratiques',
    children: [
      { name: 'Admission', href: '/infos-pratiques/admission' },
      { name: 'Alternance', href: '/infos-pratiques/admission#alternance' },
      { name: 'Tarifs', href: '/infos-pratiques/tarifs' },
      { name: 'Campus', href: '/infos-pratiques/campus' },
      { name: 'Handicap & accessibilité', href: '/infos-pratiques/handicap-accessibilite' },
    ],
  },
  { name: 'Entreprises', href: '/entreprises' },
  { name: 'Le blog', href: '/blog' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-[var(--font-outfit)] text-3xl font-bold tracking-wider text-dark">
              LIN<span className="text-teal">O</span>VA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) =>
              'children' in item && item.children ? (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-dark font-medium text-sm hover:text-teal transition-colors">
                    {item.name}
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.name && (
                    <div className="absolute top-full left-0 pt-2 animate-fade-in">
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[220px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-dark hover:bg-light hover:text-teal transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="text-dark font-medium text-sm hover:text-teal transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+33189719944" className="flex items-center gap-2 text-sm text-dark hover:text-teal transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +33 1 89 71 99 44
            </a>
            <Link
              href="#brochure"
              className="px-5 py-2.5 text-sm font-semibold border-2 border-dark text-dark rounded-full hover:bg-dark hover:text-white transition-all"
            >
              Notre brochure
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-candidater-modal'))}
              className="px-5 py-2.5 text-sm font-semibold bg-yellow text-dark rounded-full hover:brightness-95 transition-all cursor-pointer"
            >
              Candidater
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) =>
              'children' in item && item.children ? (
                <div key={item.name}>
                  <button
                    className="w-full flex items-center justify-between py-3 text-dark font-medium"
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                  >
                    {item.name}
                    <svg className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.name && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block py-2 text-sm text-gray-600 hover:text-teal"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="block py-3 text-dark font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="pt-4 border-t space-y-3">
              <a href="tel:+33189719944" className="block text-center text-sm text-dark">
                +33 1 89 71 99 44
              </a>
              <Link href="#brochure" className="block text-center px-5 py-2.5 text-sm font-semibold border-2 border-dark text-dark rounded-full">
                Notre brochure
              </Link>
              <button
                onClick={() => { setMobileOpen(false); window.dispatchEvent(new CustomEvent('open-candidater-modal')); }}
                className="block w-full text-center px-5 py-2.5 text-sm font-semibold bg-yellow text-dark rounded-full cursor-pointer"
              >
                Candidater
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
