import { useState, useMemo, useCallback } from 'react';
import { Property, Filters } from '../types';
import { DEMO_LISTINGS } from '../data/listings';

const defaultFilters: Filters = {
  location: 'All Locations',
  propertyType: 'All Types',
  intent: '',
  minPrice: 0,
  maxPrice: 10000000,
  sortBy: 'recent'
};

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => {
      // Reset price range when switching intent
      if (key === 'intent') {
        return { ...prev, [key]: value, minPrice: 0, maxPrice: 10000000 };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const filteredListings = useMemo(() => {
    let results = [...DEMO_LISTINGS];

    if (filters.location && filters.location !== 'All Locations') {
      results = results.filter(p => p.location === filters.location);
    }

    if (filters.propertyType && filters.propertyType !== 'All Types') {
      results = results.filter(p => p.type === filters.propertyType);
    }

    if (filters.intent) {
      results = results.filter(p => p.intent === filters.intent);
    }

    if (filters.intent === 'rent') {
      results = results.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    } else if (filters.intent === 'buy') {
      results = results.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    } else {
      results = results.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    }

    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'recent':
        results.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
        break;
    }

    return results;
  }, [filters]);

  return { filters, updateFilter, resetFilters, filteredListings };
}

export function usePropertyById(id: string | undefined) {
  return useMemo(() => {
    if (!id) return null;
    return DEMO_LISTINGS.find(p => p.id === id) || null;
  }, [id]);
}
