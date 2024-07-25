import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Modal from '../components/modal';
import axios from 'axios';

jest.mock('axios');

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  const mockData = {
    jobFunction: 'Developer',
    KPI: '95%',
    disciplinaryRecord: 'None',
    attendanceRecord: '98%'
  };

  beforeEach(() => {
    axios.post.mockResolvedValueOnce({ data: [mockData] });
    mockOnClose.mockClear();
  });

  test('renders modal with employee name', async () => {
    render(
      <Modal onClose={mockOnClose} employeeID="123" employeeName="Sarah Lee" />
    );

    await waitFor(() => {
      expect(screen.getByText('Sarah Lee')).toBeInTheDocument();
    });
  });

  test('displays employee details fetched from API', async () => {
    render(
      <Modal onClose={mockOnClose} employeeID="123" employeeName="Sarah Lee" />
    );

    await waitFor(() => {
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('None')).toBeInTheDocument();
      expect(screen.getByText('98%')).toBeInTheDocument();
    });
  });

  test('closes modal when close button is clicked', () => {
    render(
      <Modal onClose={mockOnClose} employeeID="123" employeeName="Sarah Lee" />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('closes modal when clicking outside the modal content', () => {
    render(
      <Modal onClose={mockOnClose} employeeID="123" employeeName="Sarah Lee" />
    );

    fireEvent.click(screen.getByRole('dialog'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not close modal when clicking inside the modal content', () => {
    render(
      <Modal onClose={mockOnClose} employeeID="123" employeeName="Sarah Lee" />
    );

    fireEvent.click(screen.getByText('Sarah Lee'));

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
