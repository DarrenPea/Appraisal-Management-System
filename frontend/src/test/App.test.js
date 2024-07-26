import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Login component at root path', () => {
  render(
      <App />
  );

  // Check if Login component is rendered by looking for a unique text or element
  const usernameLabel = screen.getByLabelText(/username/i);
  const passwordLabel = screen.getByLabelText(/password/i);
  
  // Adjust based on the actual content in your Login component
  expect(usernameLabel).toBeInTheDocument();
  expect(passwordLabel).toBeInTheDocument();
});

