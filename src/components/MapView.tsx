import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Bed, Bath, Maximize, Heart } from 'lucide-react';
import { Property } from '../types';

interface MapViewProps {
  properties: Property[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (id: string) => void;
}

export default function MapView({ properties, isFavorite, onToggleFavorite, onSelectProperty }: MapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Create a simple map-like visualization
  const mapBounds = {
    minLat: 40.68,
    maxLat: 40.77,
    minLng: -74.11,
    maxLng: -73.94
  };

  const getPosition = (prop: Property) => {
    const x = ((prop.coordinates.lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - prop.coordinates.lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const formatPrice = (price: number, intent: string) => {
    if (intent === 'rent') return `$${price.toLocaleString()}/mo`;
    return `$${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Map Area */}
      <div className="flex-1 relative bg-[#e8e4df] overflow-hidden">
        {/* Map background pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" className="text-gray-300">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Area labels */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-[15%] left-[20%] text-xs text-gray-400 font-medium">Westside</span>
          <span className="absolute top-[25%] left-[50%] text-xs text-gray-400 font-medium">Downtown</span>
          <span className="absolute top-[40%] right-[15%] text-xs text-gray-400 font-medium">Eastside</span>
          <span className="absolute top-[55%] left-[35%] text-xs text-gray-400 font-medium">Midtown</span>
          <span className="absolute bottom-[20%] left-[25%] text-xs text-gray-400 font-medium">Harbor District</span>
          <span className="absolute bottom-[30%] right-[25%] text-xs text-gray-400 font-medium">Historic District</span>
        </div>

        {/* Water feature */}
        <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-[#c5d5e4]/40 pointer-events-none" />

        {/* Property pins */}
        {properties.map((property) => {
          const pos = getPosition(property);
          return (
            <motion.button
              key={property.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => setSelectedProperty(property)}
              className={`absolute transform -translate-x-1/2 -translate-y-full group z-10 ${
                selectedProperty?.id === property.id ? 'z-20' : ''
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`View ${property.title}`}
            >
              <div className={`relative px-2 py-1 rounded-lg text-xs font-bold shadow-lg transition-colors ${
                selectedProperty?.id === property.id
                  ? 'bg-[#2d6a4f] text-white'
                  : 'bg-white text-[#1a2744] hover:bg-[#1a2744] hover:text-white'
              }`}>
                {formatPrice(property.price, property.intent)}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 rotate-45 ${
                  selectedProperty?.id === property.id ? 'bg-[#2d6a4f]' : 'bg-white group-hover:bg-[#1a2744]'
                }`} />
              </div>
            </motion.button>
          );
        })}

        {/* Map legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <p className="text-xs font-medium text-[#1a2744] mb-1">Map View</p>
          <p className="text-xs text-gray-500">{properties.length} properties shown</p>
          <p className="text-xs text-gray-400 mt-1">Demo locations only</p>
        </div>
      </div>

      {/* Property detail panel */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#1a2744]">Property Details</h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  aria-label="Close panel"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Image */}
              <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-semibold text-[#1a2744] mb-1">{selectedProperty.title}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <MapPin size={12} />
                <span>{selectedProperty.neighborhood}, {selectedProperty.location}</span>
              </div>
              <p className="text-xl font-bold text-[#2d6a4f] mb-3">
                {selectedProperty.intent === 'rent'
                  ? `$${selectedProperty.price.toLocaleString()}/mo`
                  : `$${selectedProperty.price.toLocaleString()}`
                }
              </p>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Bed size={14} /> {selectedProperty.bedrooms}</span>
                <span className="flex items-center gap-1"><Bath size={14} /> {selectedProperty.bathrooms}</span>
                <span className="flex items-center gap-1"><Maximize size={14} /> {selectedProperty.area}m²</span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => onSelectProperty(selectedProperty.id)}
                  className="flex-1 py-2.5 bg-[#1a2744] text-white rounded-lg text-sm font-medium hover:bg-[#1a2744]/90 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.button>
                <motion.button
                  onClick={() => onToggleFavorite(selectedProperty.id)}
                  className={`w-11 h-11 rounded-lg flex items-center justify-center border transition-colors ${
                    isFavorite(selectedProperty.id)
                      ? 'bg-[#2d6a4f]/10 border-[#2d6a4f]/20 text-[#2d6a4f]'
                      : 'border-gray-200 text-gray-400 hover:text-[#2d6a4f]'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isFavorite(selectedProperty.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={18} fill={isFavorite(selectedProperty.id) ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
