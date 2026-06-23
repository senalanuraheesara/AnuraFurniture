import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Package, MapPin, CreditCard, Check, Clock, Truck, Home, ChevronLeft } from 'lucide-react';
import { fetchOrder } from '../store/slices/orderSlice';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => { if (id) dispatch(fetchOrder(id)); }, [id, dispatch]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" /></div>;
  if (!order) return <div className="text-center py-20"><p>Order not found</p></div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <>
      <Helmet><title>Order {order.orderNumber} – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Link to="/orders" className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><ChevronLeft className="w-5 h-5" /></Link>
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Order {order.orderNumber}</h1>
              <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className={`ml-auto badge capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span>
          </div>

          {/* Progress */}
          {order.status !== 'cancelled' && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Progress</h3>
              
              {/* Desktop Stepper */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-0">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${i <= currentStep ? 'bg-primary-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                        {i < currentStep ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`h-1 flex-1 mx-1 ${i < currentStep ? 'bg-primary-800' : 'bg-gray-200 dark:bg-gray-700'}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {STATUS_STEPS.map((step) => (
                    <p key={step} className="text-xs text-gray-500 dark:text-gray-400 capitalize text-center flex-1">{step}</p>
                  ))}
                </div>
              </div>

              {/* Mobile Stepper */}
              <div className="sm:hidden space-y-4">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${i <= currentStep ? 'bg-primary-800 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                      {i < currentStep ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                    </div>
                    <p className={`text-sm capitalize ${i <= currentStep ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-400'}`}>{step}</p>
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                  <p className="text-cyan-700 dark:text-cyan-300 text-sm">Tracking: <strong>{order.trackingNumber}</strong></p>
                </div>
              )}
            </div>
          )}

          {/* Items */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-primary-600" /> Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <img src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80'} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium text-sm truncate">{item.name}</p>
                    {item.color && <p className="text-gray-400 text-xs">Color: {item.color}</p>}
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-primary-800 dark:text-primary-300 font-bold text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grid: Shipping + Payment + Summary */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-primary-600" /> Delivery Address</h3>
              <div className="text-gray-600 dark:text-gray-400 text-sm space-y-0.5">
                <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.district}</p>
                <p>{order.shippingAddress?.province} {order.shippingAddress?.postalCode}</p>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4 text-primary-600" /> Payment</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Method</span><span>Cash on delivery</span></div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Status</span><span className={order.isPaid ? 'text-green-600' : 'text-orange-500'}>{order.isPaid ? 'Paid' : 'Unpaid'}</span></div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>Rs. {order.subtotal?.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Delivery</span><span>{order.shippingPrice === 0 ? 'Free' : `Rs. ${order.shippingPrice}`}</span></div>
                {order.couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-Rs. {order.couponDiscount?.toLocaleString()}</span></div>}
                <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-2"><span>Total</span><span className="text-primary-800 dark:text-primary-300">Rs. {order.totalPrice?.toLocaleString()}</span></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/orders" className="btn-secondary flex-1 justify-center">All Orders</Link>
            <Link to="/shop" className="btn-primary flex-1 justify-center">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  );
}
