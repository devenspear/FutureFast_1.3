import { getSubscribers } from '../../../../lib/blob';
import { SubscriberData } from '../../../../lib/blob';

export const dynamic = 'force-dynamic';

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 font-orbitron bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          Newsletter Subscribers
        </h1>
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {subscribers.length > 0 ? (
                  subscribers.map((subscriber: SubscriberData) => (
                    <tr key={subscriber.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscriber.firstName} {subscriber.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{subscriber.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{subscriber.company || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                      No subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-700">
            <p className="text-sm text-gray-300">
              Total Subscribers: <span className="font-bold">{subscribers.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
