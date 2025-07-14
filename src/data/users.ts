import { User } from '../types';

export const usersData: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@estatehub.com',
    name: 'Administrator',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+1 (555) 000-0001',
    role: 'admin',
    preferences: {
      maxPrice: 1000000,
      minPrice: 0,
      propertyTypes: ['apartment', 'house', 'office', 'commercial'],
      cities: ['New York', 'Los Angeles', 'Chicago', 'Miami'],
      minBedrooms: 1,
      maxBedrooms: 10,
      features: []
    },
    favorites: [],
    savedSearches: [],
    alertsEnabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-20T10:30:00Z',
    isActive: true
  },
  {
    id: '2',
    username: 'agent1',
    email: 'sarah.johnson@estatehub.com',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+1 (555) 123-4567',
    role: 'employee',
    preferences: {
      maxPrice: 800000,
      minPrice: 100000,
      propertyTypes: ['apartment', 'house'],
      cities: ['New York', 'Los Angeles'],
      minBedrooms: 1,
      maxBedrooms: 5,
      features: ['Pool', 'Gym', 'Parking']
    },
    favorites: ['1', '3'],
    savedSearches: [],
    alertsEnabled: true,
    createdAt: '2024-01-05T00:00:00Z',
    lastLogin: '2024-01-20T09:15:00Z',
    isActive: true
  },
  {
    id: '3',
    username: 'client1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+1 (555) 111-2222',
    role: 'interested',
    preferences: {
      maxPrice: 500000,
      minPrice: 100000,
      propertyTypes: ['apartment', 'house'],
      cities: ['New York', 'Los Angeles'],
      minBedrooms: 2,
      maxBedrooms: 4,
      features: ['Pool', 'Gym', 'Parking']
    },
    favorites: ['1', '2'],
    savedSearches: [
      {
        query: 'Manhattan apartment',
        operation: 'sale',
        type: 'apartment',
        city: 'New York',
        minPrice: 300000,
        maxPrice: 600000,
        minBedrooms: 2
      }
    ],
    alertsEnabled: true,
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-20T08:45:00Z',
    isActive: true
  },
  {
    id: '4',
    username: 'client2',
    email: 'maria.garcia@example.com',
    name: 'Maria Garcia',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+1 (555) 222-3333',
    role: 'interested',
    preferences: {
      maxPrice: 750000,
      minPrice: 200000,
      propertyTypes: ['house'],
      cities: ['Los Angeles', 'San Francisco'],
      minBedrooms: 3,
      maxBedrooms: 5,
      features: ['Garden', 'Pool', 'Garage']
    },
    favorites: ['2', '4'],
    savedSearches: [],
    alertsEnabled: true,
    createdAt: '2024-01-12T00:00:00Z',
    lastLogin: '2024-01-19T16:20:00Z',
    isActive: true
  }
];