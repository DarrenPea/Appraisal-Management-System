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

test('renders HodHome component with welcome message', () => {
  render(
      <HodHome />
  );

  expect(screen.getByText(/WELCOME, JOHN DOE \[HOD\]/i)).toBeInTheDocument();
  expect(screen.getByText(/Pending Appraisals:/i)).toBeInTheDocument();
  expect(screen.getByText(/HodHomeTable Component/i)).toBeInTheDocument();
});

test('logout button navigates to home', () => {
  render(
      <HodHome />
  );

  fireEvent.click(screen.getByText(/Logout/i));
  expect(mockedUseNavigate).toHaveBeenCalledWith('/');
});
