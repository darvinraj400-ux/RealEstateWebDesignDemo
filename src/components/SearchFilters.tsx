import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Filters } from '../types';
import { LOCATIONS, PROPERTY_TYPES } from '../data/listings';

interface SearchFiltersProps {
  filters: Filters;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
  resultCount: number;
  compact?: boolean;
}

export default function SearchFilters({ filters, updateFilter, resetFilters, resultCount, compact = false }: SearchFiltersProps) {
  const selectClass = "w-full min-w-0 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1a2744] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] transition-all appearance-none cursor-pointer";
  const inputClass = "w-full min-w-0 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1a2744] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 focus:border-[#2d6a4f] transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <SlidersHorizontal size={18} className="text-[#2d6a4f] flex-shrink-0" />
          <h2 className="text-sm font-semibold text-[#1a2744] truncate">Search Filters</h2>
        </div>
        <motion.button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2d6a4f] transition-colors px-2 py-1 rounded flex-shrink-0"
          whileTap={{ scale: 0.95 }}
          aria-label="Reset all filters"
        >
          <RotateCcw size={12} />
          <span className="hidden sm:inline">Reset</span>
        </motion.button>
      </div>

      {/* Grid: single column in compact/sidebar mode, responsive otherwise */}
      <div className={compact
        ? "flex flex-col gap-3"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      }>
        {/* Location */}
        <div className="space-y-1 min-w-0">
          <label className="text-xs font-medium text-gray-500" htmlFor="location-filter">Location</label>
          <div className="relative">
            <select
              id="location-filter"
              value={filters.location}
              onChange={e => updateFilter('location', e.target.value)}
              className={selectClass}
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-1 min-w-0">
          <label className="text-xs font-medium text-gray-500" htmlFor="type-filter">Property Type</label>
          <div className="relative">
            <select
              id="type-filter"
              value={filters.propertyType}
              onChange={e => updateFilter('propertyType', e.target.value)}
              className={selectClass}
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{type === 'All Types' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Intent */}
        <div className="space-y-1 min-w-0">
          <label className="text-xs font-medium text-gray-500">Buy or Rent</label>
          <div className="flex flex-wrap gap-1.5">
            {['', 'buy', 'rent'].map(intent => (
              <motion.button
                key={intent}
                onClick={() => updateFilter('intent', intent)}
                className={`flex-1 min-w-[60px] px-2 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filters.intent === intent
                    ? 'bg-[#1a2744] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {intent === '' ? 'All' : intent.charAt(0).toUpperCase() + intent.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-1 min-w-0">
          <label className="text-xs font-medium text-gray-500" htmlFor="min-price">
            Min Price {filters.intent === 'rent' ? '($/mo)' : filters.intent === 'buy' ? '($)' : ''}
          </label>
          <input
            id="min-price"
            type="number"
            value={filters.minPrice || ''}
            onChange={e => updateFilter('minPrice', Number(e.target.value) || 0)}
            placeholder={filters.intent === 'rent' ? 'e.g. 1000' : filters.intent === 'buy' ? 'e.g. 300000' : '0'}
            className={inputClass}
          />
        </div>

        <div className="space-y-1 min-w-0">
          <label className="text-xs font-medium text-gray-500" htmlFor="max-price">
            Max Price {filters.intent === 'rent' ? '($/mo)' : filters.intent === 'buy' ? '($)' : ''}
          </label>
          <input
            id="max-price"
            type="number"
            value={filters.maxPrice === 10000000 ? '' : filters.maxPrice}
            onChange={e => updateFilter('maxPrice', Number(e.target.value) || 10000000)}
            placeholder={filters.intent === 'rent' ? 'e.g. 5000' : filters.intent === 'buy' ? 'e.g. 1000000' : 'No limit'}
            className={inputClass}
          />
        </div>

        {/* Sort */}
        <div className="space-y-1 min-w-0">
          <label className="text-xs font-medium text-gray-500" htmlFor="sort-filter">Sort By</label>
          <div className="relative">
            <select
              id="sort-filter"
              value={filters.sortBy}
              onChange={e => updateFilter('sortBy', e.target.value as Filters['sortBy'])}
              className={selectClass}
            >
              <option value="recent">Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-500 truncate">
          <span className="font-semibold text-[#1a2744]">{resultCount}</span> properties found
        </span>
        <span className="text-xs text-gray-400 ml-auto flex-shrink-0">(Demo)</span>
      </div>
    </motion.div>
  );
}
