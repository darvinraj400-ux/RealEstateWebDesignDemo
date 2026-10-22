import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ArrowLeft, Heart, Bed, Bath, Maximize, MapPin, Phone, Mail, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { Property, ViewingRequest } from '../types';

interface PropertyDetailProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
}

export default function PropertyDetail({ property, isFavorite, onToggleFavorite, onBack }: PropertyDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<ViewingRequest>({
    name: '', email: '', phone: '', date: '', time: '', message: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<ViewingRequest>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number, intent: string) => {
    if (intent === 'rent') return `$${price.toLocaleString()}/month`;
    return `$${price.toLocaleString()}`;
  };

  const validateForm = (): boolean => {
    const errors: Partial<ViewingRequest> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setFormSubmitted(true);
    }
  };

  const nextImage = useCallback(() => setCurrentImage(prev => (prev + 1) % property.images.length), [property.images.length]);
  const prevImage = useCallback(() => setCurrentImage(prev => (prev - 1 + property.images.length) % property.images.length), [property.images.length]);

  const x = useMotionValue(0);
  const scale = useTransform(x, [-150, 0, 150], [0.9, 1, 0.9]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      nextImage();
    } else if (info.offset.x > threshold) {
      prevImage();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Top bar */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1a2744] transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Results</span>
          </motion.button>
          <motion.button
            onClick={() => onToggleFavorite(property.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isFavorite ? 'bg-[#2d6a4f]/10 text-[#2d6a4f]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
          </motion.button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-[16/9] sm:aspect-[2/1] touch-pan-y">
          <motion.div
            className="w-full h-full cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x, scale, opacity }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={property.images[currentImage]}
                alt={`${property.title} - Image ${currentImage + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>

          {/* Navigation arrows */}
          <motion.button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            whileTap={{ scale: 0.9 }}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            whileTap={{ scale: 0.9 }}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </motion.button>

          {/* Image counter */}
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 text-white text-xs rounded-full">
            {currentImage + 1} / {property.images.length}
          </div>

          {/* Swipe hint on mobile */}
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 text-white/80 text-[10px] rounded-full sm:hidden">
            ← Swipe →
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {property.images.map((img, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentImage ? 'border-[#2d6a4f] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Property Info */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  property.intent === 'buy' ? 'bg-[#1a2744]/10 text-[#1a2744]' : 'bg-[#2d6a4f]/10 text-[#2d6a4f]'
                }`}>
                  {property.intent === 'buy' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="text-xs text-gray-400 capitalize">{property.type}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2744] mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} />
                <span className="text-sm">{property.neighborhood}, {property.location}</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-[#2d6a4f]">
              {formatPrice(property.price, property.intent)}
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-gray-100">
              <div className="text-center">
                <Bed size={24} className="mx-auto text-gray-400 mb-1" />
                <p className="text-lg font-semibold text-[#1a2744]">{property.bedrooms}</p>
                <p className="text-xs text-gray-500">Bedrooms</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <Bath size={24} className="mx-auto text-gray-400 mb-1" />
                <p className="text-lg font-semibold text-[#1a2744]">{property.bathrooms}</p>
                <p className="text-xs text-gray-500">Bathrooms</p>
              </div>
              <div className="text-center">
                <Maximize size={24} className="mx-auto text-gray-400 mb-1" />
                <p className="text-lg font-semibold text-[#1a2744]">{property.area}</p>
                <p className="text-xs text-gray-500">m² Area</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-[#1a2744] mb-3">About This Property</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-[#1a2744] mb-3">Amenities & Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.amenities.map((amenity, idx) => (
                  <motion.div
                    key={amenity}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check size={14} className="text-[#2d6a4f] flex-shrink-0" />
                    {amenity}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Demo Notice:</strong> This listing is demonstration data only. The property shown is fictional and not available for actual purchase or rental. No real transactions can be made through this platform.
              </p>
            </div>
          </div>

          {/* Sidebar - Agent & Form */}
          <div className="space-y-4">
            {/* Agent Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-[#1a2744] mb-3">Listing Agent</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#1a2744]/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-[#1a2744]">
                    {property.agent.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-[#1a2744]">{property.agent.name}</p>
                  <p className="text-xs text-gray-500">{property.agent.agency}</p>
                </div>
              </div>
              <div className="space-y-2">
                <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2d6a4f] transition-colors">
                  <Phone size={14} />
                  {property.agent.phone}
                </a>
                <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2d6a4f] transition-colors">
                  <Mail size={14} />
                  {property.agent.email}
                </a>
              </div>
            </div>

            {/* Request Viewing */}
            {!showForm && !formSubmitted && (
              <motion.button
                onClick={() => setShowForm(true)}
                className="w-full py-3 bg-[#1a2744] text-white rounded-xl font-medium text-sm hover:bg-[#1a2744]/90 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                Request a Viewing
              </motion.button>
            )}

            {/* Viewing Form */}
            <AnimatePresence>
              {showForm && !formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl border border-gray-100 p-5 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[#1a2744]">Request Viewing</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close form">
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all ${
                          formErrors.name ? 'border-red-300' : 'border-gray-200 focus:border-[#2d6a4f]'
                        }`}
                        aria-label="Your name"
                        aria-invalid={!!formErrors.name}
                      />
                      {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all ${
                          formErrors.email ? 'border-red-300' : 'border-gray-200 focus:border-[#2d6a4f]'
                        }`}
                        aria-label="Email address"
                        aria-invalid={!!formErrors.email}
                      />
                      {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all ${
                          formErrors.phone ? 'border-red-300' : 'border-gray-200 focus:border-[#2d6a4f]'
                        }`}
                        aria-label="Phone number"
                        aria-invalid={!!formErrors.phone}
                      />
                      {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all ${
                            formErrors.date ? 'border-red-300' : 'border-gray-200 focus:border-[#2d6a4f]'
                          }`}
                          aria-label="Preferred date"
                          aria-invalid={!!formErrors.date}
                        />
                        {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
                      </div>
                      <div>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                          className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all ${
                            formErrors.time ? 'border-red-300' : 'border-gray-200 focus:border-[#2d6a4f]'
                          }`}
                          aria-label="Preferred time"
                          aria-invalid={!!formErrors.time}
                        />
                        {formErrors.time && <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>}
                      </div>
                    </div>
                    <div>
                      <textarea
                        placeholder="Additional message (optional)"
                        value={formData.message}
                        onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] transition-all resize-none"
                        aria-label="Additional message"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="w-full py-3 bg-[#2d6a4f] text-white rounded-lg font-medium text-sm hover:bg-[#2d6a4f]/90 transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Request
                    </motion.button>
                    <p className="text-xs text-gray-400 text-center">
                      This is a demo form — no real request will be sent.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirmation */}
            <AnimatePresence>
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#2d6a4f]/5 border border-[#2d6a4f]/20 rounded-xl p-5 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-12 h-12 bg-[#2d6a4f] rounded-full flex items-center justify-center mx-auto mb-3"
                  >
                    <Check size={24} className="text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-[#1a2744] mb-1">Request Submitted</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Thank you, {formData.name}. Your viewing request has been received.
                  </p>
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    Demo only — no actual request was sent to any agent.
                  </p>
                  <motion.button
                    onClick={() => { setFormSubmitted(false); setShowForm(false); setFormData({ name: '', email: '', phone: '', date: '', time: '', message: '' }); }}
                    className="mt-3 text-sm text-[#2d6a4f] font-medium hover:underline"
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
