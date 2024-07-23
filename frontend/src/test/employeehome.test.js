
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeHome from '../components/employeehome';

jest.mock('../components/employeehometable', () => () => <div>Mocked EmployeeHomeTable</div>);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: { staffID: '123', name: 'John Doe' },
  }),
  useNavigate: () => jest.fn(),
}));

test('renders EmployeeHome component', () => {
  render(
      <EmployeeHome />
  );

  // Check if the welcome message is correct
  expect(screen.getByText(/WELCOME, JOHN DOE \[EMPLOYEE\]/i)).toBeInTheDocument();

  // Check if the pending appraisals header is displayed
  expect(screen.getByText(/Pending Appraisals:/i)).toBeInTheDocument();

  // Check if the EmployeeHomeTable is rendered
  expect(screen.getByText(/Mocked EmployeeHomeTable/i)).toBeInTheDocument();

  // Check if the logout button is present
  const logoutButton = screen.getByRole('button', { name: /Logout/i });
  expect(logoutButton).toBeInTheDocument();

  // Simulate logout button click
  fireEvent.click(logoutButton);
});
