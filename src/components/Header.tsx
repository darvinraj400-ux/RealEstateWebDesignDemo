import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Heart, MapPin } from 'lucide-react';

interface HeaderProps {
  favoritesCount: number;
  onNavigate: (page: 'search' | 'favorites' | 'map') => void;
  currentPage: string;
}

export default function Header({ favoritesCount, onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'search', label: 'Search', icon: Home },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoritesCount },
    { id: 'map', label: 'Map View', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-2 cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-[#1a2744] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-[#1a2744] tracking-tight">KEYSTONE</h1>
              <p className="text-[10px] text-gray-500 -mt-1 tracking-widest">LIVING</p>
            </div>
          </motion.button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id as 'search' | 'favorites' | 'map')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#1a2744]/5 text-[#1a2744]'
                    : 'text-gray-600 hover:text-[#1a2744] hover:bg-gray-50'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon size={18} />
                {item.label}
                {item.badge ? (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2d6a4f] text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </motion.button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => { onNavigate(item.id as 'search' | 'favorites' | 'map'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-[#1a2744]/5 text-[#1a2744]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon size={20} />
                  {item.label}
                  {item.badge ? (
                    <span className="ml-auto w-6 h-6 bg-[#2d6a4f] text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
