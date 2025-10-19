import React from 'react';
import { screen } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import Login from '../app/auth/login';

// This will automatically use the mock from __mocks__/AuthProvider.js
jest.mock('../utils/AuthProvider');

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login button', () => {
    render(<Login />);
    
    const loginElement = screen.getByText(/login/i);
    expect(loginElement).toBeOnTheScreen();
  });
});