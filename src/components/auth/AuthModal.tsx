import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    role: 'interested' as 'admin' | 'employee' | 'interested'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, register, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!isLogin && !formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isLogin) {
        const result = await login(formData.username, formData.password);
        if (result.success) {
          onClose();
        } else {
          setErrors({ submit: result.error || 'Login failed' });
        }
      } else {
        const result = await register(formData);
        if (result.success) {
          onClose();
        } else {
          setErrors({ submit: result.error || 'Registration failed' });
        }
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    }
  };

  // Demo credentials info
  const demoCredentials = [
    { username: 'admin', role: 'Administrator', description: 'Full system access' },
    { username: 'agent1', role: 'Agent', description: 'Property management' },
    { username: 'client1', role: 'Client', description: 'Property search' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isLogin 
            ? 'Sign in to access your account and saved properties'
            : 'Join EstateHub to save favorites and get personalized recommendations'
          }
        </p>
      </div>

      {/* Demo Credentials */}
      {isLogin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</h3>
          <div className="space-y-1 text-xs text-blue-800">
            {demoCredentials.map((cred) => (
              <div key={cred.username} className="flex justify-between">
                <span className="font-medium">{cred.username}</span>
                <span>{cred.role} - {cred.description}</span>
              </div>
            ))}
            <div className="mt-2 text-blue-700">
              <strong>Password for all:</strong> password123
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="username"
          type="text"
          label="Username"
          icon={User}
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Enter your username"
        />

        {!isLogin && (
          <>
            <Input
              name="name"
              type="text"
              label="Full Name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
            />

            <Input
              name="email"
              type="email"
              label="Email Address"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />

            <Select
              name="role"
              label="Account Type"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'interested', label: 'Property Seeker' },
                { value: 'employee', label: 'Real Estate Agent' },
                { value: 'admin', label: 'Administrator' }
              ]}
            />
          </>
        )}

        <div className="relative">
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {errors.submit && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {errors.submit}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full">
          <img
            className="h-5 w-5 mr-2"
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          Google
        </Button>
        <Button variant="outline" className="w-full">
          <div className="w-5 h-5 mr-2 bg-blue-600 rounded" />
          Facebook
        </Button>
      </div>
    </div>
  );
};