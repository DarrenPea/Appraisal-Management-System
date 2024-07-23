// src/EmployeeHomeTable.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeeHomeTable from '../components/employeehometable';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockData =
  {
    employeeName: 'John Doe',
    department: 'customer service',
    appraisalType: 'Annual Review',
    dueDate: '2024-07-30',
    statusEmployee: 0,
    formID: 'form1',
  }

test('renders EmployeeHomeTable component with appraisals', async () => {
  axios.post.mockResolvedValueOnce({ data: [mockData] });
  axios.post.mockResolvedValueOnce({
    data: [{ employeeName: 'John Doe', department: 'customer service' }],
  });

  render(<EmployeeHomeTable staffID="123" name="John Doe" />);

  await waitFor(() => {
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/customer service/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual Review/i)).toBeInTheDocument();
    expect(screen.getByText('2024-07-30')).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });
});

test('displays no actions message if no appraisals', async () => {
  axios.post.mockResolvedValueOnce({ data: [[]] });

  render(<EmployeeHomeTable staffID="123" name="John Doe" />);

  await waitFor(() => {
    expect(screen.getByText(/No actions are needed at this time./i)).toBeInTheDocument();
  });
});
