import React from 'react';
import { Heart, MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { Property } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';
import { Button } from '../ui/Button';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} m²`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(property.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium uppercase">
            {property.operation}
          </span>
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Eye className="h-4 w-4 mr-1" />
            {property.views}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm truncate">{property.address}, {property.city}</span>
        </div>

        <div className="text-2xl font-bold text-blue-600 mb-3">
          {formatPrice(property.price, property.currency)}
          {property.operation === 'rent' && <span className="text-sm text-gray-500">/month</span>}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{formatArea(property.area)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{property.features.length - 3} more
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => onViewDetails(property)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};