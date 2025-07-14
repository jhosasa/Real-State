import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';
import { usersData } from '../data/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<User> & { username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = usersData.find(u => u.username === username);
    
    if (user && user.isActive) {
      // In a real app, you'd verify the password hash
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
      return { success: true };
    } else {
      dispatch({ type: 'LOGIN_FAILURE' });
      return { success: false, error: 'Invalid credentials or inactive account' };
    }
  };

  const register = async (userData: Partial<User> & { username: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username already exists
    const existingUser = usersData.find(u => u.username === userData.username);
    if (existingUser) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return { success: false, error: 'Username already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email || '',
      name: userData.name || '',
      role: 'interested',
      preferences: {
        maxPrice: 1000000,
        minPrice: 0,
        propertyTypes: [],
        cities: [],
        minBedrooms: 1,
        maxBedrooms: 10,
        features: []
      },
      favorites: [],
      savedSearches: [],
      alertsEnabled: true,
      createdAt: new Date().toISOString(),
      isActive: true,
      ...userData
    };

    // In a real app, you'd save to database
    usersData.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};