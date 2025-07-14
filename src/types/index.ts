export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  type: 'house' | 'apartment' | 'land' | 'office' | 'commercial';
  operation: 'sale' | 'rent';
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  city: string;
  zone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  description: string;
  features: string[];
  yearBuilt?: number;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  views: number;
  status: 'available' | 'sold' | 'rented' | 'pending';
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  company: string;
  verified: boolean;
  specialties: string[];
  experience: number;
  languages: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: 'admin' | 'employee' | 'interested';
  preferences: {
    maxPrice: number;
    minPrice: number;
    propertyTypes: string[];
    cities: string[];
    minBedrooms: number;
    maxBedrooms: number;
    features: string[];
  };
  favorites: string[];
  savedSearches: SearchFilters[];
  alertsEnabled: boolean;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface SearchFilters {
  query?: string;
  operation?: 'sale' | 'rent';
  type?: string;
  city?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  features?: string[];
  sortBy?: 'price' | 'date' | 'area' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface Recommendation {
  propertyId: string;
  score: number;
  reason: string;
  type: 'collaborative' | 'content' | 'trending';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'property' | 'properties' | 'action';
  data?: any;
}

export interface PropertyAlert {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  isActive: boolean;
  createdAt: string;
  lastNotified?: string;
}

export interface DashboardStats {
  totalProperties: number;
  totalUsers: number;
  totalAgents: number;
  monthlyViews: number;
  recentSales: number;
  averagePrice: number;
  topCities: { city: string; count: number }[];
  propertyTypeDistribution: { type: string; count: number }[];
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'view' | 'favorite' | 'search' | 'contact' | 'alert';
  propertyId?: string;
  metadata?: any;
  timestamp: string;
}