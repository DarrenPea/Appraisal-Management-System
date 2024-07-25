import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import HodHomeTable from '../components/hodhometable';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

describe('HodHomeTable', () => {

  const mockHodResponse = [
    { employeeID: 'Sara', appraisalType: 'Yearly', dueDate: '2024-11-01', statusEmployee: 0, statusHOD: 1, formID: '1' },
    { employeeID: 'James', appraisalType: 'Confirmation', dueDate: '2024-11-02', statusEmployee: 1, statusHOD: 0, formID: '2' }
  ];

  const mockEmployeeResponse = [
    { employeeName: 'Sarah Lee', department: 'manufacturing' },
    { employeeName: 'James Tan', department: 'manufacturing' }
  ];

  beforeEach(() => {
    axios.post.mockImplementation((url, { employeeID }) => {
      if (employeeID === 'Sara') {
        return Promise.resolve({ data: [{ employeeName: 'Sarah Lee', department: 'manufacturing' }] });
      } else if (employeeID === 'James') {
        return Promise.resolve({ data: [{ employeeName: 'James Tan', department: 'manufacturing' }] });
      }
      return Promise.reject(new Error('Not Found'));
    });

    axios.post.mockResolvedValueOnce({ data: mockHodResponse });
  });

  test('renders without crashing', async () => {
    render(
      <BrowserRouter>
        <HodHomeTable HOD_ID="123" name="Test HOD" />
      </BrowserRouter>
    );

    await waitFor(() => {
    expect(screen.getByText('Sarah Lee')).toBeInTheDocument();
		expect(screen.getByText('James Tan')).toBeInTheDocument();
	  });
  });

  test('displays no actions message when no appraisals', async () => {
    axios.post.mockResolvedValueOnce({ data: [] });
    
    render(
      <BrowserRouter>
        <HodHomeTable HOD_ID="123" name="Test HOD" />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('No actions are needed at this time.')).toBeInTheDocument());
  });

  test('opens modal on view button click', async () => {
    render(
      <BrowserRouter>
        <HodHomeTable HOD_ID="123" name="Test HOD" />
      </BrowserRouter>
    );

    await waitFor(() => {
		const elements = screen.getAllByText('View');
		expect(elements).toHaveLength(2);
	  });  

	  const viewButtons = screen.getAllByText('View');
	  fireEvent.click(viewButtons[0]);

    // Check for modal content
	await waitFor(() => {
		const elements = screen.getAllByText('Sarah Lee');
		expect(elements).toHaveLength(2);
	  });  
  });

  test('disables fill up button when conditions are met', async () => {
    render(
      <BrowserRouter>
        <HodHomeTable HOD_ID="123" name="Test HOD" />
      </BrowserRouter>
    );

    await waitFor(() => {
		const elements = screen.getAllByText('Fill up');
		expect(elements).toHaveLength(2);
	});
	

    const fillUpButton = screen.getAllByText('Fill up');
    expect(fillUpButton[0]).toBeDisabled();
  });
});
