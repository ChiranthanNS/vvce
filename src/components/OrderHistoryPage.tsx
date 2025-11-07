import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';

interface OrderHistoryPageProps {
  onBack: () => void;
}

export default function OrderHistoryPage({ onBack }: OrderHistoryPageProps) {
  const mockOrders = [
    {
      id: 'ORD-001',
      items: ['Chicken Biryani', 'Cold Coffee'],
      total: 185,
      status: 'preparing',
      estimatedTime: '12 mins',
      orderTime: '2:30 PM',
      date: 'Today'
    },
    {
      id: 'ORD-002',
      items: ['Veg Sandwich', 'Fresh Juice'],
      total: 80,
      status: 'completed',
      estimatedTime: 'Ready',
      orderTime: '1:15 PM',
      date: 'Today'
    },
    {
      id: 'ORD-003',
      items: ['Masala Dosa', 'Tea'],
      total: 75,
      status: 'completed',
      estimatedTime: 'Completed',
      orderTime: '11:45 AM',
      date: 'Yesterday'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">{order.date} • {order.orderTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  {order.status === 'preparing' ? (
                    <>
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="text-orange-600 font-medium">{order.estimatedTime}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-medium">{order.estimatedTime}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Items:</h4>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-800">Total: ₹{order.total}</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'preparing' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {order.status === 'preparing' ? 'Preparing' : 'Completed'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
