import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, Bell, User, Menu, X, Search, Sun, Moon,
  ChevronDown, Sparkles, Home, Package, Info, Phone, Wand2, LogOut
} from 'lucide-react';
import { toggleDarkMode, toggleMobileMenu, setSearchQuery } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { openCart } from '../../store/slices/cartSlice';
import BrandLogo from '../ui/BrandLogo';

const NAV_LINKS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/shop', label: 'Shop', icon: Package },
  { path: '/ai-recommendations', label: 'AI Picks', icon: Sparkles, highlight: true },
  { path: '/ai-room-designer', label: 'Room Design', icon: Wand2 },
  { path: '/custom-order', label: 'Custom Order', icon: Package },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Phone },
];

// Bottom nav items (mobile only - most important 5)
const BOTTOM_NAV = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/shop', label: 'Shop', icon: Package },
  { path: '/ai-recommendations', label: 'AI', icon: Sparkles },
  { path: '/wishlist', label: 'Wishlist', icon: Heart, authRequired: true },
];

// Light content pages — navbar stays solid so it never overlaps breadcrumbs/body text
const isLightContentRoute = (pathname) =>
  pathname.startsWith('/product/') ||
  pathname.startsWith('/cart') ||
  pathname.startsWith('/checkout') ||
  pathname.startsWith('/orders') ||
  pathname.startsWith('/profile') ||
  pathname.startsWith('/wishlist');

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, mobileMenuOpen } = useSelector(s => s.ui);
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { cart } = useSelector(s => s.cart);
  const { unreadCount } = useSelector(s => s.notifications);

  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  const [scrolled, setScrolled] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const navSolid = scrolled || navHovered || isLightContentRoute(location.pathname);
  const iconBtnClass = `p-2 rounded-xl transition-all duration-300 ease-in-out text-white hover:bg-white/15`;

  const navStyle = {
    background: navSolid ? '#1E3A8A' : 'rgba(255,255,255,0.1)',
    backdropFilter: navSolid ? 'none' : 'blur(10px)',
    WebkitBackdropFilter: navSolid ? 'none' : 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
  };
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    dispatch(setSearchQuery(searchInput));
    navigate(`/shop?q=${encodeURIComponent(searchInput)}`);
    setSearchOpen(false);
    setSearchInput('');
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  const isActiveNav = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
        style={navStyle}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navSolid ? 'shadow-lg' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[4.5rem] lg:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0" aria-label="Anura Furniture – Dekatana home">
              <BrandLogo forDarkBg={true} size="lg" className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />
              <div className="hidden sm:block">
                <p className="font-display font-bold text-sm leading-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">Anura Furniture</p>
                <p className="text-[10px] leading-tight tracking-widest uppercase text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">Dekatana</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_LINKS.map(({ path, label, highlight }) => {
                const active = isActiveNav(path);
                return (
                <Link key={path} to={path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out ${
                    active
                      ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/25'
                      : highlight
                        ? 'text-cyan-300 hover:bg-white/10'
                        : 'text-white/90 hover:bg-white/15'
                  }`}
                >
                  {label}
                </Link>
              );})}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search */}
              <button onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
                className={iconBtnClass}>
                <Search className="w-5 h-5" />
              </button>

              {/* Dark Mode */}
              <button onClick={() => dispatch(toggleDarkMode())}
                className={iconBtnClass}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated && (
                <>
                  {/* Wishlist - desktop only */}
                  <Link to="/wishlist" className={`${iconBtnClass} hidden lg:flex`}>
                    <Heart className="w-5 h-5" />
                  </Link>

                  {/* Notifications */}
                  <Link to="/notifications" className={`${iconBtnClass} relative hidden sm:flex`}>
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </Link>
                </>
              )}

              {/* Cart */}
              <button onClick={() => dispatch(openCart())}
                className={`${iconBtnClass} relative`}>
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount > 9 ? '9+' : cartCount}</span>}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-300 ease-in-out hover:bg-white/15">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-700 to-cyan-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                      {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 text-white/80 hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-glass border border-white/20 overflow-hidden z-50">
                        <div className="p-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                        {[
                          { path: '/profile', label: 'My Profile', icon: User },
                          { path: '/orders', label: 'My Orders', icon: Package },
                          { path: '/wishlist', label: 'Wishlist', icon: Heart },
                          ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin Dashboard', icon: Sparkles }] : []),
                        ].map(({ path, label, icon: Icon }) => (
                          <Link key={path} to={path} onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                            <Icon className="w-4 h-4 text-gray-400" />{label}
                          </Link>
                        ))}
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-white/10">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="ml-1 px-3 sm:px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ease-in-out shadow-glow bg-white/95 text-primary-900 hover:bg-white border border-white/30">
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle - hamburger for full menu */}
              <button onClick={() => dispatch(toggleMobileMenu())} className={`lg:hidden ${iconBtnClass}`}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/15 transition-all duration-300 ease-in-out"
              style={{ background: '#1E3A8A' }}>
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map(({ path, label, icon: Icon, highlight }) => (
                  <Link key={path} to={path}
                    onClick={() => dispatch(toggleMobileMenu())}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out ${
                      isActiveNav(path)
                        ? 'bg-white/20 text-white ring-1 ring-white/20'
                        : highlight
                          ? 'text-cyan-300 hover:bg-white/10'
                          : 'text-white/90 hover:bg-white/15'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />{label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <button onClick={() => { handleLogout(); dispatch(toggleMobileMenu()); }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 w-full transition-all">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation" style={{ touchAction: 'manipulation' }}>
        <div className="mobile-bottom-nav-inner">

          {/* Home */}
          <Link
            to="/"
            className={`mobile-nav-btn ${isActiveNav('/') ? 'active' : ''}`}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="nav-icon-wrap">
              <Home className="w-5 h-5" />
            </div>
            <span className="mobile-nav-label">Home</span>
          </Link>

          {/* Shop */}
          <Link
            to="/shop"
            className={`mobile-nav-btn ${isActiveNav('/shop') ? 'active' : ''}`}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="nav-icon-wrap">
              <Package className="w-5 h-5" />
            </div>
            <span className="mobile-nav-label">Shop</span>
          </Link>

          {/* AI - glowing center button */}
          <Link
            to="/ai-recommendations"
            className="mobile-nav-btn"
            style={{ touchAction: 'manipulation' }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              background: 'linear-gradient(135deg, #1e40af, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(6,182,212,0.45)',
              transform: isActiveNav('/ai-recommendations') || isActiveNav('/ai-room-designer') ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s',
              pointerEvents: 'none',
            }}>
              <Sparkles style={{ width: 20, height: 20 }} />
            </div>
            <span className="mobile-nav-label" style={{ color: '#2563eb' }}>AI</span>
          </Link>

          {/* Cart */}
          <button
            onClick={() => dispatch(openCart())}
            className="mobile-nav-btn"
            style={{ touchAction: 'manipulation' }}
            type="button"
          >
            <div className="nav-icon-wrap" style={{ position: 'relative' }}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#ef4444', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span className="mobile-nav-label">Cart</span>
          </button>

          {/* Profile / Sign In */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className={`mobile-nav-btn ${isActiveNav('/profile') ? 'active' : ''}`}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="nav-icon-wrap">
                <div style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: 'linear-gradient(135deg, #1e40af, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 10, fontWeight: 700, overflow: 'hidden',
                  pointerEvents: 'none',
                }}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : user?.name?.charAt(0)?.toUpperCase()
                  }
                </div>
              </div>
              <span className="mobile-nav-label">Me</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="mobile-nav-btn"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="nav-icon-wrap">
                <User className="w-5 h-5" />
              </div>
              <span className="mobile-nav-label">Sign In</span>
            </Link>
          )}

        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
            <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input ref={searchRef} value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search furniture, styles, rooms…"
                  className="w-full pl-12 pr-28 py-4 bg-white dark:bg-gray-900 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 shadow-2xl text-base border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-800 text-white rounded-xl text-sm font-medium">Search</button>
              </div>
              <p className="text-white/50 text-sm mt-3 text-center">Try: "modern sofa under Rs.80,000"</p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
