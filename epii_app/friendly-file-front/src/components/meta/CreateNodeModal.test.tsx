import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CreateNodeModal from './CreateNodeModal';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useQueryClient
const mockInvalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

const queryClient = new QueryClient();

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('CreateNodeModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Default successful response for relationship suggestions
    mockedAxios.get.mockResolvedValue({ data: ['SUGGESTED_REL_1', 'SUGGESTED_REL_2'] });
  });

  test('renders correctly with initial props', () => {
    render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
    expect(screen.getByText('Create New Bimba Node')).toBeInTheDocument();
    expect(screen.getByLabelText('Bimba Coordinate')).toHaveValue('#');
    expect(screen.getByLabelText('Node Name')).toHaveValue('');
    // More assertions for initial state
  });

  test('input fields update state', () => {
    render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
    const coordinateInput = screen.getByLabelText('Bimba Coordinate');
    const nodeNameInput = screen.getByLabelText('Node Name');

    fireEvent.change(coordinateInput, { target: { value: '#test-coord' } });
    expect(coordinateInput).toHaveValue('#test-coord');

    fireEvent.change(nodeNameInput, { target: { value: 'Test Node' } });
    expect(nodeNameInput).toHaveValue('Test Node');
  });

  describe('Coordinate normalization and parent detection', () => {
    test('normalizes "." to "-" and detects parent', async () => {
      render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
      const coordinateInput = screen.getByLabelText('Bimba Coordinate');
      
      await act(async () => {
        fireEvent.change(coordinateInput, { target: { value: '#parent.child' } });
      });
      
      // Wait for state updates triggered by useEffect
      await waitFor(() => {
        expect(coordinateInput).toHaveValue('#parent-child');
        expect(screen.getByLabelText('Detected Parent')).toHaveValue('#parent');
      });
    });

    test('detects parent for simple coordinate like #segment', async () => {
        render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
        const coordinateInput = screen.getByLabelText('Bimba Coordinate');
        
        await act(async () => {
          fireEvent.change(coordinateInput, { target: { value: '#segment1' } });
        });
        
        await waitFor(() => {
          expect(coordinateInput).toHaveValue('#segment1');
          expect(screen.getByLabelText('Detected Parent')).toHaveValue('#');
        });
      });
      
    test('handles coordinate "#" correctly (no parent)', async () => {
      render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
      const coordinateInput = screen.getByLabelText('Bimba Coordinate');
      
      // First change to something valid that has a parent
      await act(async () => {
        fireEvent.change(coordinateInput, { target: { value: '#parent-child' } });
      });
      await waitFor(() => {
        expect(screen.getByLabelText('Detected Parent')).toHaveValue('#parent');
      });

      // Then change back to "#"
      await act(async () => {
        fireEvent.change(coordinateInput, { target: { value: '#' } });
      });
      
      await waitFor(() => {
        expect(coordinateInput).toHaveValue('#');
        expect(screen.getByLabelText('Detected Parent')).toHaveValue('');
      });
    });
    // Add more coordinate normalization/parent detection test cases
  });

  describe('Relationship suggestions', () => {
    test('are fetched and displayed when parent is detected', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: ['HAS_COMPONENT', 'IS_PART_OF'] });
      render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
      
      const coordinateInput = screen.getByLabelText('Bimba Coordinate');
      await act(async () => {
        fireEvent.change(coordinateInput, { target: { value: '#parent-1' } });
      });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/graph/relationship-suggestions?parentCoordinate=%23parent')
        );
      });
      
      // Open the select dropdown
      fireEvent.mouseDown(screen.getByRole('combobox', { name: /relationship type/i }));

      await waitFor(() => {
        expect(screen.getByText('HAS_INTERNAL_COMPONENT')).toBeInTheDocument(); // Default
        expect(screen.getByText('HAS_COMPONENT')).toBeInTheDocument();
        expect(screen.getByText('IS_PART_OF')).toBeInTheDocument();
      });
    });

    test('shows loading state for suggestions', async () => {
        mockedAxios.get.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ data: ['LATER_REL'] }), 100)));
        render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
        
        const coordinateInput = screen.getByLabelText('Bimba Coordinate');
        await act(async () => {
          fireEvent.change(coordinateInput, { target: { value: '#parent-loading' } });
        });
  
        fireEvent.mouseDown(screen.getByRole('combobox', { name: /relationship type/i }));
        expect(await screen.findByText('Loading suggestions...')).toBeInTheDocument();
        expect(await screen.findByText('LATER_REL')).toBeInTheDocument(); // ensure it resolves
      });
  });
  

  describe('Validation errors', () => {
    test('coordinate error prevents submission', async () => {
      render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
      const coordinateInput = screen.getByLabelText('Bimba Coordinate');
      const submitButton = screen.getByRole('button', { name: 'Create Node' });

      // Trigger coordinate error
      await act(async () => {
        fireEvent.change(coordinateInput, { target: { value: '#invalid-' } });
      });
      await waitFor(() => {
        expect(screen.getByText(/Invalid format. Use # or #segment1-segment2/i)).toBeInTheDocument();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid coordinate: Invalid format./i)).toBeInTheDocument(); // Submission error
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test('empty node name prevents submission', async () => {
        render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
        fireEvent.change(screen.getByLabelText('Bimba Coordinate'), { target: { value: '#valid-coord' } });
        // Node name is empty by default
        fireEvent.click(screen.getByRole('button', { name: 'Create Node' }));
  
        await waitFor(() => {
          expect(screen.getByText('Node name is required.')).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      test('coordinate "#" prevents submission', async () => {
        render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
        // Coordinate is '#' by default
        fireEvent.change(screen.getByLabelText('Node Name'), { target: { value: 'Some Name' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create Node' }));
  
        await waitFor(() => {
          expect(screen.getByText(/Cannot create a node with coordinate "#"/i)).toBeInTheDocument();
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
  });

  test('sacred confirmation appears and can be accepted/declined', async () => {
    window.confirm = jest.fn();
    render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText('Bimba Coordinate'), { target: { value: '#node1' } });
    fireEvent.change(screen.getByLabelText('Node Name'), { target: { value: 'Node One' } });
    
    const submitButton = screen.getByRole('button', { name: 'Create Node' });

    // Decline confirmation
    (window.confirm as jest.Mock).mockReturnValueOnce(false);
    fireEvent.click(submitButton);
    expect(window.confirm).toHaveBeenCalledWith("You are about to add a new node to the sacred Bimba map. Proceed?");
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Accept confirmation
    (window.confirm as jest.Mock).mockReturnValueOnce(true);
    mockedAxios.post.mockResolvedValueOnce({ status: 201, data: { id: '123', name: 'Node One' } }); // Mock API success
    fireEvent.click(submitButton);
    expect(window.confirm).toHaveBeenCalledTimes(2); // Called again
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test('qlPosition is extracted correctly', async () => {
    window.confirm = jest.fn().mockReturnValue(true); // Always confirm
    mockedAxios.post.mockResolvedValue({ status: 201, data: { id: '123' } });

    render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
    fireEvent.change(screen.getByLabelText('Node Name'), { target: { value: 'Test QL Node' } });
    
    // Case 1: qlPosition present
    fireEvent.change(screen.getByLabelText('Bimba Coordinate'), { target: { value: '#abc-123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Node' }));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/graph/create-node'),
        expect.objectContaining({ qlPosition: 123 }),
        expect.any(Object) // Headers
      );
    });
    mockedAxios.post.mockClear(); // Clear for next call

    // Case 2: qlPosition not a number
    fireEvent.change(screen.getByLabelText('Bimba Coordinate'), { target: { value: '#abc-xyz' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Node' }));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/graph/create-node'),
        expect.objectContaining({ qlPosition: null }),
        expect.any(Object) // Headers
      );
    });
    mockedAxios.post.mockClear();

     // Case 3: qlPosition in middle, should be null
     fireEvent.change(screen.getByLabelText('Bimba Coordinate'), { target: { value: '#abc-123-xyz' } });
     fireEvent.click(screen.getByRole('button', { name: 'Create Node' }));
     await waitFor(() => {
       expect(mockedAxios.post).toHaveBeenCalledWith(
         expect.stringContaining('/api/graph/create-node'),
         expect.objectContaining({ qlPosition: null }),
         expect.any(Object) // Headers
       );
     });
  });

  test('successful submission calls API, invalidates query, calls onSubmit, and resets form', async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    const mockResponseData = { id: 'new-node-id', name: 'New Node', bimbaCoordinate: '#new-node' };
    mockedAxios.post.mockResolvedValue({ status: 201, data: mockResponseData });

    render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
    const coordinateInput = screen.getByLabelText('Bimba Coordinate');
    const nodeNameInput = screen.getByLabelText('Node Name');
    const submitButton = screen.getByRole('button', { name: 'Create Node' });

    fireEvent.change(coordinateInput, { target: { value: '#new-node' } });
    fireEvent.change(nodeNameInput, { target: { value: 'New Node' } });
    // Select a relationship type if needed, default is HAS_INTERNAL_COMPONENT

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/graph/create-node'),
        expect.objectContaining({
          bimbaCoordinate: '#new-node',
          parentCoordinate: '#', // Auto-detected
          nodeName: 'New Node',
          relationshipType: 'HAS_INTERNAL_COMPONENT',
          qlPosition: null, // as #new-node has no numeric end
          additionalProperties: { uiSource: 'EPII_CREATE_NODE_MODAL' }
        }),
        expect.any(Object) // Headers
      );
    });
    
    await waitFor(() => expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['fullGraph'] }));
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith(mockResponseData));
    
    // Check if form is reset
    expect(coordinateInput).toHaveValue('#');
    expect(nodeNameInput).toHaveValue('');
    // Check relationship type reset if it was changed
  });

  test('API error during submission displays an error message', async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockedAxios.post.mockRejectedValue({ 
      response: { data: { error: 'Backend error: Duplicate coordinate' } } 
    });

    render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
    fireEvent.change(screen.getByLabelText('Bimba Coordinate'), { target: { value: '#existing-node' } });
    fireEvent.change(screen.getByLabelText('Node Name'), { target: { value: 'Existing Node Name' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Node' }));

    await waitFor(() => {
      expect(screen.getByText('Backend error: Duplicate coordinate')).toBeInTheDocument();
    });
    expect(mockInvalidateQueries).not.toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('form is disabled during submission', async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ status: 201, data: { id: '1' } }), 100)));
    
    render(<CreateNodeModal {...defaultProps} />, { wrapper: Wrapper });
    fireEvent.change(screen.getByLabelText('Bimba Coordinate'), { target: { value: '#submitting' } });
    fireEvent.change(screen.getByLabelText('Node Name'), { target: { value: 'Submitting Node' } });

    const submitButton = screen.getByRole('button', { name: 'Create Node' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Creating Node...' })).toBeInTheDocument();
      expect(screen.getByLabelText('Bimba Coordinate')).toBeDisabled();
      expect(screen.getByLabelText('Node Name')).toBeDisabled();
      // Check other fields are disabled
    });

    // Wait for the submission to complete
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled(), { timeout: 200 });
    expect(submitButton).not.toBeDisabled(); // Should be re-enabled after submission
  });
});

// Helper to provide a basic QueryClient for tests that need it via useQueryClient
// const createTestQueryClient = () => new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: false, // Prevent retries in tests
//     },
//   },
// });

// const renderWithClient = (ui: React.ReactElement) => {
//   const testQueryClient = createTestQueryClient();
//   const { rerender, ...result } = render(
//     <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
//   );
//   return {
//     ...result,
//     rerender: (rerenderUi: React.ReactElement) =>
//       rerender(
//         <QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>
//       ),
//   };
// };
