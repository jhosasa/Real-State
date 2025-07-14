import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFavorites(user.favorites);
    }
  }, [user]);

  const toggleFavorite = async (propertyId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedFavorites = await userService.toggleFavorite(propertyId);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite
  };
};