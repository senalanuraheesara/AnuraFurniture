import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { fetchWishlist, toggleWishlist } from '../store/slices/wishlistSlice';
import { addToCart, openCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  const handleRemove = async (productId, name) => {
    await dispatch(toggleWishlist(productId));
    dispatch(fetchWishlist());
    toast.success(`${name} removed from wishlist`);
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      dispatch(openCart());
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <>
      <Helmet><title>My Wishlist – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30 pt-24 lg:pt-28 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 flex items-center gap-3">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" /> My Wishlist ({items.length})
          </h1>

          {items.length === 0 ? (
            <div className="card p-16 text-center">
              <Heart className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Save your favorite furniture pieces here</p>
              <Link to="/shop" className="btn-primary inline-flex">Browse Collection <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {items.map((product) => {
                const finalPrice = product.discount > 0
                  ? product.price - (product.price * product.discount) / 100
                  : product.price;
                const primaryImage = product.images?.find(i => i.isPrimary) || product.images?.[0];

                return (
                  <motion.div key={product._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card overflow-hidden group">
                    <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
                      <Link to={`/product/${product.slug || product._id}`}>
                        <img
                          src={primaryImage?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <button
                        onClick={() => handleRemove(product._id, product.name)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-red-500 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <Link to={`/product/${product.slug || product._id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 hover:text-primary-700 transition-colors line-clamp-2">{product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-primary-800 dark:text-primary-300">Rs. {Math.round(finalPrice).toLocaleString()}</span>
                        {product.discount > 0 && <span className="text-gray-400 line-through text-sm">Rs. {product.price?.toLocaleString()}</span>}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full btn-primary py-2.5 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
