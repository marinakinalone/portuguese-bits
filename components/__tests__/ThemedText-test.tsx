import { render, screen } from '@testing-library/react-native';
import * as React from 'react';

import { ThemedText } from '../ThemedText';

jest.mock('../../hooks/useThemeColor', () => ({
  useThemeColor: () => '#11181C',
}));

it('renders correctly', () => {
  render(<ThemedText>Snapshot test!</ThemedText>);

  expect(screen.getByText('Snapshot test!')).toBeTruthy();
});
