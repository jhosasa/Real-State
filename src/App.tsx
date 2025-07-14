import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EmployeePanel } from './components/dashboard/EmployeePanel';
import { InterestedProfile } from './components/dashboard/InterestedProfile';
import { Chatbot } from './components/chatbot/Chatbot';
import { PropertyDetail } from './components/property/PropertyDetail';
import { SearchFilters, Property } from './types';

type Page = 'home' | 'search' | 'dashboard';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setCurrentPage('search');
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
  };

  const handleNavigateDashboard = () => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePropertyClose = () => {
    setSelectedProperty(null);
  };

  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'employee':
        return <EmployeePanel />;
      case 'interested':
        return <InterestedProfile />;
      default:
        return <InterestedProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onNavigateHome={handleNavigateHome}
        onNavigateDashboard={handleNavigateDashboard}
        currentPage={currentPage}
      />
      
      {currentPage === 'home' && (
        <HomePage onSearch={handleSearch} />
      )}
      
      {currentPage === 'search' && (
        <SearchPage initialFilters={searchFilters} />
      )}
      
      {currentPage === 'dashboard' && isAuthenticated && renderDashboard()}
      
      {selectedProperty && (
        <PropertyDetail 
          property={selectedProperty} 
          onClose={handlePropertyClose}
        />
      )}

      <Chatbot onPropertySelect={handlePropertySelect} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;