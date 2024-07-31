import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import EmployeeHomeTable from '../components/employeehometable';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('EmployeeHomeTable', () => {
  const mockProps = {
    staffID: '123',
    name: 'John Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders no actions message when no appraisals', async () => {
    axios.post.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No actions are needed at this time.')).toBeInTheDocument();
    });
  });

  test('renders table with appraisal data', async () => {
    const mockAppraisalData = [{
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'John Doe',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
      expect(screen.getByText('Annual')).toBeInTheDocument();
      expect(screen.getByText('2024-01-01')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  test('renders past due appraisals with red background', async () => {
    const pastDueDate = new Date();
    pastDueDate.setDate(pastDueDate.getDate() - 1); // Yesterday's date
    const pastDueDateString = pastDueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    const mockAppraisalData = [{
      appraisalType: 'Annual',
      dueDate: pastDueDateString,
      statusEmployee: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'John Doe',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const tableRow = screen.getByRole('row', { name: /John Doe IT Annual/i });
      expect(tableRow).toHaveClass('overdue');
    });
  });

  test('renders completed past due appraisals without red background', async () => {
    const futureDueDate = new Date();
    futureDueDate.setDate(futureDueDate.getDate() - 1); // Yesterday's date
    const futureDueDateString = futureDueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    const mockAppraisalData = [{
      appraisalType: 'Annual',
      dueDate: futureDueDateString,
      statusEmployee: 1,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'John Doe',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const tableRow = screen.getByRole('row', { name: /John Doe IT Annual/i });
      expect(tableRow).not.toHaveClass('overdue');
    });
  });

  test('does not apply red background to unsubmitted but not overdue appraisals', async () => {
    const futureDueDate = new Date();
    futureDueDate.setDate(futureDueDate.getDate() + 1);
    const futureDueDateString = futureDueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    const mockAppraisalData = [{
      appraisalType: 'Annual',
      dueDate: futureDueDateString,
      statusEmployee: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'John Doe',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const tableRow = screen.getByRole('row', { name: /John Doe IT Annual/i });
      expect(tableRow).not.toHaveClass('overdue');
    });
  });

  test('Fill up button is enabled for pending appraisals', async () => {
    const mockAppraisalData = [{
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'John Doe',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const fillUpButton = screen.getByText('Fill up');
      expect(fillUpButton).toBeEnabled();
    });
  });

  test('Fill up button is disabled for submitted appraisals', async () => {
    const mockAppraisalData = [{
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 1,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'John Doe',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const fillUpButton = screen.getByText('Fill up');
      expect(fillUpButton).toBeDisabled();
    });
  });

  test('clicking Fill up button navigates to form page', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    const mockAppraisalData = [{
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'John Doe',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const fillUpButton = screen.getByText('Fill up');
      fireEvent.click(fillUpButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/form', {
      state: {
        formID: 'form123',
        staffID: '123',
        role: "employee",
        employeeName: 'John Doe',
        department: 'IT',
        type: 'Annual',
        staffName: 'John Doe'
      }
    });
  });

  test('handles error when fetching appraisal data', async () => {
    console.error = jest.fn();
    axios.post.mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching data', expect.any(Error));
    });
  });

  test('handles error when fetching employee data', async () => {
    console.error = jest.fn();
    axios.post.mockResolvedValueOnce({ data: [{ formID: 'form123' }] });
    axios.post.mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <EmployeeHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching second response', expect.any(Error));
    });
  });
});