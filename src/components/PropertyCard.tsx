import { motion } from 'framer-motion';
import { Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (id: string) => void;
  index: number;
}

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onSelect, index }: PropertyCardProps) {
  const formatPrice = (price: number, intent: string) => {
    if (intent === 'rent') return `$${price.toLocaleString()}/mo`;
    return `$${price.toLocaleString()}`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(property.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(property.id)}
      aria-label={`View details for ${property.title}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Favorite button */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(property.id); }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isFavorite ? 'bg-[#2d6a4f] text-white' : 'bg-white/90 text-gray-600 hover:text-[#2d6a4f]'
          }`}
          whileTap={{ scale: 0.85 }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
            property.intent === 'buy' ? 'bg-[#1a2744] text-white' : 'bg-[#2d6a4f] text-white'
          }`}>
            {property.intent === 'buy' ? 'For Sale' : 'For Rent'}
          </span>
          {property.featured && (
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#1a2744] text-sm leading-tight line-clamp-1">
            {property.title}
          </h3>
        </div>

        <p className="text-lg font-bold text-[#2d6a4f] mb-2">
          {formatPrice(property.price, property.intent)}
        </p>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin size={12} />
          <span>{property.neighborhood}, {property.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Bed size={14} className="text-gray-400" />
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Bath size={14} className="text-gray-400" />
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Maximize size={14} className="text-gray-400" />
            <span>{property.area}m²</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
