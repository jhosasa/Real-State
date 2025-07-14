import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Home } from 'lucide-react';
import { SearchFilters } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface HeroSectionProps {
  onSearch: (filters: SearchFilters) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    operation: 'sale',
    type: '',
    city: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div 
        className="relative min-h-[600px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1600)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your
              <span className="text-yellow-400"> Dream Home</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Discover the perfect property with our intelligent recommendation system
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search by location, neighborhood, or property type"
                    value={searchFilters.query || ''}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    icon={Search}
                    className="text-gray-900"
                  />
                </div>
                
                <Select
                  value={searchFilters.operation || ''}
                  onChange={(e) => handleFilterChange('operation', e.target.value)}
                  options={[
                    { value: 'sale', label: 'For Sale' },
                    { value: 'rent', label: 'For Rent' }
                  ]}
                  placeholder="Operation"
                />
                
                <Select
                  value={searchFilters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  options={[
                    { value: 'apartment', label: 'Apartment' },
                    { value: 'house', label: 'House' },
                    { value: 'land', label: 'Land' },
                    { value: 'office', label: 'Office' },
                    { value: 'commercial', label: 'Commercial' }
                  ]}
                  placeholder="Property Type"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Search}
                  className="px-8"
                >
                  Search Properties
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">10,000+</div>
                <div className="text-gray-100">Properties Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">5,000+</div>
                <div className="text-gray-100">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
                <div className="text-gray-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};