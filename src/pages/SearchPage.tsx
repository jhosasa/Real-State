import React, { useState } from 'react';
import { Property, SearchFilters } from '../types';
import { useProperties } from '../hooks/useProperties';
import { PropertyFilters } from '../components/property/PropertyFilters';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyDetail } from '../components/property/PropertyDetail';
import { Grid, List, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface SearchPageProps {
  initialFilters?: SearchFilters;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialFilters = {} }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { properties, loading, error } = useProperties(filters);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters({});
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePropertyClose = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Properties</h1>
          <p className="text-gray-600">Find your perfect property with our advanced search</p>
        </div>

        <PropertyFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Loading...' : `${properties.length} Properties Found`}
            </h2>
            {filters.city && (
              <span className="text-sm text-gray-600">in {filters.city}</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              icon={Grid}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              icon={List}
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={MapPin}
            >
              Map
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or explore different locations</p>
            <Button variant="primary" onClick={handleFiltersReset}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handlePropertySelect}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProperty && (
        <PropertyDetail 
          property={selectedProperty} 
          onClose={handlePropertyClose}
        />
      )}
    </div>
  );
};