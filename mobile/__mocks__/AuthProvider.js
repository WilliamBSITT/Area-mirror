// Create __mocks__/AuthProvider.js
import React from 'react';

const mockContextValue = {
  user: null,
  isAuthenticated: false,
  loading: false,
  login: jest.fn(() => Promise.resolve()),
  logout: jest.fn(() => Promise.resolve()),
};

export const AuthContext = React.createContext(mockContextValue);

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={mockContextValue}>
    {children}
  </AuthContext.Provider>
);