import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../utils/AuthProvider';
import { Login } from '../app/auth/login';
const renderWithContext = (ui, value) => {
  return render(
    <AuthProvider value={value}>
      {ui}
    </AuthProvider>
  );
};

test('displays login prompt when no user is logged in', () => {
  render(
  <ContextObject.Provider value={{ user: null, isAuthenticated: false }}>
    <Login />
  </ContextObject.Provider>);
  expect(screen.getByText(/log in/i)).toBeInTheDocument();
});
