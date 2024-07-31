import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import HodHomeTable from '../components/hodhometable';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
jest.mock('../components/modal', () => ({ onClose, employeeID, employeeName }) => (
  <div data-testid="modal">
    Modal for {employeeName} (ID: {employeeID})
    <button onClick={onClose}>Close</button>
  </div>
));

describe('HodHomeTable', () => {
  const mockProps = {
    HOD_ID: '123',
    name: 'John Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders no actions message when no appraisals', async () => {
    axios.post.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No actions are needed at this time.')).toBeInTheDocument();
    });
  });

  test('renders table with appraisal data', async () => {
    const mockAppraisalData = [{
      employeeID: 'emp123',
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 0,
      statusHOD: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
      expect(screen.getByText('Annual')).toBeInTheDocument();
      expect(screen.getByText('2024-01-01')).toBeInTheDocument();
      expect(screen.getAllByText('Pending')).toHaveLength(2);
    });
  });

  test('renders table with multiple employees', async () => {
    const mockAppraisalData = [
      {
        employeeID: 'emp123',
        appraisalType: 'Annual',
        dueDate: '2023-12-31',
        statusEmployee: 0,
        statusHOD: 0,
        formID: 'form123',
      },
      {
        employeeID: 'emp456',
        appraisalType: 'Mid-Year',
        dueDate: '2023-06-30',
        statusEmployee: 1,
        statusHOD: 0,
        formID: 'form456',
      }
    ];
  
    const mockEmployeeData1 = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];
  
    const mockEmployeeData2 = [{
      employeeName: 'John Doe',
      department: 'HR',
    }];
  
    // Mock the first axios call to return appraisal data
    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
  
    // Mock subsequent axios calls for each employee
    axios.post
      .mockResolvedValueOnce({ data: mockEmployeeData1 })
      .mockResolvedValueOnce({ data: mockEmployeeData2 });
  
    render(
      <MemoryRouter>
        <HodHomeTable HOD_ID="123" name="Test HOD" />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
      expect(screen.getByText('HR')).toBeInTheDocument();
      expect(screen.getByText('Annual')).toBeInTheDocument();
      expect(screen.getByText('Mid-Year')).toBeInTheDocument();
      expect(screen.getAllByText('Pending')).toHaveLength(3);
      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });
  
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // Header row + 2 data rows
  });

  test('Fill up button is enabled when employee has submitted and HOD is pending', async () => {
    const mockAppraisalData = [{
      employeeID: 'emp123',
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 1,
      statusHOD: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const fillUpButton = screen.getByText('Fill up');
      expect(fillUpButton).toBeEnabled();
    });
  });

  test('Fill up button is disabled when HOD has already submitted', async () => {
    const mockAppraisalData = [{
      employeeID: 'emp123',
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 1,
      statusHOD: 1,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
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
      employeeID: 'emp123',
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 1,
      statusHOD: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
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
        role: "hod",
        employeeName: 'Jane Smith',
        department: 'IT',
        type: 'Annual',
        employeeID: 'emp123',
        staffName: 'John Doe'
      }
    });
  });

  test('clicking View button opens modal', async () => {
    const mockAppraisalData = [{
      employeeID: 'emp123',
      appraisalType: 'Annual',
      dueDate: '2023-12-31',
      statusEmployee: 0,
      statusHOD: 0,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const viewButton = screen.getByText('View');
      fireEvent.click(viewButton);
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Modal for Jane Smith (ID: emp123)')).toBeInTheDocument();
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
    const mockEmployeeData = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const row = screen.getByRole('row', { name: /Jane Smith IT Annual/i });
      expect(row).toHaveClass('overdue');
    });
  });

  test('renders completed forms with non-red background', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];

    const mockAppraisalData = [{
      employeeID: 'emp123',
      appraisalType: 'Annual',
      dueDate: pastDateString,
      statusEmployee: 1,
      statusHOD: 1,
      formID: 'form123',
    }];
    const mockEmployeeData = [{
      employeeName: 'Jane Smith',
      department: 'IT',
    }];

    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
    axios.post.mockResolvedValueOnce({ data: mockEmployeeData });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const row = screen.getByRole('row', { name: /Jane Smith IT Annual/i });
      expect(row).not.toHaveClass('overdue');
    });
  });

  test('sorts appraisals by due date if all have not submitted', async () => {
    const mockAppraisalData = [
      {
        employeeID: 'emp123',
        appraisalType: 'Annual',
        dueDate: '2023-12-31',
        statusEmployee: 0,
        statusHOD: 0,
        formID: 'form123',
      },
      {
        employeeID: 'emp456',
        appraisalType: 'Mid-Year',
        dueDate: '2023-06-30',
        statusEmployee: 0,
        statusHOD: 0,
        formID: 'form456',
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

    // Mock the first axios call to return appraisal data
    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
  
    // Mock subsequent axios calls for each employee
    axios.post
      .mockResolvedValueOnce({ data: mockEmployeeData1 })
      .mockResolvedValueOnce({ data: mockEmployeeData2 });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Bob Johnson'); // Earlier due date should be first
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
    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
  
    // Mock subsequent axios calls for each employee
    axios.post
      .mockResolvedValueOnce({ data: mockEmployeeData1 })
      .mockResolvedValueOnce({ data: mockEmployeeData2 })
      .mockResolvedValueOnce({ data: mockEmployeeData3 });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
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
    axios.post.mockResolvedValueOnce({ data: mockAppraisalData });
  
    // Mock subsequent axios calls for each employee
    axios.post
      .mockResolvedValueOnce({ data: mockEmployeeData1 })
      .mockResolvedValueOnce({ data: mockEmployeeData2 })
      .mockResolvedValueOnce({ data: mockEmployeeData3 });

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
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
    axios.post.mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <HodHomeTable {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching data', expect.any(Error));
    });
  });

  test('handles error when fetching employee data', async () => {
    console.error = jest.fn();
    axios.post.mockResolvedValueOnce({ data: [{ 
        employeeID: 'emp123',
        appraisalType: 'Annual',
        dueDate: '2023-12-31',
        statusEmployee: 0,
        statusHOD: 0,
        formID: 'form123',
    }] });
    axios.post.mockRejectedValueOnce(new Error('API error'));

    render(
        <MemoryRouter>
            <HodHomeTable {...mockProps} />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error fetching second response', expect.any(Error));
    });

    // Check that no appraisal data is rendered
    expect(screen.queryByText('Annual')).not.toBeInTheDocument();
    expect(screen.getByText('No actions are needed at this time.')).toBeInTheDocument();
  });


});