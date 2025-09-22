import { render, screen } from '@testing-library/react-native';
import Index from '../app/(tabs)/index';

test('renders login button', () => {
  render(<Index />);
  expect(screen.getByText(/login/i)).toBeOnTheScreen();
});