import { Property, SearchFilters, Recommendation } from '../types';
import { propertiesData } from '../data/properties';

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const propertiesService = {
  async getAllProperties(): Promise<Property[]> {
    await delay(300);
    return [...propertiesData];
  },

  async getProperties(filters: SearchFilters = {}): Promise<Property[]> {
    await delay(500);
    let filtered = [...propertiesData];

    // Apply filters
    if (filters.operation) {
      filtered = filtered.filter(p => p.operation === filters.operation);
    }
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.city) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    if (filters.zone) {
      filtered = filtered.filter(p => 
        p.zone.toLowerCase().includes(filters.zone!.toLowerCase())
      );
    }
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.zone.toLowerCase().includes(query)
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.minBedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= filters.minBedrooms!);
    }
    if (filters.maxBedrooms) {
      filtered = filtered.filter(p => p.bedrooms <= filters.maxBedrooms!);
    }
    if (filters.minBathrooms) {
      filtered = filtered.filter(p => p.bathrooms >= filters.minBathrooms!);
    }
    if (filters.maxBathrooms) {
      filtered = filtered.filter(p => p.bathrooms <= filters.maxBathrooms!);
    }
    if (filters.minArea) {
      filtered = filtered.filter(p => p.area >= filters.minArea!);
    }
    if (filters.maxArea) {
      filtered = filtered.filter(p => p.area <= filters.maxArea!);
    }
    if (filters.features?.length) {
      filtered = filtered.filter(p => 
        filters.features!.some(feature => p.features.includes(feature))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: number | string, bValue: number | string;
        
        switch (filters.sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'date':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'area':
            aValue = a.area;
            bValue = b.area;
            break;
          default:
            aValue = a.views;
            bValue = b.views;
        }
        
        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return filtered;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    await delay(300);
    const property = propertiesData.find(p => p.id === id);
    if (property) {
      // Increment view count
      property.views += 1;
    }
    return property || null;
  },

  async getFeaturedProperties(): Promise<Property[]> {
    await delay(400);
    return propertiesData.filter(p => p.featured);
  },

  async getRecommendations(userId: string, propertyId?: string): Promise<Recommendation[]> {
    await delay(600);
    
    // Get user favorites from localStorage
    const currentUser = localStorage.getItem('currentUser');
    const userFavorites = currentUser ? JSON.parse(currentUser).favorites || [] : [];
    
    const recommendations: Recommendation[] = [];
    
    // Content-based recommendations
    if (propertyId) {
      const currentProperty = propertiesData.find(p => p.id === propertyId);
      if (currentProperty) {
        const similar = propertiesData.filter(p => 
          p.id !== propertyId && 
          p.type === currentProperty.type &&
          Math.abs(p.price - currentProperty.price) < currentProperty.price * 0.3 &&
          p.city === currentProperty.city
        );
        
        similar.forEach(p => {
          recommendations.push({
            propertyId: p.id,
            score: 0.8 + Math.random() * 0.2,
            reason: `Similar to ${currentProperty.title}`,
            type: 'content'
          });
        });
      }
    }
    
    // Collaborative filtering simulation
    const collaborative = propertiesData.filter(p => 
      !userFavorites.includes(p.id) && 
      p.price <= 800000 // Simulate user preference
    );
    
    collaborative.slice(0, 3).forEach(p => {
      if (!recommendations.some(r => r.propertyId === p.id)) {
        recommendations.push({
          propertyId: p.id,
          score: 0.7 + Math.random() * 0.3,
          reason: 'Based on users with similar preferences',
          type: 'collaborative'
        });
      }
    });
    
    // Trending properties
    const trending = propertiesData
      .sort((a, b) => b.views - a.views)
      .slice(0, 2);
    
    trending.forEach(p => {
      if (!recommendations.some(r => r.propertyId === p.id)) {
        recommendations.push({
          propertyId: p.id,
          score: 0.6 + Math.random() * 0.2,
          reason: 'Trending property',
          type: 'trending'
        });
      }
    });
    
    return recommendations.sort((a, b) => b.score - a.score).slice(0, 6);
  },

  async searchProperties(query: string): Promise<Property[]> {
    await delay(400);
    const searchQuery = query.toLowerCase();
    
    return propertiesData.filter(property => 
      property.title.toLowerCase().includes(searchQuery) ||
      property.description.toLowerCase().includes(searchQuery) ||
      property.city.toLowerCase().includes(searchQuery) ||
      property.zone.toLowerCase().includes(searchQuery) ||
      property.address.toLowerCase().includes(searchQuery) ||
      property.features.some(feature => feature.toLowerCase().includes(searchQuery))
    );
  }
};