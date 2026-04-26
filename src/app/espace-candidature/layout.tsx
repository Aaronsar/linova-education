'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/AuthGuard';

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/espace-candidature/login';
  };

  const tabs = [
    { href: '/espace-candidature', label: 'Inscriptions' },
    { href: '/espace-candidature/rendez-vous', label: 'Rendez-vous' },
  ];

  const isActiveTab = (href: string) => {
    if (href === '/espace-candidature') {
      return pathname === '/espace-candidature';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/espace-candidature" className="font-[var(--font-outfit)] text-lg font-bold tracking-tight hover:text-teal transition-colors">
                Linova Admin
              </Link>
              <span className="hidden sm:inline-block text-xs bg-teal/20 text-teal px-2.5 py-0.5 rounded-full font-medium">
                Espace gestion
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-300 hover:text-white transition-colors hidden sm:flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Voir le site
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Deconnexion
              </button>
            </div>
          </div>
          {/* Tabs */}
          <nav className="flex gap-1 -mb-px">
            {tabs.map((tab) => {
              const active = isActiveTab(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? 'border-teal text-white'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Don't wrap login page with AuthGuard
  if (pathname === '/espace-candidature/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
