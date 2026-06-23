import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  SlidersHorizontal, Grid, LayoutList, X, ChevronDown, Search,
  Sparkles, Filter, ChevronRight,
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'bestseller', label: 'Best Sellers' },
];

const STYLE_OPTIONS = ['modern', 'classic', 'minimalist', 'rustic', 'industrial', 'scandinavian', 'luxury'];
const ROOM_OPTIONS = ['living', 'bedroom', 'dining', 'office', 'outdoor', 'kitchen'];
const MATERIAL_OPTIONS = ['Wood', 'Metal', 'Fabric', 'Leather', 'Glass', 'Rattan', 'Teak', 'MDF'];

export default function Shop() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: categorySlug } = useParams();
  const { products, total, pages, loading, categories } = useSelector((state) => state.products);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [gridCols, setGridCols] = useState(3);
  const [filterOpen, setFilterOpen] = useState(false);
  const [aiSearch, setAISearch] = useState('');
  const [aiSearching, setAISearching] = useState(false);
  const [aiResults, setAIResults] = useState(null);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    minPrice: '',
    maxPrice: '',
    styles: [],
    roomTypes: [],
    materials: [],
    rating: '',
    isFeatured: searchParams.get('isFeatured') || '',
    isBestSeller: searchParams.get('isBestSeller') || '',
    isNewArrival: searchParams.get('isNewArrival') || '',
    isTrending: searchParams.get('isTrending') || '',
  });

  const buildQuery = useCallback(() => {
    const query = { page, sort, limit: 12 };
    if (categorySlug) query.category = categorySlug;
    if (filters.keyword) query.keyword = filters.keyword;
    if (filters.minPrice) query.minPrice = filters.minPrice;
    if (filters.maxPrice) query.maxPrice = filters.maxPrice;
    if (filters.styles.length) query.style = filters.styles.join(',');
    if (filters.roomTypes.length) query.roomType = filters.roomTypes.join(',');
    if (filters.materials.length) query.materials = filters.materials.join(',');
    if (filters.rating) query.rating = filters.rating;
    if (filters.isFeatured) query.isFeatured = filters.isFeatured;
    if (filters.isBestSeller) query.isBestSeller = filters.isBestSeller;
    if (filters.isNewArrival) query.isNewArrival = filters.isNewArrival;
    if (filters.isTrending) query.isTrending = filters.isTrending;
    return query;
  }, [page, sort, categorySlug, filters]);

  useEffect(() => {
    dispatch(fetchProducts(buildQuery()));
  }, [dispatch, buildQuery]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
    setPage(1);
  };

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!aiSearch.trim()) return;
    setAISearching(true);
    try {
      const { default: api } = await import('../services/api');
      const { data } = await api.post('/ai/search', { query: aiSearch });
      setAIResults(data);
    } catch (err) {
      console.error('AI search failed');
    } finally {
      setAISearching(false);
    }
  };

  const clearAIResults = () => {
    setAIResults(null);
    setAISearch('');
  };

  const activeFiltersCount = [
    filters.keyword, filters.minPrice, filters.maxPrice, filters.rating,
    filters.isFeatured, filters.isBestSeller, filters.isNewArrival, filters.isTrending,
    ...filters.styles, ...filters.roomTypes, ...filters.materials,
  ].filter(Boolean).length;

  const displayProducts = aiResults ? aiResults.products : products;

  return (
    <>
      <Helmet>
        <title>Shop – Anura Furniture</title>
        <meta name="description" content="Browse our complete collection of premium furniture. Filter by style, price, room type and more." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30">
        {/* Hero Bar — pt clears fixed navbar */}
        <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white pt-24 lg:pt-28 pb-10 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="max-w-7xl mx-auto relative z-10">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-blue-200/90 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <Link to="/shop" className={categorySlug ? 'hover:text-white transition-colors' : 'text-white font-medium'}>
                Shop
              </Link>
              {categorySlug && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  <span className="text-white font-medium capitalize">
                    {categorySlug.replace(/-/g, ' ')}
                  </span>
                </>
              )}
            </nav>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              {categorySlug
                ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                : 'Our Collection'}
            </h1>
            <p className="text-blue-200/90 text-sm md:text-base">
              {loading ? 'Loading furniture…' : `${total} premium piece${total === 1 ? '' : 's'} available`}
            </p>

            {/* AI Search */}
            <form onSubmit={handleAISearch} className="mt-6 flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  value={aiSearch}
                  onChange={(e) => setAISearch(e.target.value)}
                  placeholder='Try AI search: "modern sofa under Rs. 150,000 for small living room"'
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={aiSearching}
                className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 flex-shrink-0"
              >
                {aiSearching ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                AI Search
              </button>
            </form>

            {aiResults && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-cyan-300 text-sm">
                  AI found {aiResults.products.length} matches for "{aiSearch}"
                </span>
                {aiResults.interpretation && (
                  <span className="text-blue-200 text-xs bg-white/10 px-2 py-1 rounded-lg">
                    Budget: {aiResults.interpretation.maxPrice ? `up to Rs. ${aiResults.interpretation.maxPrice.toLocaleString()}` : 'Any'} •
                    Style: {aiResults.interpretation.style?.join(', ') || 'Any'}
                  </span>
                )}
                <button onClick={clearAIResults} className="text-white/60 hover:text-white text-xs flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Backdrop for mobile filters */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFilterOpen(false)}
                  className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
                />
              )}
            </AnimatePresence>

            {/* Sidebar Filters */}
            <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-white dark:bg-gray-900 p-5 shadow-2xl transition-transform duration-300 transform ${filterOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:w-64 lg:p-5 lg:shadow-card lg:border lg:border-gray-100 lg:dark:border-gray-800 lg:rounded-2xl lg:bg-white lg:dark:bg-gray-900 lg:block flex-shrink-0 overflow-y-auto lg:overflow-y-visible`}>
              <div className="space-y-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                  <div className="flex items-center gap-2">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => setFilters({ keyword: '', minPrice: '', maxPrice: '', styles: [], roomTypes: [], materials: [], rating: '', isFeatured: '', isBestSeller: '', isNewArrival: '', isTrending: '' })}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Clear ({activeFiltersCount})
                      </button>
                    )}
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <FilterSection title="Price Range (Rs.)">
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minPrice}
                      onChange={(e) => { setFilters(p => ({ ...p, minPrice: e.target.value })); setPage(1); }}
                      className="input-field text-sm py-2 px-3 w-full" />
                    <input type="number" placeholder="Max" value={filters.maxPrice}
                      onChange={(e) => { setFilters(p => ({ ...p, maxPrice: e.target.value })); setPage(1); }}
                      className="input-field text-sm py-2 px-3 w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {[['Under 50k', '', '50000'], ['50k–150k', '50000', '150000'], ['150k–300k', '150000', '300000'], ['300k+', '300000', '']].map(([label, min, max]) => (
                      <button key={label} onClick={() => { setFilters(p => ({ ...p, minPrice: min, maxPrice: max })); setPage(1); }}
                        className="text-xs py-1.5 px-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 transition-colors text-gray-600 dark:text-gray-300">
                        {label}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Style */}
                <FilterSection title="Style">
                  <div className="flex flex-wrap gap-2">
                    {STYLE_OPTIONS.map((style) => (
                      <button key={style}
                        onClick={() => toggleArrayFilter('styles', style)}
                        className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-colors border ${
                          filters.styles.includes(style)
                            ? 'bg-primary-800 text-white border-primary-800'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-400'
                        }`}>
                        {style}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Room Type */}
                <FilterSection title="Room Type">
                  <div className="flex flex-wrap gap-2">
                    {ROOM_OPTIONS.map((room) => (
                      <button key={room}
                        onClick={() => toggleArrayFilter('roomTypes', room)}
                        className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-colors border ${
                          filters.roomTypes.includes(room)
                            ? 'bg-primary-800 text-white border-primary-800'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-400'
                        }`}>
                        {room}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Rating */}
                <FilterSection title="Minimum Rating">
                  <div className="space-y-1">
                    {[4, 3, 2].map((r) => (
                      <button key={r}
                        onClick={() => { setFilters(p => ({ ...p, rating: p.rating == r ? '' : r })); setPage(1); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-sm ${
                          filters.rating == r ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                        <span>{'⭐'.repeat(r)}</span>
                        <span>& above</span>
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Special */}
                <FilterSection title="Special Filters">
                  {[
                    { key: 'isFeatured', label: '⭐ Featured' },
                    { key: 'isBestSeller', label: '🔥 Best Seller' },
                    { key: 'isNewArrival', label: '🆕 New Arrival' },
                    { key: 'isTrending', label: '📈 Trending' },
                  ].map(({ key, label }) => (
                    <button key={key}
                      onClick={() => { setFilters(p => ({ ...p, [key]: p[key] ? '' : 'true' })); setPage(1); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors mb-1 ${
                        filters[key] ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}>
                      {label}
                      {filters[key] && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                    </button>
                  ))}
                </FilterSection>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </button>
                  <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:block">
                    {aiResults ? `${aiResults.products.length} AI results` : `${total} products`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>

                  <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    {[3, 4].map((cols) => (
                      <button key={cols} onClick={() => setGridCols(cols)}
                        className={`p-2 transition-colors ${gridCols === cols ? 'bg-primary-800 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        {cols === 3 ? <Grid className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Result Banner */}
              {aiResults && (
                <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 rounded-xl border border-primary-100 dark:border-primary-800 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <p className="text-primary-700 dark:text-primary-300 text-sm">
                    AI interpreted your search as: {aiResults.interpretation ? JSON.stringify(aiResults.interpretation) : 'Custom search'}
                  </p>
                </div>
              )}

              {/* Grid */}
              {loading && !aiSearching ? (
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
                  {Array(9).fill(null).map((_, i) => (
                    <div key={i} className="card h-80 skeleton" />
                  ))}
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-6xl mb-4 block">🔍</span>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">No products found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}
                >
                  <AnimatePresence>
                    {displayProducts.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Pagination */}
              {!aiResults && pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
                    Previous
                  </button>
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button key={pageNum} onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${
                          page === pageNum ? 'bg-primary-800 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}>
                        {pageNum}
                      </button>
                    );
                  })}
                  <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-gray-900 dark:text-white"
      >
        {title}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
