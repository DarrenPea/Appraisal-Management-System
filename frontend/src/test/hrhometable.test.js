import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import HrHomeTable from '../components/hrhometable';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

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

  test('renders table with multiple appraisals', async () => {
    const mockAppraisalData = [
      { employeeID: 'emp123', appraisalType: 'Annual', dueDate: '2023-12-31', statusEmployee: 0, statusHOD: 0, formID: 'form123' },
      { employeeID: 'emp456', appraisalType: 'Mid-Year', dueDate: '2023-06-30', statusEmployee: 1, statusHOD: 0, formID: 'form456' }
    ];

    axios.get.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: [{ employeeName: 'Jane Smith', department: 'IT' }] })
             .mockResolvedValueOnce({ data: [{ employeeName: 'John Doe', department: 'HR' }] });

    render(
      <MemoryRouter>
        <HrHomeTable HR_ID="123" name="Test HR" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
      expect(screen.getByText('HR')).toBeInTheDocument();
      expect(screen.getByText('Annual')).toBeInTheDocument();
      expect(screen.getByText('Mid-Year')).toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // Header row + 2 data rows
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

  test('renders overdue forms with red background', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];

    const mockAppraisalData = [{
      employeeID: 'emp123',
      appraisalType: 'Annual',
      dueDate: pastDateString,
      statusEmployee: 0,
      statusHOD: 0,
      formID: 'form123',
    }];

    axios.get.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: [{ employeeName: 'Jane Smith', department: 'IT' }] });

    render(
      <MemoryRouter>
        <HrHomeTable HR_ID="123" name="Test HR" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const row = screen.getByRole('row', { name: /Jane Smith IT Annual/i });
      expect(row).toHaveClass('overdue');
    });
  });

  test('does not apply red background to overdue but completed appraisals', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];

    const mockAppraisalData = [
      { employeeID: 'emp123', appraisalType: 'Annual', dueDate: pastDateString, statusEmployee: 1, statusHOD: 1, formID: 'form123' }
    ];

    axios.get.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: [{ employeeName: 'Jane Smith', department: 'IT' }] });

    render(
      <MemoryRouter>
        <HrHomeTable HR_ID="123" name="Test HR" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const row = screen.getByRole('row', { name: /Jane Smith IT Annual/i });
      expect(row).not.toHaveClass('overdue');
    });
  });

  test('sorts appraisals by due date if all have not submitted', async () => {
    const mockAppraisalData = [
      { employeeID: 'emp123', appraisalType: 'Annual', dueDate: '2023-12-31', statusEmployee: 0, statusHOD: 0, formID: 'form123' },
      { employeeID: 'emp456', appraisalType: 'Mid-Year', dueDate: '2023-06-30', statusEmployee: 0, statusHOD: 0, formID: 'form456' }
    ];

    axios.get.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: [{ employeeName: 'Jane Smith', department: 'IT' }] })
             .mockResolvedValueOnce({ data: [{ employeeName: 'John Doe', department: 'HR' }] });

    render(
      <MemoryRouter>
        <HrHomeTable HR_ID="123" name="Test HR" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('John Doe'); // Earlier due date should be first
      expect(rows[2]).toHaveTextContent('Jane Smith');
    });
  });

  test('sorts appraisals by due date if all have submitted', async () => {
    const mockAppraisalData = [
      {
        employeeID: 'emp123',
        appraisalType: 'Annual',
        dueDate: '2023-12-31',
        statusEmployee: 1,
        statusHOD: 1,
        formID: 'form123',
      },
      {
        employeeID: 'emp456',
        appraisalType: 'Mid-Year',
        dueDate: '2023-06-30',
        statusEmployee: 1,
        statusHOD: 1,
        formID: 'form456',
      },
      {
        employeeID: 'emp789',
        appraisalType: 'Mid-Year',
        dueDate: '2024-07-20',
        statusEmployee: 1,
        statusHOD: 1,
        formID: 'form789',
      }
    ];

    const mockEmployeeData1 = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];
  
    const mockEmployeeData2 = [{
      employeeName: 'Bob Johnson',
      department: 'HR',
    }];

    const mockEmployeeData3 = [{
      employeeName: 'Alice Doe',
      department: 'Finance',
    }];

    // Mock the first axios call to return appraisal data
    axios.get.mockResolvedValueOnce({ data: mockAppraisalData });
  
    // Mock subsequent axios calls for each employee
    axios.post
      .mockResolvedValueOnce({ data: mockEmployeeData1 })
      .mockResolvedValueOnce({ data: mockEmployeeData2 })
      .mockResolvedValueOnce({ data: mockEmployeeData3 });

    render(
      <MemoryRouter>
        <HrHomeTable HR_ID="123" name="Test HR" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Bob Johnson'); // Earlier due date should be first
      expect(rows[2]).toHaveTextContent('Jane Smith');
      expect(rows[3]).toHaveTextContent('Alice Doe');
    });
  });

  test('sorts appraisals by due date if some have submitted and some have not', async () => {
    const mockAppraisalData = [
      {
        employeeID: 'emp123',
        appraisalType: 'Annual',
        dueDate: '2023-12-31',
        statusEmployee: 1,
        statusHOD: 0,
        formID: 'form123',
      },
      {
        employeeID: 'emp456',
        appraisalType: 'Mid-Year',
        dueDate: '2023-06-30',
        statusEmployee: 1,
        statusHOD: 1,
        formID: 'form456',
      },
      {
        employeeID: 'emp789',
        appraisalType: 'Mid-Year',
        dueDate: '2024-07-20',
        statusEmployee: 0,
        statusHOD: 0,
        formID: 'form789',
      }
    ];

    const mockEmployeeData1 = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];
  
    const mockEmployeeData2 = [{
      employeeName: 'Bob Johnson',
      department: 'HR',
    }];

    const mockEmployeeData3 = [{
      employeeName: 'Alice Doe',
      department: 'Finance',
    }];

    // Mock the first axios call to return appraisal data
    axios.get.mockResolvedValueOnce({ data: mockAppraisalData });
  
    // Mock subsequent axios calls for each employee
    axios.post
      .mockResolvedValueOnce({ data: mockEmployeeData1 })
      .mockResolvedValueOnce({ data: mockEmployeeData2 })
      .mockResolvedValueOnce({ data: mockEmployeeData3 });

    render(
      <MemoryRouter>
        <HrHomeTable HR_ID="123" name="Test HR" />
      </MemoryRouter>
    );

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Jane Smith');
      expect(rows[2]).toHaveTextContent('Alice Doe');
      expect(rows[3]).toHaveTextContent('Bob Johnson');
    });
  });

  test('handles error when fetching appraisal data', async () => {
    console.error = jest.fn();
    axios.get.mockRejectedValueOnce(new Error('API error'));
  
    render(
      <MemoryRouter>
        <HrHomeTable HR_ID="123" name="John Doe" />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching data', expect.any(Error));
    });
  
    expect(screen.getByText('No actions are needed at this time.')).toBeInTheDocument();
  });

  test('handles error when fetching employee data', async () => {
    console.error = jest.fn();
    axios.get.mockResolvedValueOnce({ data: [{ 
      employeeID: 'emp123',
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 0,
      statusHOD: 0,
      hodID: 'hod123',
      formID: 'form123',
    }] });
    axios.post.mockRejectedValueOnce(new Error('API error'));
  
    render(
      <MemoryRouter>
        <HrHomeTable HR_ID="123" name="John Doe" />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching second response', expect.any(Error));
    });
  
    // Check that no appraisal data is rendered
    expect(screen.queryByText('Annual')).not.toBeInTheDocument();
    expect(screen.getByText('No actions are needed at this time.')).toBeInTheDocument();
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
