export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <header className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="font-[var(--font-outfit)] text-lg font-bold tracking-tight">Linova Admin</span>
              <span className="hidden sm:inline-block text-xs bg-teal/20 text-teal px-2.5 py-0.5 rounded-full font-medium">
                Gestion des candidatures
              </span>
            </div>
            <a
              href="/"
              className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Voir le site
            </a>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
