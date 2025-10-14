import React from 'react';
import { render } from '@testing-library/react-native';

// Mock AuthProvider
const MockAuthProvider = ({ children }) => {
  const mockContextValue = {
    user: null,
    isAuthenticated: false,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
  };

  return (
    <div>
      {children}
    </div>
  );
};

export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <MockAuthProvider>
      {children}
    </MockAuthProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export everything
export * from '@testing-library/react-native';