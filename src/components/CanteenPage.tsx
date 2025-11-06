import { useState, useEffect } from 'react';
import { supabase, CanteenItem } from '../lib/supabase';
import { ShoppingCart, X, Plus, Minus, Clock, Star, TrendingUp, CloudRain, Sun, Coffee, Users, Timer, UtensilsCrossed } from 'lucide-react';
import AIChatbot from './AIChatbot';
import { APP_CONTEXT, getCurrentWeather } from '../lib/appContext';

declare global {
  interface Window {
    Razorpay?: new (options: any) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}

interface CartItem extends CanteenItem {
  quantity: number;
}

export default function CanteenPage() {
  const [items, setItems] = useState<CanteenItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    waitMinutes: number;
    readyAt: string;
  } | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout.');
      setIsRazorpayLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('canteen_items')
        .select('*')
        .eq('available', true)
        .order('category');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: CanteenItem) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handlePayment = () => {
    if (!studentName || !studentId || !pickupTime) {
      return;
    }

    setIsProcessingPayment(true);
    setShowCheckout(false);
    initiateRazorpayPayment();
  };

  const initiateRazorpayPayment = () => {
    if (!isRazorpayLoaded || !window.Razorpay) {
      alert('Payment service is currently unavailable. Please try again in a moment.');
      setIsProcessingPayment(false);
      setShowCheckout(true);
      return;
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!keyId) {
      alert('Razorpay key is missing. Please configure VITE_RAZORPAY_KEY_ID.');
      setIsProcessingPayment(false);
      setShowCheckout(true);
      return;
    }

    const razorpay = new window.Razorpay({
      key: keyId,
      amount: Math.round(getTotalAmount() * 100),
      currency: 'INR',
      name: 'VVCE Canteen',
      description: `Order for ${studentName}`,
      handler: () => {
        handlePaymentSuccess();
      },
      prefill: {
        name: studentName,
        email: `${studentId}@vvce.edu`,
        contact: '9999999999',
      },
      notes: {
        studentId,
        pickupTime,
      },
      theme: {
        color: '#22c55e',
      },
      modal: {
        ondismiss: () => {
          setIsProcessingPayment(false);
          setShowCheckout(true);
        },
      },
    });

    razorpay.on('payment.failed', () => {
      setIsProcessingPayment(false);
      setShowCheckout(true);
      alert('Payment failed. Please try again.');
    });

    razorpay.open();
  };

  const handlePaymentSuccess = () => {
    const orderNumber = Math.floor(Math.random() * 100) + 1;
    const orderReference = `ORD-${orderNumber.toString().padStart(3, '0')}`;
    const waitMinutes = 15 + Math.floor(Math.random() * 6);
    const readyTime = new Date();
    readyTime.setMinutes(readyTime.getMinutes() + waitMinutes);

    finalizeOrder(orderReference, waitMinutes, readyTime);
  };

  const finalizeOrder = async (orderReference: string, waitMinutes: number, readyTime: Date) => {
    try {
      const orderData = {
        student_name: studentName,
        student_id: studentId,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: getTotalAmount(),
        pickup_time: pickupTime,
        status: 'confirmed',
        payment_status: 'paid',
        order_reference: orderReference,
        wait_minutes: waitMinutes,
        estimated_ready_at: readyTime.toISOString()
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      setOrderConfirmation({
        orderId: orderReference,
        waitMinutes,
        readyAt: readyTime.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      setCart([]);
      setStudentName('');
      setStudentId('');
      setPickupTime('');
      setTimeout(() => {
        setOrderConfirmation(null);
      }, 5000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Something went wrong while saving your order. Please contact the canteen desk.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const categories = ['all', ...new Set(items.map(item => item.category))];
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-green-600">Loading menu...</div>
      </div>
    );
  }

  if (orderConfirmation) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h2>
          <p className="text-gray-700 text-lg mb-2">Payment Successful</p>
          <p className="text-gray-600 mb-4">Reference: <span className="font-semibold">{orderConfirmation.orderId}</span></p>
          <p className="text-gray-600">
            Estimated wait time: <span className="font-semibold">{orderConfirmation.waitMinutes} minutes</span>
          </p>
          <p className="text-gray-600">Ready around: <span className="font-semibold">{orderConfirmation.readyAt}</span></p>
        </div>
      </div>
    );
  }

  const weather = getCurrentWeather();
  const hour = new Date().getHours();
  const todaySpecials = items.filter(item => item.is_today_special);
  const bestSellers = items.filter(item => item.is_best_seller);
  const weatherBasedItems = items.filter(item => 
    weather.condition.toLowerCase() === 'cold' ? item.weather_tag === 'cold' : item.weather_tag === 'hot'
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Canteen Menu</h2>
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Busy Hours & Wait Time Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Canteen Status</p>
                <p className="text-lg font-bold text-gray-800">
                  {(hour >= 12 && hour < 14) || (hour >= 17 && hour < 19) ? 'Busy' : 'Not Busy'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Timer className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Wait</p>
                <p className="text-lg font-bold text-gray-800">
                  {(hour >= 12 && hour < 14) ? '15-20 min' : (hour >= 17 && hour < 19) ? '10-15 min' : '5 min'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${weather.condition === 'Cold' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                {weather.condition === 'Cold' ? <CloudRain className="w-6 h-6 text-blue-600" /> : <Sun className="w-6 h-6 text-orange-600" />}
              </div>
              <div>
                <p className="text-sm text-gray-600">Weather</p>
                <p className="text-lg font-bold text-gray-800">{weather.temp}°C - {weather.condition}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Special */}
        {todaySpecials.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="text-2xl font-bold text-gray-800">Today's Special</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todaySpecials.map(item => (
                <div key={item.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-4 border-2 border-yellow-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">SPECIAL</span>
                        <Coffee className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all font-medium whitespace-nowrap"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Selling Items */}
        {bestSellers.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <h3 className="text-2xl font-bold text-gray-800">Most Selling</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bestSellers.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 border-t-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">BESTSELLER</span>
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather-Based Suggestions */}
        {weatherBasedItems.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              {weather.condition === 'Cold' ? <CloudRain className="w-6 h-6 text-blue-600" /> : <Sun className="w-6 h-6 text-orange-600" />}
              <h3 className="text-xl font-bold text-gray-800">Perfect for {weather.condition} Weather</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{weather.suggestion}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {weatherBasedItems.slice(0, 4).map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-all">
                  <h5 className="font-bold text-gray-800 text-sm mb-1">{item.name}</h5>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-500 text-white p-1.5 rounded hover:bg-green-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <UtensilsCrossed className="w-16 h-16 text-green-600" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Your Cart</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="bg-gray-200 p-1 rounded-full hover:bg-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-green-600">₹{getTotalAmount().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Pickup Time
                </label>
                <input
                  type="datetime-local"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Items:</span>
                  <span className="font-medium">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">₹{getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={!studentName || !studentId || !pickupTime || isProcessingPayment || !isRazorpayLoaded}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Chatbot */}
      <AIChatbot context={APP_CONTEXT} />
    </div>
  );
}
