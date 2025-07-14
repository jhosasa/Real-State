import React, { useState, useEffect } from 'react';
import { 
  Heart, Search, Bell, Settings, Eye, Calendar, 
  MapPin, DollarSign, Home, Star, Trash2, Edit 
} from 'lucide-react';
import { Property, PropertyAlert, UserActivity } from '../../types';
import { propertiesService } from '../../services/propertiesService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { PropertyCard } from '../property/PropertyCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export const InterestedProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'alerts' | 'activity' | 'settings'>('favorites');
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Load favorite properties
        if (user.favorites.length > 0) {
          const allProperties = await propertiesService.getAllProperties();
          const favoriteProperties = allProperties.filter(p => user.favorites.includes(p.id));
          setFavorites(favoriteProperties);
        }

        // Load alerts
        const userAlerts = await userService.getUserAlerts(user.id);
        setAlerts(userAlerts);

        // Load activities
        const userActivities = await userService.getUserActivities(user.id);
        setActivities(userActivities);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await userService.toggleFavorite(propertyId);
      setFavorites(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await userService.deleteAlert(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      await userService.updateAlert(alertId, { isActive });
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isActive } : a));
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
    { id: 'alerts', label: 'Alerts', icon: Bell, count: alerts.length },
    { id: 'activity', label: 'Activity', icon: Eye, count: activities.length },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your preferences and saved properties</p>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'favorites' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Favorite Properties</h2>
            <p className="text-sm text-gray-500">{favorites.length} properties saved</p>
          </div>
          
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-4">Start exploring properties and save your favorites</p>
              <Button variant="primary">Browse Properties</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCard
                    property={property}
                    onViewDetails={setSelectedProperty}
                  />
                  <button
                    onClick={() => handleRemoveFavorite(property.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Property Alerts</h2>
            <Button variant="primary">Create New Alert</Button>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts set</h3>
              <p className="text-gray-600 mb-4">Create alerts to get notified about new properties</p>
              <Button variant="primary">Create Alert</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.name}</h3>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={alert.isActive}
                          onChange={(e) => handleToggleAlert(alert.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Active</span>
                      </label>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {alert.filters.operation && (
                      <div>
                        <span className="text-gray-500">Operation:</span>
                        <span className="ml-1 font-medium capitalize">{alert.filters.operation}</span>
                      </div>
                    )}
                    {alert.filters.type && (
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-1 font-medium capitalize">{alert.filters.type}</span>
                      </div>
                    )}
                    {alert.filters.city && (
                      <div>
                        <span className="text-gray-500">City:</span>
                        <span className="ml-1 font-medium">{alert.filters.city}</span>
                      </div>
                    )}
                    {(alert.filters.minPrice || alert.filters.maxPrice) && (
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-1 font-medium">
                          ${alert.filters.minPrice?.toLocaleString() || '0'} - 
                          ${alert.filters.maxPrice?.toLocaleString() || '∞'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Created: {new Date(alert.createdAt).toLocaleDateString()}
                    {alert.lastNotified && (
                      <span className="ml-4">
                        Last notification: {new Date(alert.lastNotified).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-600">Your property viewing history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.action === 'view' ? 'bg-blue-100' :
                      activity.action === 'favorite' ? 'bg-red-100' :
                      activity.action === 'search' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.action === 'view' && <Eye className="h-4 w-4 text-blue-600" />}
                      {activity.action === 'favorite' && <Heart className="h-4 w-4 text-red-600" />}
                      {activity.action === 'search' && <Search className="h-4 w-4 text-green-600" />}
                      {activity.action === 'contact' && <MapPin className="h-4 w-4 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">
                        {activity.action} {activity.propertyId ? 'Property' : 'Action'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={user?.name || ''}
                  onChange={(e) => updateUser({ name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={user?.email || ''}
                  onChange={(e) => updateUser({ email: e.target.value })}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={user?.phone || ''}
                  onChange={(e) => updateUser({ phone: e.target.value })}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Min Price"
                    type="number"
                    value={user?.preferences.minPrice || ''}
                    onChange={(e) => updateUser({
                      preferences: {
                        ...user!.preferences,
                        minPrice: Number(e.target.value)
                      }
                    })}
                  />
                  <Input
                    label="Max Price"
                    type="number"
                    value={user?.preferences.maxPrice || ''}
                    onChange={(e) => updateUser({
                      preferences: {
                        ...user!.preferences,
                        maxPrice: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Min Bedrooms"
                    type="number"
                    value={user?.preferences.minBedrooms || ''}
                    onChange={(e) => updateUser({
                      preferences: {
                        ...user!.preferences,
                        minBedrooms: Number(e.target.value)
                      }
                    })}
                  />
                  <Input
                    label="Max Bedrooms"
                    type="number"
                    value={user?.preferences.maxBedrooms || ''}
                    onChange={(e) => updateUser({
                      preferences: {
                        ...user!.preferences,
                        maxBedrooms: Number(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user?.alertsEnabled || false}
                    onChange={(e) => updateUser({ alertsEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Email notifications for new properties</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Weekly market updates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Price change alerts</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedProperty.title}</h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <PropertyCard
                property={selectedProperty}
                onViewDetails={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};