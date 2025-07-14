import { Property, Agent, User, SearchFilters, Recommendation } from '../types';
import { mockProperties, mockAgents, mockUser } from '../data/mockData';

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getProperties(filters: SearchFilters = {}): Promise<Property[]> {
    await delay(500);
    let filtered = [...mockProperties];

    // Apply filters
    if (filters.operation) {
      filtered = filtered.filter(p => p.operation === filters.operation);
    }
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.city) {
      filtered = filtered.filter(p => p.city.toLowerCase().includes(filters.city!.toLowerCase()));
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
    return mockProperties.find(p => p.id === id) || null;
  },

  async getFeaturedProperties(): Promise<Property[]> {
    await delay(400);
    return mockProperties.filter(p => p.featured);
  },

  async getRecommendations(userId: string, propertyId?: string): Promise<Recommendation[]> {
    await delay(600);
    
    // Simulate recommendation algorithm
    const recommendations: Recommendation[] = [];
    const userFavorites = mockUser.favorites;
    
    // Content-based recommendations
    if (propertyId) {
      const currentProperty = mockProperties.find(p => p.id === propertyId);
      if (currentProperty) {
        const similar = mockProperties.filter(p => 
          p.id !== propertyId && 
          p.type === currentProperty.type &&
          Math.abs(p.price - currentProperty.price) < currentProperty.price * 0.3
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
    const collaborative = mockProperties.filter(p => 
      !userFavorites.includes(p.id) && 
      p.price <= mockUser.preferences.maxPrice &&
      p.price >= mockUser.preferences.minPrice
    );
    
    collaborative.slice(0, 3).forEach(p => {
      recommendations.push({
        propertyId: p.id,
        score: 0.7 + Math.random() * 0.3,
        reason: 'Based on users with similar preferences',
        type: 'collaborative'
      });
    });
    
    // Trending properties
    const trending = mockProperties
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
  }
};

export const agentService = {
  async getAgentById(id: string): Promise<Agent | null> {
    await delay(200);
    return mockAgents.find(a => a.id === id) || null;
  },

  async getAgents(): Promise<Agent[]> {
    await delay(300);
    return mockAgents;
  }
};

export const userService = {
  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    return mockUser;
  },

  async updateUser(user: Partial<User>): Promise<User> {
    await delay(300);
    return { ...mockUser, ...user };
  },

  async toggleFavorite(propertyId: string): Promise<string[]> {
    await delay(200);
    const favorites = [...mockUser.favorites];
    const index = favorites.indexOf(propertyId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(propertyId);
    }
    
    mockUser.favorites = favorites;
    return favorites;
  }
};