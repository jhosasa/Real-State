import { useState, useEffect } from 'react';
import { Property, SearchFilters } from '../types';
import { propertyService } from '../services/api';

export const useProperties = (filters: SearchFilters = {}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await propertyService.getProperties(filters);
        setProperties(data);
      } catch (err) {
        setError('Error fetching properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [JSON.stringify(filters)]);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getProperties(filters);
      setProperties(data);
    } catch (err) {
      setError('Error refetching properties');
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    refetch
  };
};