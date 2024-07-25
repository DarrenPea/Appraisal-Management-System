import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import HrHomeTable from '../components/hrhometable';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate before importing the component
import { useNavigate } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

describe('HrHomeTable', () => {
  const mockAppraisalResponse = [
    { employeeID: 'Sara', appraisalType: 'Yearly', dueDate: '2024-11-01', statusEmployee: 1, statusHOD: 0, formID: '1' },
    { employeeID: 'James', appraisalType: 'Confirmation', dueDate: '2024-12-02', statusEmployee: 1, statusHOD: 1, formID: '2' }
  ];

  const mockEmployeeResponse = [
    { employeeName: 'Sarah Lee', department: 'Marketing' },
    { employeeName: 'Lebron James', department: 'Sales' }
  ];

  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:3000/form/HR/status') {
        return Promise.resolve({ data: mockAppraisalResponse });
      }
      return Promise.reject(new Error('Not Found'));
    });

    axios.post.mockImplementation((url, { employeeID }) => {
      if (url === 'http://localhost:3000/employee/HR/status') {
        if (employeeID === 'Sara') {
          return Promise.resolve({ data: [{ employeeName: 'Sarah Lee', department: 'Marketing' }] });
        } else if (employeeID === 'James') {
          return Promise.resolve({ data: [{ employeeName: 'Lebron James', department: 'Sales' }] });
        }
      }
      return Promise.reject(new Error('Not Found'));
    });
  });

  test('renders without crashing and displays appraisals', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <HrHomeTable HR_ID="123" name="John Doe" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sarah Lee')).toBeInTheDocument();
      expect(screen.getByText('Lebron James')).toBeInTheDocument();
    });
  });

  test('displays no actions message when no appraisals', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <HrHomeTable HR_ID="123" name="John Doe" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No actions are needed at this time.')).toBeInTheDocument();
    });
  });

  test('navigates to form page on view button click', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <HrHomeTable HR_ID="123" name="John Doe" />
      </BrowserRouter>
    );

    await waitFor(() => {
      const viewButtons = screen.getAllByRole('button', { name: /View/i });
      expect(viewButtons).toHaveLength(2); // Assuming there are 2 appraisals
    });

    const viewButtons = screen.getAllByRole('button', { name: /View/i });
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/form', {
        state: {
          formID: '1',
          staffID: '123',
          role: 'hr',
          employeeName: 'Sarah Lee',
          department: 'Marketing',
          type: 'Yearly',
          staffName: 'John Doe'
        }
      });
    });
  });

  test('renders view buttons correctly', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <HrHomeTable HR_ID="123" name="John Doe" />
      </BrowserRouter>
    );

    await waitFor(() => {
      const viewButtons = screen.getAllByRole('button', { name: /View/i });
      expect(viewButtons).toHaveLength(mockAppraisalResponse.length);
    });
  });
});
