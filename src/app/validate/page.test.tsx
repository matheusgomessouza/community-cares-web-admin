import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ValidateScreen from '@/app/validate/page';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Validate Screen', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
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

    render(
      <QueryClientProvider client={queryClient}>
        <ValidateScreen />
      </QueryClientProvider>
    );

    const heading = screen.getByText('Pending locations');
    expect(heading).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('Shelter')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
    });
  });

  it('sends the image_url when the admin approves a location', async () => {
    const mockData = [
      {
        id: 2,
        name: 'Location With Image',
        type: 'Shelter',
        address: '1 Test St',
        contact: '123456789',
        coords: { latitude: 0, longitude: 0 },
        image_url: 'https://bucket.s3.sa-east-1.amazonaws.com/locations/a.webp',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: { payload: mockData } });
    mockedAxios.post.mockResolvedValueOnce({ status: 201 });

    render(
      <QueryClientProvider client={queryClient}>
        <ValidateScreen />
      </QueryClientProvider>
    );

    const approveButton = await screen.findByRole('button', { name: /approve/i });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/locations'),
        expect.objectContaining({
          image_url: 'https://bucket.s3.sa-east-1.amazonaws.com/locations/a.webp',
        }),
        expect.anything()
      );
    });
  });
});
