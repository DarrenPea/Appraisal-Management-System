import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../components/Login';

// Mock the modules
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  test('renders login form', () => {
    expect(screen.getByText('TSH GROUP')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  test('allows entering username and password', () => {
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  test('handles non-existent username', async () => {
    axios.post.mockResolvedValue({ data: [1] });
    
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Wrong username!');
    });

    alertMock.mockRestore();
  });

  test('handles wrong password', async () => {
    axios.post.mockResolvedValue({ data: [2] });
    
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Wrong password!');
    });

    alertMock.mockRestore();
  });

  test('navigates to HR page on successful HR login', async () => {
	const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    axios.post.mockResolvedValue({ data: [{ role: 'HR', hrName: 'Test HR' }] });

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(usernameInput, { target: { value: 'hruser' } });
    fireEvent.change(passwordInput, { target: { value: 'hrpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/auth', {
        staffID: 'hruser',
        password: 'hrpass'
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/hr', expect.objectContaining({
        state: expect.objectContaining({
          staffID: 'hruser',
          name: 'Test HR'
        })
      }));
    });

  });

  test('navigates to Employee page on successful Employee login', async () => {
	const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    axios.post.mockResolvedValue({ data: [{ role: 'Employee', employeeName: 'Test Employee' }] });

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(usernameInput, { target: { value: 'employee' } });
    fireEvent.change(passwordInput, { target: { value: 'employeepass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/auth', {
        staffID: 'employee',
        password: 'employeepass'
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/employee', expect.objectContaining({
        state: expect.objectContaining({
          staffID: 'employee',
          name: 'Test Employee'
        })
      }));
    });

  });

  test('navigates to HOD page on successful HOD login', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    axios.post.mockResolvedValue({ data: [{ role: 'HOD', hodName: 'Test HOD' }] });

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(usernameInput, { target: { value: 'hoduser' } });
    fireEvent.change(passwordInput, { target: { value: 'hodpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/auth', {
        staffID: 'hoduser',
        password: 'hodpass'
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/hod', expect.objectContaining({
        state: expect.objectContaining({
          staffID: 'hoduser',
          name: 'Test HOD'
        })
      }));
    });
  });

});