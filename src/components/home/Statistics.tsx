import React from 'react';
import { TrendingUp, Users, Award, MapPin } from 'lucide-react';

export const Statistics: React.FC = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: '$2.5B+',
      label: 'Properties Sold',
      description: 'Total value of transactions'
    },
    {
      icon: Users,
      value: '50K+',
      label: 'Happy Clients',
      description: 'Satisfied customers worldwide'
    },
    {
      icon: Award,
      value: '15+',
      label: 'Years Experience',
      description: 'In real estate industry'
    },
    {
      icon: MapPin,
      value: '100+',
      label: 'Cities Covered',
      description: 'Across multiple countries'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Success Story</h2>
          <p className="text-gray-600 mt-2">Numbers that speak for our excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};