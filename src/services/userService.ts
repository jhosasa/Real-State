import { User, PropertyAlert, UserActivity } from '../types';
import { usersData } from '../data/users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    await delay(300);
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');
    
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in mock data
    const userIndex = usersData.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      usersData[userIndex] = updatedUser;
    }
    
    return updatedUser;
  }

  async toggleFavorite(propertyId: string): Promise<string[]> {
    await delay(200);
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');
    
    const favorites = [...currentUser.favorites];
    const index = favorites.indexOf(propertyId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(propertyId);
    }
    
    await this.updateUser({ favorites });
    this.logActivity(currentUser.id, 'favorite', propertyId);
    
    return favorites;
  }

  async saveSearch(filters: any): Promise<void> {
    await delay(200);
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');
    
    const savedSearches = [...currentUser.savedSearches, filters];
    await this.updateUser({ savedSearches });
  }

  async createAlert(alert: Omit<PropertyAlert, 'id' | 'createdAt'>): Promise<PropertyAlert> {
    await delay(300);
    const newAlert: PropertyAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // Store in localStorage
    const alerts = this.getStoredAlerts();
    alerts.push(newAlert);
    localStorage.setItem('propertyAlerts', JSON.stringify(alerts));
    
    return newAlert;
  }

  async getUserAlerts(userId: string): Promise<PropertyAlert[]> {
    await delay(200);
    const alerts = this.getStoredAlerts();
    return alerts.filter(alert => alert.userId === userId);
  }

  async updateAlert(alertId: string, updates: Partial<PropertyAlert>): Promise<PropertyAlert> {
    await delay(200);
    const alerts = this.getStoredAlerts();
    const alertIndex = alerts.findIndex(a => a.id === alertId);
    
    if (alertIndex === -1) throw new Error('Alert not found');
    
    alerts[alertIndex] = { ...alerts[alertIndex], ...updates };
    localStorage.setItem('propertyAlerts', JSON.stringify(alerts));
    
    return alerts[alertIndex];
  }

  async deleteAlert(alertId: string): Promise<void> {
    await delay(200);
    const alerts = this.getStoredAlerts();
    const filteredAlerts = alerts.filter(a => a.id !== alertId);
    localStorage.setItem('propertyAlerts', JSON.stringify(filteredAlerts));
  }

  logActivity(userId: string, action: UserActivity['action'], propertyId?: string, metadata?: any): void {
    const activities = this.getStoredActivities();
    const activity: UserActivity = {
      id: Date.now().toString(),
      userId,
      action,
      propertyId,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    activities.push(activity);
    // Keep only last 100 activities
    if (activities.length > 100) {
      activities.splice(0, activities.length - 100);
    }
    
    localStorage.setItem('userActivities', JSON.stringify(activities));
  }

  async getUserActivities(userId: string): Promise<UserActivity[]> {
    await delay(200);
    const activities = this.getStoredActivities();
    return activities
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }

  private getStoredAlerts(): PropertyAlert[] {
    const stored = localStorage.getItem('propertyAlerts');
    return stored ? JSON.parse(stored) : [];
  }

  private getStoredActivities(): UserActivity[] {
    const stored = localStorage.getItem('userActivities');
    return stored ? JSON.parse(stored) : [];
  }
};

export const userService = new UserService();