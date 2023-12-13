import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthToken } from '../AuthTokenContext';
import AuthDebugger from '../components/AuthDebugger';


// Mock the useAuth0 and useAuthToken hooks
jest.mock('@auth0/auth0-react');
jest.mock('../AuthTokenContext');

describe('AuthDebugger Component', () => {
  // Mock the user and accessToken for testing
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockAccessToken = 'mock-access-token';

  beforeEach(() => {
    // Mock the useAuth0 hook
    useAuth0.mockReturnValue({
      user: mockUser,
    });

    // Mock the useAuthToken hook
    useAuthToken.mockReturnValue({
      accessToken: mockAccessToken,
    });
  });

  test('renders AuthDebugger component with correct token and user info', () => {
    render(<AuthDebugger />);

    expect(screen.getByText('Access Token:')).toBeInTheDocument();

    // Use a custom text matcher with a regular expression to match the access token
    expect(screen.getByText(/mock-access-token/)).toBeInTheDocument();
  
    expect(screen.getByText('User Info')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();  
    expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();  


  });
});
