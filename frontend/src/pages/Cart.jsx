import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, ArrowRight, Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { buildWhatsAppLink, cartWhatsAppMessage } from '../utils/whatsapp';

export default function Cart() {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleWhatsAppOrder = () => {
    const msg = cartWhatsAppMessage(items, subtotal, shipping);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const handleQtyChange = async (itemId, qty) => {
    if (qty < 1) return;
    try {
      await dispatch(updateCartItem({ itemId, quantity: qty })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to update');
    }
  };

  const handleRemove = async (itemId, name) => {
    await dispatch(removeFromCart(itemId));
    toast.success(`${name} removed`);
  };

  return (
    <>
      <Helmet><title>Shopping Cart – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30 pt-24 lg:pt-28 py-8 px-4 pb-mobile-nav">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-primary-700" /> Shopping Cart ({items.length})
          </h1>

          {items.length === 0 ? (
            <div className="card p-16 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
              <Link to="/shop" className="btn-primary inline-flex mt-4">Start Shopping <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <motion.div key={item._id} layout className="card p-5 flex gap-4 items-start">
                    <Link to={`/product/${item.product?._id || item.product}`} className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <img src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200'} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product?._id || item.product}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-700 transition-colors line-clamp-2 text-sm">{item.name}</Link>
                      {item.color && <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1"><Tag className="w-3 h-3" />{item.color}</p>}
                      <p className="font-bold text-primary-800 dark:text-primary-300 mt-1">Rs. {Math.round(item.price).toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <button onClick={() => handleQtyChange(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-700"><Minus className="w-3 h-3" /></button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => handleQtyChange(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-700"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => handleRemove(item._id, item.name)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="ml-auto font-bold text-gray-900 dark:text-white text-sm">Rs. {Math.round(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <button onClick={() => dispatch(clearCart())} className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Clear Cart
                </button>
              </div>

              {/* Summary */}
              <div className="card p-6 h-fit sticky top-24 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>Rs. {Math.round(subtotal).toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Delivery</span><span className={shipping === 0 ? 'text-green-600 dark:text-green-400' : ''}>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span></div>
                </div>
                {shipping > 0 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-600 dark:text-blue-300">
                    Add Rs. {(50000 - subtotal).toLocaleString()} more for free delivery!
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-3">
                  <span>Total</span>
                  <span className="text-primary-800 dark:text-primary-300 text-xl">Rs. {Math.round(total).toLocaleString()}</span>
                </div>
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={items.length === 0}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold rounded-2xl transition-colors shadow-lg text-base disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp – Rs. {Math.round(total).toLocaleString()}
                </button>
                <Link to="/shop" className="btn-secondary w-full justify-center py-3 text-sm">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
