import { motion } from 'framer-motion';
import { Search, Building2, Key } from 'lucide-react';

interface HeroProps {
  onSearchFocus?: () => void;
}

export default function Hero({ onSearchFocus }: HeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2744] via-[#2a3d5e] to-[#1a2744] p-6 sm:p-8 lg:p-10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2d6a4f]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Key size={16} className="text-[#2d6a4f]" />
              <span className="text-xs font-medium text-[#2d6a4f] tracking-wider uppercase">Property Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
              Find Your Perfect<br />
              <span className="text-[#95d5b2]">Place to Call Home</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-lg mb-5">
              Discover premium apartments, houses, and condos for rent or purchase. 
              Browse curated listings with detailed information and save your favorites.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center gap-2 text-white/80">
              <Building2 size={16} />
              <span className="text-xs sm:text-sm">12 Premium Listings</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Search size={16} />
              <span className="text-xs sm:text-sm">Advanced Filters</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
