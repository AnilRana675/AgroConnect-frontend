import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AgroConnect heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/AgroConnect/i);
  expect(headingElement).toBeInTheDocument();
});
