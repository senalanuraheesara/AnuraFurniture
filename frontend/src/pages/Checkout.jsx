import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Tag, Check } from 'lucide-react';
import { createOrder } from '../store/slices/orderSlice';
import { applyCoupon } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, couponDiscount, appliedCoupon } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 500;
  const discount = couponDiscount || 0;
  const total = subtotal + shipping - discount;

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    district: '',
    province: '',
    postalCode: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setApplyingCoupon(true);
    try {
      await dispatch(applyCoupon(couponCode)).unwrap();
      toast.success('Coupon applied!');
    } catch (err) {
      toast.error(err || 'Invalid coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city) {
      toast.error('Please fill in the shipping address');
      return;
    }
    try {
      const result = await dispatch(createOrder({
        shippingAddress,
        couponCode: appliedCoupon?.code || couponCode || undefined,
        notes: '',
      })).unwrap();
      navigate(`/order-success/${result._id}`);
    } catch (err) {
      toast.error(err || 'Failed to place order');
    }
  };

  return (
    <>
      <Helmet><title>Checkout – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30 pt-24 lg:pt-28 py-8 px-4 pb-mobile-nav">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" /> Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label><input value={shippingAddress.name} onChange={(e) => setShippingAddress(p => ({ ...p, name: e.target.value }))} required className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone *</label><input value={shippingAddress.phone} onChange={(e) => setShippingAddress(p => ({ ...p, phone: e.target.value }))} required className="input-field" /></div>
                    <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address *</label><input value={shippingAddress.street} onChange={(e) => setShippingAddress(p => ({ ...p, street: e.target.value }))} required placeholder="House No, Street, Lane" className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City *</label><input value={shippingAddress.city} onChange={(e) => setShippingAddress(p => ({ ...p, city: e.target.value }))} required className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">District</label><input value={shippingAddress.district} onChange={(e) => setShippingAddress(p => ({ ...p, district: e.target.value }))} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Province</label><select value={shippingAddress.province} onChange={(e) => setShippingAddress(p => ({ ...p, province: e.target.value }))} className="input-field"><option value="">Select Province</option>{['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'].map(p => <option key={p}>{p}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Postal Code</label><input value={shippingAddress.postalCode} onChange={(e) => setShippingAddress(p => ({ ...p, postalCode: e.target.value }))} className="input-field" /></div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                    💵 Pay with cash when your furniture is delivered.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="card p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Order Summary</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-2 text-sm">
                        <img src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-white truncate text-xs">{item.name}</p>
                          <p className="text-gray-500 text-xs">x{item.quantity}</p>
                        </div>
                        <span className="text-gray-900 dark:text-white text-xs font-medium">Rs. {Math.round(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {!appliedCoupon && (
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="input-field flex-1 text-sm py-2" />
                      <button type="button" onClick={handleApplyCoupon} disabled={applyingCoupon || !couponCode}
                        className="px-3 py-2 bg-primary-800 text-white rounded-xl text-sm hover:bg-primary-700 transition-colors disabled:opacity-50">
                        <Tag className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 dark:text-green-300 text-sm font-medium">{appliedCoupon.code} applied!</span>
                    </div>
                  )}

                  <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>Rs. {Math.round(subtotal).toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Delivery</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span></div>
                    {discount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><span>Discount</span><span>-Rs. {Math.round(discount).toLocaleString()}</span></div>}
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-2">
                      <span>Total</span>
                      <span className="text-primary-800 dark:text-primary-300 text-lg">Rs. {Math.round(total).toLocaleString()}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading || items.length === 0} className="w-full btn-primary py-4 text-base justify-center">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Place Order – Rs. ${Math.round(total).toLocaleString()}`}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
