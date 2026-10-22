import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Bed, Bath, Maximize, Heart } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Property } from '../types';

// Fix leaflet default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom price marker icon using divIcon
function createPriceIcon(price: number, intent: string, isSelected: boolean): L.DivIcon {
  const formattedPrice = intent === 'rent'
    ? `$${price.toLocaleString()}`
    : `$${(price / 1000).toFixed(0)}K`;

  return L.divIcon({
    className: 'custom-price-marker',
    html: `<div style="
      background: ${isSelected ? '#2d6a4f' : '#ffffff'};
      color: ${isSelected ? '#ffffff' : '#1a2744'};
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      font-family: Inter, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      border: 2px solid ${isSelected ? '#2d6a4f' : '#e5e7eb'};
      white-space: nowrap;
      position: relative;
      transform: translateX(-50%);
    ">${formattedPrice}<div style="
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 8px;
      height: 8px;
      background: ${isSelected ? '#2d6a4f' : '#ffffff'};
      border-right: 2px solid ${isSelected ? '#2d6a4f' : '#e5e7eb'};
      border-bottom: 2px solid ${isSelected ? '#2d6a4f' : '#e5e7eb'};
    "></div></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// Component to fit map bounds to markers
function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map(p => [p.coordinates.lat, p.coordinates.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [properties, map]);

  return null;
}

interface MapViewProps {
  properties: Property[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (id: string) => void;
}

export default function MapView({ properties, isFavorite, onToggleFavorite, onSelectProperty }: MapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Default center for NYC area
  const defaultCenter: [number, number] = [40.7282, -74.02];

  return (
    <div className="h-[calc(100vh-6.5rem)] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Map Area */}
      <div className="flex-1 relative min-h-[300px]">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          className="h-full w-full z-0"
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          {/* OpenStreetMap tiles - free, no API key needed */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Fit bounds to properties */}
          <FitBounds properties={properties} />

          {/* Property markers */}
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.coordinates.lat, property.coordinates.lng]}
              icon={createPriceIcon(
                property.price,
                property.intent,
                selectedProperty?.id === property.id
              )}
              eventHandlers={{
                click: () => setSelectedProperty(property),
              }}
            >
              <Popup>
                <div className="text-center p-1">
                  <strong className="text-sm">{property.title}</strong>
                  <br />
                  <span className="text-xs text-gray-600">{property.neighborhood}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map legend overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md border border-gray-100">
          <p className="text-xs font-semibold text-[#1a2744] mb-1">Map View</p>
          <p className="text-xs text-gray-500">{properties.length} properties shown</p>
          <p className="text-[10px] text-gray-400 mt-1">Click markers to view details</p>
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
            className="w-full lg:w-96 lg:max-h-full bg-white border-t lg:border-t-0 lg:border-l border-gray-100 overflow-y-auto"
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
