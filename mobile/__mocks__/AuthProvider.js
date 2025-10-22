const React = require('react');

const mockContextValue = {
  user: null,
  isAuthenticated: false,
  loading: false, // Very important - if this is true, Login might show loading instead
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  token: null,
  error: null,
  // Add any other properties your AuthContext provides
};

const AuthContext = React.createContext(mockContextValue);

const AuthProvider = ({ children }) => 
  React.createElement(AuthContext.Provider, { value: mockContextValue }, children);

module.exports = {
  AuthContext,
  AuthProvider,
};