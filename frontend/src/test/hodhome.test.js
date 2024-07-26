import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import HodHome from '../components/hodhome';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useLocation: () => ({
      state: { staffID: '123', name: 'John Doe' }
    }),
    useNavigate: () => mockedUseNavigate,
  };
});

jest.mock('../components/hodhometable', () => () => <div>HodHomeTable Component</div>);

describe('HodHome Component', () => {
  // Test: Render Component Correctly
  test('renders HodHome component with correct elements', () => {
    render(
      <MemoryRouter>
        <HodHome />
      </MemoryRouter>
    );

    // Check if the welcome message is correct
    expect(screen.getByText(/WELCOME, JOHN DOE \[HOD\]/i)).toBeInTheDocument();

    // Check if the pending appraisals header is displayed
    expect(screen.getByText(/Pending Appraisals:/i)).toBeInTheDocument();

    // Check if the mocked HodHomeTable is rendered
    expect(screen.getByText(/HodHomeTable Component/i)).toBeInTheDocument();

    // Check if the logout button is present
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  // Test: Logout Button Click
  test('navigates to home page on logout button click', () => {
    render(
      <MemoryRouter>
        <HodHome />
      </MemoryRouter>
    );

    // Click the logout button
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

    // Assert navigate was called with the home path
    expect(mockedUseNavigate).toHaveBeenCalledWith('/');
  });
});
