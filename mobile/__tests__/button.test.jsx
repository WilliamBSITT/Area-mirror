import { render, screen } from '@testing-library/react-native';
import Index from '../app/(tabs)/index';

test('renders welcome text', () => {
  render(<Index />);
  expect(screen.getByText(/click/i)).toBeOnTheScreen();
});