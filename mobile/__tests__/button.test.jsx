import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from './test-utils';
import Login from '../app/auth/login';

// Mock the entire AuthProvider module
jest.mock('../utils/AuthProvider', () => ({
  AuthProvider: ({ children }) => children,
  AuthContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({ 
      user: null, 
      isAuthenticated: false, 
      loading: false,
      login: jest.fn(),
      logout: jest.fn() 
    })
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login button', () => {
    renderWithProviders(<Login />);
    
    // Look for login text (adjust based on your actual Login component)
    const loginElement = screen.getByText(/login/i);
    expect(loginElement).toBeOnTheScreen();
  });

  test('renders login form elements', () => {
    renderWithProviders(<Login />);
    
    // Add more specific tests based on your Login component
  });
});