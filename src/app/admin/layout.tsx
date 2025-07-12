import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      <header className="admin-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold admin-text-primary font-orbitron">
                    FutureFast.AI
                  </h1>
                  <p className="text-sm admin-text-muted font-sans">
                    Admin Dashboard
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 admin-bg-secondary px-3 py-2 rounded-lg">
                <div className="admin-status-dot admin-status-active"></div>
                <span className="text-sm admin-text-secondary font-sans">
                  System Online
                </span>
              </div>
              
              <a 
                href="/api/admin/auth/logout" 
                className="admin-btn admin-btn-secondary text-sm px-4 py-2 flex items-center space-x-2 hover:admin-text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Sign Out</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="admin-scrollbar">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="admin-bg-secondary admin-border-light border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm admin-text-muted font-sans">
                © 2025 FutureFast.AI - Admin Portal
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="admin-status-dot admin-status-active"></div>
                <span className="text-xs admin-text-muted font-sans">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
