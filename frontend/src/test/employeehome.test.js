import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeHome from '../components/employeehome';
import { MemoryRouter } from 'react-router-dom';

// Mock the EmployeeHomeTable component
jest.mock('../components/employeehometable', () => () => <div>Mocked EmployeeHomeTable</div>);

// Mock the useLocation and useNavigate hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: { staffID: '123', name: 'John Doe' },
  }),
  useNavigate: () => mockNavigate,
}));

describe('EmployeeHome Component', () => {
  // Test: Render Component Correctly
  test('renders EmployeeHome component with correct elements', () => {
    render(
      <MemoryRouter>
        <EmployeeHome />
      </MemoryRouter>
    );

    // Check if the welcome message is correct
    expect(screen.getByText(/WELCOME, JOHN DOE \[EMPLOYEE\]/i)).toBeInTheDocument();

    // Check if the pending appraisals header is displayed
    expect(screen.getByText(/Pending Appraisals/i)).toBeInTheDocument();

    // Check if the mocked EmployeeHomeTable is rendered
    expect(screen.getByText(/Mocked EmployeeHomeTable/i)).toBeInTheDocument();

    // Check if the logout button is present
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  // Test: Logout Button Click
  test('navigates to home page on logout button click', () => {
    render(
      <MemoryRouter>
        <EmployeeHome />
      </MemoryRouter>
    );

    // Click the logout button
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

    // Assert navigate was called with the home path
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
