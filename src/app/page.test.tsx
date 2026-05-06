import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the child component to simplify testing the Home page structure
jest.mock('@/components/SignInFormComponent/SignInFormComponent', () => {
  return function DummySignInForm() {
    return <div data-testid="sign-in-form">SignInForm Mock</div>;
  };
});

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    
    const heading = screen.getByRole('heading', {
      name: /Community Cares/i,
    });
    
    expect(heading).toBeInTheDocument();
  });

  it('renders the SignInFormComponent', () => {
    render(<Home />);
    
    const signInForm = screen.getByTestId('sign-in-form');
    
    expect(signInForm).toBeInTheDocument();
  });
});
