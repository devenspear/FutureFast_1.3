import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-cyan-500 font-orbitron">FutureFast.AI</h1>
              <span className="ml-2 text-sm text-gray-400 font-sans">Admin</span>
            </div>
            <div>
              <a 
                href="/api/admin/auth/logout" 
                className="text-sm text-gray-300 hover:text-white font-sans transition-colors"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </header>
      <main className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
