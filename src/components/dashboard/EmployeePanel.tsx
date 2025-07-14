import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Calendar, MessageSquare, Phone, Mail, 
  Star, TrendingUp, Clock, CheckCircle 
} from 'lucide-react';
import { Property, User } from '../../types';
import { propertiesService } from '../../services/propertiesService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

export const EmployeePanel: React.FC = () => {
  const { user } = useAuth();
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeClients: 0,
    monthlyViews: 0,
    avgRating: 4.8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const allProperties = await propertiesService.getAllProperties();
        const agentProperties = allProperties.filter(p => p.agentId === user?.id);
        
        const totalViews = agentProperties.reduce((sum, p) => sum + p.views, 0);
        
        setMyProperties(agentProperties);
        setStats({
          totalListings: agentProperties.length,
          activeClients: 15, // Mock data
          monthlyViews: totalViews,
          avgRating: 4.8
        });

        // Mock recent activities
        setRecentActivities([
          {
            id: '1',
            type: 'inquiry',
            message: 'New inquiry for Modern Downtown Apartment',
            time: '2 hours ago',
            client: 'John Doe'
          },
          {
            id: '2',
            type: 'viewing',
            message: 'Viewing scheduled for Luxury Family House',
            time: '4 hours ago',
            client: 'Maria Garcia'
          },
          {
            id: '3',
            type: 'offer',
            message: 'Offer received for Beachfront Condo',
            time: '1 day ago',
            client: 'Robert Smith'
          }
        ]);
      } catch (error) {
        console.error('Error loading employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadEmployeeData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'My Listings',
      value: stats.totalListings.toString(),
      icon: Home,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Active Clients',
      value: stats.activeClients.toString(),
      icon: Users,
      color: 'bg-green-500',
      change: '+5 this month'
    },
    {
      title: 'Monthly Views',
      value: stats.monthlyViews.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15% increase'
    },
    {
      title: 'Average Rating',
      value: stats.avgRating.toString(),
      icon: Star,
      color: 'bg-orange-500',
      change: '127 reviews'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Property
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Properties */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Properties</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {myProperties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{property.title}</h4>
                  <p className="text-sm text-gray-500">{property.city}, {property.zone}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm font-semibold text-blue-600">
                      ${property.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {property.views} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    property.status === 'available' ? 'bg-green-100 text-green-800' :
                    property.status === 'sold' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'inquiry' ? 'bg-blue-100' :
                  activity.type === 'viewing' ? 'bg-green-100' :
                  'bg-orange-100'
                }`}>
                  {activity.type === 'inquiry' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'viewing' && <Calendar className="h-4 w-4 text-green-600" />}
                  {activity.type === 'offer' && <CheckCircle className="h-4 w-4 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">Client: {activity.client}</p>
                  <p className="text-xs text-gray-400 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Contact Center</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-medium text-gray-900">Call Client</div>
              <div className="text-sm text-gray-500">Quick dial to active clients</div>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-medium text-gray-900">Send Email</div>
              <div className="text-sm text-gray-500">Email templates ready</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">Today's Viewings</div>
              <div className="text-sm text-gray-500">3 appointments scheduled</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">This Week</div>
              <div className="text-sm text-gray-500">12 total appointments</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium text-gray-900">2 Sales</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Commission</span>
              <span className="text-sm font-medium text-green-600">$15,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Goal Progress</span>
              <span className="text-sm font-medium text-blue-600">67%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};