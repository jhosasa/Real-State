import React, { useState } from 'react';
import { Search, User, Heart, Menu, X, Home, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AuthModal } from '../auth/AuthModal';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigateHome, 
  onNavigateDashboard, 
  currentPage 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'Sell', href: '/sell' },
    { label: 'New Projects', href: '/projects' }
  ];

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'employee': return 'Agent';
      case 'interested': return 'Client';
      default: return 'User';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={onNavigateHome}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EstateHub</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Search and User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {isAuthenticated && user ? (
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  
                  {/* Dashboard Button */}
                  <button
                    onClick={onNavigateDashboard}
                    className={`p-2 transition-colors ${
                      currentPage === 'dashboard' 
                        ? 'text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="hidden sm:block">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name}
                      </span>
                      <div className="text-xs text-gray-500">
                        {getRoleDisplayName(user.role)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={User}
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {item.label}
                </a>
              ))}
              {isAuthenticated && (
                <button
                  onClick={onNavigateDashboard}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Sign In to EstateHub"
      >
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      </Modal>
    </>
  );
};