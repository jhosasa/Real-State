import React, { useState } from 'react';
import { Property, SearchFilters } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedProperties } from '../components/home/FeaturedProperties';
import { Statistics } from '../components/home/Statistics';
import { Testimonials } from '../components/home/Testimonials';
import { PropertyDetail } from '../components/property/PropertyDetail';

interface HomePageProps {
  onSearch: (filters: SearchFilters) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePropertyClose = () => {
    setSelectedProperty(null);
  };

  return (
    <div>
      <HeroSection onSearch={onSearch} />
      <FeaturedProperties onPropertySelect={handlePropertySelect} />
      <Statistics />
      <Testimonials />
      
      {selectedProperty && (
        <PropertyDetail 
          property={selectedProperty} 
          onClose={handlePropertyClose}
        />
      )}
    </div>
  );
};