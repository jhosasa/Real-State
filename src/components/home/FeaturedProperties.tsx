import React, { useState, useEffect } from 'react';
import { Property } from '../../types';
import { propertyService } from '../../services/api';
import { PropertyCard } from '../property/PropertyCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedPropertiesProps {
  onPropertySelect: (property: Property) => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ onPropertySelect }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        const data = await propertyService.getFeaturedProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error loading featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, properties.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev === 0 ? Math.max(0, properties.length - 3) : prev - 1);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-600 mt-2">Discover our handpicked selection of premium properties</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <p className="text-gray-600 mt-2">Discover our handpicked selection of premium properties</p>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          {properties.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                style={{ marginLeft: '-24px' }}
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                style={{ marginRight: '-24px' }}
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Properties grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                width: `${(properties.length / 3) * 100}%`
              }}
            >
              {properties.map((property) => (
                <div key={property.id} className="w-1/3 px-3">
                  <PropertyCard 
                    property={property} 
                    onViewDetails={onPropertySelect}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          {properties.length > 3 && (
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(Math.ceil(properties.length / 3))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};