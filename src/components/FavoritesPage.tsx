import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { Property } from '../types';
import PropertyCard from './PropertyCard';

interface FavoritesPageProps {
  properties: Property[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (id: string) => void;
  onGoToSearch: () => void;
}

export default function FavoritesPage({ properties, isFavorite, onToggleFavorite, onSelectProperty, onGoToSearch }: FavoritesPageProps) {
  const favoriteProperties = properties.filter(p => isFavorite(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <Heart size={20} className="text-[#2d6a4f]" fill="currentColor" />
          <h1 className="text-2xl font-bold text-[#1a2744]">Saved Properties</h1>
        </div>
        <p className="text-sm text-gray-500">
          {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
        </p>
      </motion.div>

      {favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {favoriteProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectProperty}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-[#1a2744] mb-2">No saved properties yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Start exploring properties and save your favorites by clicking the heart icon.
          </p>
          <motion.button
            onClick={onGoToSearch}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a2744] text-white rounded-lg text-sm font-medium hover:bg-[#1a2744]/90 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            Browse Properties
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
