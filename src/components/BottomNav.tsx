import { motion } from 'framer-motion';
import { Home, Heart, MapPin, SlidersHorizontal } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  favoritesCount: number;
  onNavigate: (page: 'search' | 'favorites' | 'map') => void;
  onToggleFilters?: () => void;
}

export default function BottomNav({ currentPage, favoritesCount, onNavigate, onToggleFilters }: BottomNavProps) {
  const items = [
    { id: 'search', label: 'Search', icon: Home },
    { id: 'filters', label: 'Filters', icon: SlidersHorizontal },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'favorites', label: 'Saved', icon: Heart, badge: favoritesCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg safe-bottom lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map(item => {
          const isActive = currentPage === item.id || (item.id === 'search' && currentPage === 'detail');
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                if (item.id === 'filters') {
                  onToggleFilters?.();
                } else {
                  onNavigate(item.id as 'search' | 'favorites' | 'map');
                }
              }}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-[56px] transition-colors ${
                isActive ? 'text-[#1a2744]' : 'text-gray-400'
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-[#1a2744]/5 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#2d6a4f] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
