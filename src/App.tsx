import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchFilters from './components/SearchFilters';
import PropertyCard from './components/PropertyCard';
import PropertyDetail from './components/PropertyDetail';
import MapView from './components/MapView';
import FavoritesPage from './components/FavoritesPage';
import BottomNav from './components/BottomNav';
import { useFavorites } from './hooks/useFavorites';
import { useFilters, usePropertyById } from './hooks/useFilters';
import { DEMO_LISTINGS } from './data/listings';

type Page = 'search' | 'favorites' | 'map' | 'detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('search');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { filters, updateFilter, resetFilters, filteredListings } = useFilters();
  const selectedProperty = usePropertyById(selectedPropertyId || undefined);

  const handleNavigate = useCallback((page: 'search' | 'favorites' | 'map') => {
    setCurrentPage(page);
    setSelectedPropertyId(null);
    if (page === 'search') setShowFilters(false);
  }, []);

  const handleSelectProperty = useCallback((id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedPropertyId(null);
    setCurrentPage('search');
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <Header
        favoritesCount={favorites.length}
        onNavigate={handleNavigate}
        currentPage={currentPage === 'detail' ? 'search' : currentPage}
      />

      {/* Demo banner */}
      <div className="bg-[#1a2744]/5 border-b border-[#1a2744]/10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-xs text-[#1a2744]/70 text-center">
            <strong>Demo Platform</strong> — All listings are fictional demonstration data. No real properties or transactions.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentPage === 'detail' && selectedProperty ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PropertyDetail
              property={selectedProperty}
              isFavorite={isFavorite(selectedProperty.id)}
              onToggleFavorite={toggleFavorite}
              onBack={handleBackFromDetail}
            />
          </motion.div>
        ) : currentPage === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MapView
              properties={filteredListings}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onSelectProperty={handleSelectProperty}
            />
          </motion.div>
        ) : currentPage === 'favorites' ? (
          <motion.div
            key="favorites"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FavoritesPage
              properties={DEMO_LISTINGS}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onSelectProperty={handleSelectProperty}
              onGoToSearch={() => handleNavigate('search')}
            />
          </motion.div>
        ) : (
          <motion.main
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6"
          >
            {/* Hero */}
            <Hero />

            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-4">
              <motion.button
                onClick={handleToggleFilters}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#1a2744] shadow-sm"
                whileTap={{ scale: 0.98 }}
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {!showFilters && filteredListings.length !== DEMO_LISTINGS.length && (
                  <span className="ml-1 w-5 h-5 bg-[#2d6a4f] text-white text-xs rounded-full flex items-center justify-center">
                    ✓
                  </span>
                )}
              </motion.button>
            </div>

            {/* Mobile filters panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="lg:hidden mb-4 overflow-hidden"
                >
                  <SearchFilters
                    filters={filters}
                    updateFilter={updateFilter}
                    resetFilters={resetFilters}
                    resultCount={filteredListings.length}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Split layout: filters on left, results on right */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters sidebar - desktop always visible */}
              <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <SearchFilters
                    filters={filters}
                    updateFilter={updateFilter}
                    resetFilters={resetFilters}
                    resultCount={filteredListings.length}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 min-w-0">
                {filteredListings.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    <AnimatePresence>
                      {filteredListings.map((property, index) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={isFavorite(property.id)}
                          onToggleFavorite={toggleFavorite}
                          onSelect={handleSelectProperty}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-[#1a2744] mb-2">No properties found</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Try adjusting your filters to see more results.
                    </p>
                    <motion.button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-medium hover:bg-[#1a2744]/90 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset Filters
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer */}
      {currentPage !== 'detail' && currentPage !== 'map' && (
        <footer className="border-t border-gray-100 bg-white mt-12 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#1a2744] rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-xs">K</span>
                </div>
                <span className="text-sm font-semibold text-[#1a2744]">KEYSTONE LIVING</span>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Demo platform — All listings are fictional. No real properties or transactions available.
              </p>
              <p className="text-xs text-gray-400">
                © 2024 Keystone Living (Demo)
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Bottom Navigation - Mobile only */}
      <BottomNav
        currentPage={currentPage}
        favoritesCount={favorites.length}
        onNavigate={handleNavigate}
        onToggleFilters={handleToggleFilters}
      />
    </div>
  );
}
