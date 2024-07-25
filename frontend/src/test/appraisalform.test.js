import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import AppraisalForm from '../components/appraisalform';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      formID: '123',
      staffID: '456',
      role: 'employee',
      employeeName: 'John Doe',
      department: 'IT',
      type: 'Annual',
      staffName: 'John Doe',
      employeeID: '789'
    }
  }),
  useNavigate: () => jest.fn()
}));

describe('AppraisalForm', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: [{}] });
	jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
	window.confirm.mockRestore();
  });

  test('renders AppraisalForm component', async () => {
    await act(async () => {
		render(
		  <MemoryRouter>
			<AppraisalForm />
		  </MemoryRouter>
		);
	});
    expect(screen.getByText(/Appraisal Form ID: 123/i)).toBeInTheDocument();
  });

  test('displays employee details when role is employee', async () => {
    await act(async () => {
		render(
		  <MemoryRouter>
			<AppraisalForm />
		  </MemoryRouter>
		);
    });
    expect(screen.getByText(/Name: John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Department: IT/i)).toBeInTheDocument();
  });

  test('handles form input changes', async () => {
    await act(async () => {
		render(
		  <MemoryRouter>
			<AppraisalForm />
		  </MemoryRouter>
		);
	});
    const textarea = screen.getByLabelText(/A1 Elaborate your understanding of your primary role and responsibilities:/i);
	await act(async () => {
		fireEvent.change(textarea, { target: { value: 'Test input' } });
	});
	expect(textarea.value).toBe('Test input');
  });

  test('calculates overall rating correctly', async () => {
	await act(async () => {
		render(
			<MemoryRouter>
			<AppraisalForm />
			</MemoryRouter>
		);
	});
  
	// Select all radio inputs
	const ratingInputs = screen.getAllByRole('radio');
  
	// Select the first option (value 1) for each question
	ratingInputs.forEach((input, index) => {
	  if (index % 5 === 0) { // Select first option for each question
		fireEvent.click(input);
	  }
	});
  
	// Check for the label
	expect(screen.getByText('Overall Rating:')).toBeInTheDocument();
  
	// Check for the rating value
	const ratingElement = screen.getByText(/1.00 \/ 5/);
	expect(ratingElement).toBeInTheDocument();
  
	// If you want to be more specific, you can check the class as well
	expect(ratingElement).toHaveClass('overallRating');
  });

  test('shows confirmation modal on form submission', async() => {
    await act(async () => {
		render(
		  <MemoryRouter>
			<AppraisalForm />
		  </MemoryRouter>
		);
	});
    const submitButton = screen.getByText(/Submit/i);
    await act(async () => {
		fireEvent.click(submitButton);
	});
    expect(screen.getByText(/Details/i)).toBeInTheDocument();
  });

  test('submits form data on confirmation', async () => {
	await act(async () => {
		render(
		  <MemoryRouter>
			<AppraisalForm />
		  </MemoryRouter>
		);
	});
  
	// Fill out the form (you may need to add more inputs depending on your form)
	const textarea = screen.getByLabelText(/A1 Elaborate your understanding of your primary role and responsibilities:/i);
	await act(async () => {
		fireEvent.change(textarea, { target: { value: 'Test input' } });
	});  

	// Submit the form
	const submitButton = screen.getByText(/Submit/i);
	await act(async () => {
      	fireEvent.click(submitButton);
    });  
	// The window.confirm will automatically return true due to our mock
  
	// Now the modal should be visible, let's check for the OK button
	const confirmButton = await screen.findByText(/OK/i);
	expect(confirmButton).toBeInTheDocument();
  
	// Click the OK button
	fireEvent.click(confirmButton);
  
	// Check if the form submission API was called
	await waitFor(() => {
	  expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/form/employee/submit', expect.any(Object));
	});
  });

  test('displays different content for HOD role', async () => {
	jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
	  state: { 
		role: 'hod', 
		employeeName: 'John Doe',
		formID: '123',
		staffID: '456',
		department: 'IT',
		type: 'Annual',
		staffName: 'John Doe',
		employeeID: '789'
	  }
	});
	
	axios.post.mockResolvedValueOnce({
	  data: [{
		jobFunction: 'Software Developer',
		KPI: 'Completed 10 projects',
		disciplinaryRecord: 'None',
		attendanceRecord: '98%'
	  }]
	});

	await act(async () => {
		render(
		  <MemoryRouter>
			<AppraisalForm />
		  </MemoryRouter>
		);
	});
  
	// Check for the heading and employee name
	expect(screen.getByText('Employee Details')).toBeInTheDocument();
	expect(screen.getByText('Employee Name: John Doe')).toBeInTheDocument();
  
	// Check for department and purpose
	expect(screen.getByText('Department: IT')).toBeInTheDocument();
	expect(screen.getByText('Purpose: Annual')).toBeInTheDocument();
  
	// Check for the table headers
	expect(screen.getByRole('columnheader', { name: /Job Function/i })).toBeInTheDocument();
	expect(screen.getByRole('columnheader', { name: /KPI/i })).toBeInTheDocument();
	expect(screen.getByRole('columnheader', { name: /Disciplinary Record/i })).toBeInTheDocument();
	expect(screen.getByRole('columnheader', { name: /Attendance Record/i })).toBeInTheDocument();
  
	// Wait for the axios call to resolve and check for the employee details in the table
	await waitFor(() => {
	  expect(screen.getByRole('cell', { name: 'Software Developer' })).toBeInTheDocument();
	  expect(screen.getByRole('cell', { name: 'Completed 10 projects' })).toBeInTheDocument();
	  expect(screen.getByRole('cell', { name: 'None' })).toBeInTheDocument();
	  expect(screen.getByRole('cell', { name: '98%' })).toBeInTheDocument();
	});
  });

  test('displays different content for HR role', async () => {
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: { role: 'hr', employeeName: 'John Doe', department: 'IT', type: 'Annual' }
    });
    await act(async () => {
      render(
        <MemoryRouter>
          <AppraisalForm />
        </MemoryRouter>
      );
    });
    expect(screen.getByText(/Name: John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Department: IT/i)).toBeInTheDocument();
    expect(screen.getByText(/Purpose: Annual/i)).toBeInTheDocument();
  });
});