import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, ArrowRight, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import BrandLogo from '../ui/BrandLogo';
import { getCurrentYear } from '../../utils/dates';

const QUICK_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/ai-recommendations', label: 'AI Recommendations' },
  { path: '/ai-room-designer', label: 'Room Designer' },
  { path: '/custom-order', label: 'Custom Orders' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact' },
];

const CATEGORIES = ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Kids Room', 'Storage'];

export default function Footer() {
  const currentYear = getCurrentYear();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 pt-16 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-5" aria-label="Anura Furniture – Dekatana home">
              <BrandLogo forDarkBg size="xl" className="h-24 w-24 drop-shadow-lg" />
              <div>
                <p className="font-display font-bold text-white text-lg leading-tight">Anura Furniture</p>
                <p className="text-xs text-gray-400 leading-tight tracking-widest uppercase">Dekatana</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-2 font-medium italic">"Furniture කලාවේ මහ ගෙදර"</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Sri Lanka's premier destination for premium, modern furniture. Crafting spaces that inspire living.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
                { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
                { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-800 text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all"
                  aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />{label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-5">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link to={`/shop?category=${encodeURIComponent(cat.toLowerCase())}`}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />{cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-5">Contact & Newsletter</h4>
            <ul className="space-y-3 mb-6">
              {[
                { icon: MapPin, text: 'Dekatana, Kegalle, Sri Lanka' },
                { icon: Phone, text: '+94 72 330 3946', href: 'tel:+94723303946' },
                { icon: Mail, text: 'hello@anurafurniture.lk', href: 'mailto:hello@anurafurniture.lk' },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  {href ? (
                    <a href={href} className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors text-sm">
                      <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />{text}
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-gray-400 text-sm">
                      <Icon className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />{text}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Subscribe for offers & news</p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email"
                  className="flex-1 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors" />
                <button type="submit" className="px-3 py-2.5 bg-primary-800 hover:bg-primary-700 text-white rounded-xl transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {currentYear} Anura Furniture – Dekatana. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { path: '/privacy-policy', label: 'Privacy Policy' },
              { path: '/terms', label: 'Terms of Service' },
              { path: '/sitemap.xml', label: 'Sitemap' },
            ].map(({ path, label }) => (
              <Link key={label} to={path} className="text-gray-500 hover:text-primary-400 text-xs transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        {/* WhatsApp Float */}
        <a href="https://wa.me/94723303946" target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
          aria-label="Chat on WhatsApp">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
