import React, { useState, useEffect } from 'react';
import { Property, Agent, Recommendation } from '../../types';
import { propertyService, agentService } from '../../services/api';
import { 
  Heart, MapPin, Bed, Bath, Square, Calendar, Eye, Share2, 
  Phone, Mail, Star, X, ChevronLeft, ChevronRight, User
} from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PropertyCard } from './PropertyCard';

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, onClose }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${property.title}. Please contact me with more information.`
  });

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [agentData, recommendationData] = await Promise.all([
          agentService.getAgentById(property.agentId),
          propertyService.getRecommendations('1', property.id)
        ]);

        setAgent(agentData);
        setRecommendations(recommendationData);

        // Load recommended properties
        const recProperties = await Promise.all(
          recommendationData.map(rec => propertyService.getPropertyById(rec.propertyId))
        );
        setRecommendedProperties(recProperties.filter(Boolean) as Property[]);
      } catch (error) {
        console.error('Error loading property details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [property.id, property.agentId]);

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Contact form submitted:', contactForm);
    alert('Message sent! The agent will contact you soon.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(property.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Share2 className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              )}

              {/* Image thumbnails */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <div className="flex items-center text-gray-500">
                  <Eye className="h-5 w-5 mr-1" />
                  <span>{property.views} views</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.address}, {property.city}</span>
              </div>

              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(property.price, property.currency)}
                {property.operation === 'rent' && <span className="text-lg text-gray-500">/month</span>}
              </div>

              <div className="flex items-center space-x-6 py-4 border-t border-b border-gray-200">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">{formatArea(property.area)}</span>
                </div>
                {property.yearBuilt && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-gray-700">Built {property.yearBuilt}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">
                      {property.coordinates.lat}, {property.coordinates.lng}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Agent Info and Contact */}
          <div className="space-y-6">
            {/* Agent Info */}
            {agent && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
                
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-gray-600">{agent.company}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {agent.rating} ({agent.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{agent.email}</span>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    required
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Your Phone"
                    value={contactForm.phone}
                    onChange={handleContactFormChange}
                  />
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    required
                  />
                  <Button type="submit" variant="primary" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            )}

            {/* Recommended Properties */}
            {recommendedProperties.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recommended for You
                </h3>
                <div className="space-y-4">
                  {recommendedProperties.slice(0, 3).map((recProperty) => (
                    <div key={recProperty.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex space-x-3">
                        <img
                          src={recProperty.images[0]}
                          alt={recProperty.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {recProperty.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1">
                            {recProperty.city}
                          </p>
                          <p className="text-sm font-semibold text-blue-600">
                            {formatPrice(recProperty.price, recProperty.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};