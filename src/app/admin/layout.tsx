import './admin.css';
import AdminNavbar from '../../components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      <AdminNavbar />
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}
