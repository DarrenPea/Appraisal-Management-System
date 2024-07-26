import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import HrHome from '../components/hrhome';

// Mock the navigate function from 'react-router-dom'
const mockNavigate = jest.fn();

// Mock useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      staffID: '123',
      name: 'John Doe',
    },
  }),
  useNavigate: () => mockNavigate,
}));

describe('HrHome Component', () => {
  // Test: Render Component Correctly
  test('renders HrHome component with correct elements', () => {
    render(
      <Router>
        <HrHome />
      </Router>
    );

    // Check if the header and logout button are present
    expect(screen.getByText('WELCOME, JOHN DOE [HR]')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Check if HrHomeTable is rendered
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  // Test: Logout Button Click
  test('navigates to home page on logout button click', () => {
    render(
      <Router>
        <HrHome />
      </Router>
    );

    // Click the logout button
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

    // Assert navigate was called with the home path
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // Test: HrHomeTable Rendering
  test('renders HrHomeTable component with correct props', () => {
    render(
      <Router>
        <HrHome />
      </Router>
    );

    // Ensure HrHomeTable is rendered with the correct props
    expect(screen.getByText('Pending Appraisals')).toBeInTheDocument();
  });
});
