import { render, screen, waitFor } from '@testing-library/react';
import ValidateScreen from '@/app/validate/page';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Validate Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders heading and fetches pending locations', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Test Location',
        type: 'Shelter',
        address: '123 Test St',
        contact: '123456789',
        coords: { latitude: 0, longitude: 0 },
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: { payload: mockData } });

    render(<ValidateScreen />);

    const heading = screen.getByText('Pending locations');
    expect(heading).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('Shelter')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
    });
  });
});
