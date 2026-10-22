export interface Property {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'condo' | 'studio';
  intent: 'buy' | 'rent';
  price: number;
  pricePerMonth?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  neighborhood: string;
  description: string;
  amenities: string[];
  images: string[];
  agent: Agent;
  addedDate: string;
  featured: boolean;
  coordinates: { lat: number; lng: number };
}

export interface Agent {
  name: string;
  phone: string;
  email: string;
  photo: string;
  agency: string;
}

export interface Filters {
  location: string;
  propertyType: string;
  intent: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'recent';
}

export interface ViewingRequest {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
}
