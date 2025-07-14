import React from 'react';
import { SearchFilters } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Search, X } from 'lucide-react';

interface PropertyFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    });
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'land', label: 'Land' },
    { value: 'office', label: 'Office' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const cities = [
    { value: 'New York', label: 'New York' },
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'San Francisco', label: 'San Francisco' },
    { value: 'Chicago', label: 'Chicago' },
    { value: 'Miami', label: 'Miami' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price', label: 'Price' },
    { value: 'date', label: 'Newest' },
    { value: 'area', label: 'Area' }
  ];

  const bedroomOptions = [
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search Properties</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onReset}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          placeholder="Search by location or keyword"
          value={filters.query || ''}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          icon={Search}
        />

        <Select
          placeholder="Operation"
          value={filters.operation || ''}
          onChange={(e) => handleFilterChange('operation', e.target.value)}
          options={[
            { value: 'sale', label: 'For Sale' },
            { value: 'rent', label: 'For Rent' }
          ]}
        />

        <Select
          placeholder="Property Type"
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          options={propertyTypes}
        />

        <Select
          placeholder="City"
          value={filters.city || ''}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          options={cities}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <Select
          placeholder="Bedrooms"
          value={filters.minBedrooms?.toString() || ''}
          onChange={(e) => handleFilterChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
          options={bedroomOptions}
        />

        <Select
          placeholder="Bathrooms"
          value={filters.minBathrooms?.toString() || ''}
          onChange={(e) => handleFilterChange('minBathrooms', e.target.value ? Number(e.target.value) : undefined)}
          options={bedroomOptions}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min Area"
            value={filters.minArea || ''}
            onChange={(e) => handleFilterChange('minArea', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max Area"
            value={filters.maxArea || ''}
            onChange={(e) => handleFilterChange('maxArea', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <Select
          placeholder="Sort By"
          value={filters.sortBy || ''}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          options={sortOptions}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {['Pool', 'Gym', 'Parking', 'Security 24h', 'Garden', 'Elevator'].map((feature) => (
          <label key={feature} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={filters.features?.includes(feature) || false}
              onChange={(e) => {
                const currentFeatures = filters.features || [];
                const newFeatures = e.target.checked
                  ? [...currentFeatures, feature]
                  : currentFeatures.filter(f => f !== feature);
                handleFilterChange('features', newFeatures.length > 0 ? newFeatures : undefined);
              }}
            />
            <span className="text-gray-700">{feature}</span>
          </label>
        ))}
      </div>
    </div>
  );
};