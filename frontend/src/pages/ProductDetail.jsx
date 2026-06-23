import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Star, Heart, Share2, ChevronRight, Package, Truck,
  Shield, RefreshCw, Minus, Plus, Check, Info, Sparkles, MessageCircle,
  ZoomIn, ChevronLeft,
} from 'lucide-react';
import { fetchProduct, clearProduct } from '../store/slices/productSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/product/ProductCard';
import api from '../services/api';
import toast from 'react-hot-toast';
import { buildWhatsAppLink, productWhatsAppMessage } from '../utils/whatsapp';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, productLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { ids: wishlistIds } = useSelector((state) => state.wishlist);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState('');

  const isWishlisted = wishlistIds?.includes(product?._id);
  const finalPrice = product?.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product?.price || 0;

  useEffect(() => {
    dispatch(clearProduct());
    dispatch(fetchProduct(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  useEffect(() => {
    if (product?._id) {
      api.get(`/products/${product._id}/related`)
        .then(({ data }) => setRelatedProducts(data.products))
        .catch(() => {});

      if (product.colors?.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
    }
  }, [product]);

  const handleBuyWhatsApp = () => {
    const msg = productWhatsAppMessage(product, quantity, selectedColor);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    await dispatch(toggleWishlist(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to leave a review'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, review);
      toast.success('Review submitted!');
      dispatch(fetchProduct(id));
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 lg:pt-28 pb-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className={`h-8 skeleton rounded-lg`} style={{ width: `${70 + Math.random() * 30}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center pt-24 lg:pt-28 pb-20 px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage];

  return (
    <>
      <Helmet>
        <title>{product.name} – Anura Furniture</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-dark-bg">
        {/* Breadcrumb — pt clears fixed navbar */}
        <div className="bg-gray-50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800 pt-24 lg:pt-28 pb-4 px-4">
          <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
            <Link to="/" className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors whitespace-nowrap">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <Link to="/shop" className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors whitespace-nowrap">Shop</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <Link to={`/shop/${product.category.slug}`} className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors whitespace-nowrap">{product.category.name}</Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[min(100%,14rem)] sm:max-w-md" aria-current="page">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={currentImage?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'}
                    alt={currentImage?.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.discount > 0 && <span className="badge bg-red-500 text-white">-{product.discount}%</span>}
                  {product.isNewArrival && <span className="badge bg-green-500 text-white">New</span>}
                  {product.isBestSeller && <span className="badge bg-gold-500 text-white">Best Seller</span>}
                </div>

                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-primary-600 shadow-glow' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.category && (
                  <Link to={`/shop/${product.category.slug}`}
                    className="text-sm text-cyan-600 dark:text-cyan-400 font-medium hover:underline">
                    {product.category.name}
                  </Link>
                )}
                <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.numReviews > 0 && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      {Array(5).fill(null).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.ratings) ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{product.ratings?.toFixed(1)} ({product.numReviews} reviews)</span>
                    <button onClick={() => setActiveTab('reviews')} className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                      Read reviews
                    </button>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="font-display text-4xl font-bold text-primary-800 dark:text-primary-300">
                  Rs. {Math.round(finalPrice).toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <div className="mb-1">
                    <span className="text-gray-400 line-through text-xl">Rs. {product.price.toLocaleString()}</span>
                    <span className="ml-2 badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Save Rs. {Math.round(product.price - finalPrice).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      {product.stock <= 5 ? `Only ${product.stock} left in stock!` : 'In Stock'}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-red-600 dark:text-red-400 text-sm font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color: <span className="text-gray-900 dark:text-white">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                        className={`w-10 h-10 rounded-xl border-2 transition-all ${
                          selectedColor === color.name ? 'border-primary-600 scale-110 shadow-glow' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.hex || '#ccc' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</p>
                <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-700 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-gray-400 text-sm">{product.stock} available</span>
              </div>

              {/* Actions — hidden on mobile (shown in sticky bottom bar) */}
              <div className="hidden sm:flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuyWhatsApp}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 text-base font-bold rounded-2xl flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* WhatsApp SVG icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {product.stock === 0 ? 'Out of Stock' : 'Buy via WhatsApp'}
                </motion.button>

                <button
                  onClick={handleWishlist}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                    isWishlisted
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>

                <button onClick={handleShare}
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, text: product.deliveryEstimate || '3-7 Business Days', label: 'Free Delivery' },
                  { icon: Shield, text: product.warranty || '1 Year', label: 'Warranty' },
                  { icon: RefreshCw, text: '7 Days', label: 'Easy Returns' },
                  { icon: Package, text: 'Free', label: 'Installation' },
                ].map(({ icon: Icon, text, label }) => (
                  <div key={label} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">💵 Cash on delivery</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Pay when your order arrives — no online payment required.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10 md:mt-16">
            <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto no-scrollbar">
              {['description', 'specifications', 'reviews', 'ai-suggestions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-primary-800 text-primary-800 dark:text-primary-300 dark:border-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {tab === 'ai-suggestions' ? '✨ AI Suggestions' : tab.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                {product.features?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.dimensions && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Dimensions</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {product.specifications?.map((spec) => (
                  <div key={spec.key} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{spec.key}</span>
                    <span className="text-gray-900 dark:text-white text-sm font-medium">{spec.value}</span>
                  </div>
                ))}
                {product.materials?.length > 0 && (
                  <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Materials</span>
                    <span className="text-gray-900 dark:text-white text-sm font-medium">{product.materials.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="text-center">
                    <p className="font-display text-6xl font-bold text-gray-900 dark:text-white">{product.ratings?.toFixed(1)}</p>
                    <div className="flex justify-center mt-2">
                      {Array(5).fill(null).map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.round(product.ratings) ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{product.numReviews} reviews</p>
                  </div>
                </div>

                {product.reviews?.map((rev) => (
                  <div key={rev._id} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {rev.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white">{rev.name}</p>
                        <p className="text-gray-400 text-xs">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex mt-1 mb-2">
                        {Array(5).fill(null).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  </div>
                ))}

                {isAuthenticated && (
                  <form onSubmit={handleReviewSubmit} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Write a Review</h3>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Rating</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button key={r} type="button" onClick={() => setReview(p => ({ ...p, rating: r }))}>
                            <Star className={`w-6 h-6 ${r <= review.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={review.comment}
                      onChange={(e) => setReview(p => ({ ...p, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      required
                      className="input-field resize-none"
                    />
                    <button type="submit" disabled={submittingReview} className="btn-primary">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* AI Suggestions Tab */}
            {activeTab === 'ai-suggestions' && (
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">AI Design Suggestions</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Personalized tips for this product</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />This piece works best in {product.roomType?.join(', ')} settings</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Complements {product.style?.join(', ')} interior styles</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Pair with complementary pieces from our collection for a complete look</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <Link to="/ai-room-designer" className="text-primary-600 dark:text-primary-400 hover:underline">
                        Try our AI Room Designer to visualize this in your space →
                      </Link>
                    </li>
                  </ul>
                </div>

                <Link to="/ai-recommendations" className="block p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-cyan-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Get Personalized Recommendations</p>
                      <p className="text-gray-500 text-sm">Tell our AI about your space and budget</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 md:mt-20">
              <h2 className="section-title mb-6 md:mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex gap-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleWishlist}
          className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            isWishlisted
              ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500'
              : 'border-gray-200 dark:border-gray-700 text-gray-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>
        <button
          onClick={handleBuyWhatsApp}
          disabled={product.stock === 0}
          className="flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-md transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {product.stock === 0 ? 'Out of Stock' : `Order – Rs. ${Math.round(finalPrice).toLocaleString()}`}
        </button>
      </div>

      {/* Bottom spacer for mobile sticky bar */}
      <div className="h-20 sm:hidden" />
    </>
  );
}
