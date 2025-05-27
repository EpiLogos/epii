import request from 'supertest';
// Assuming your Express app instance is exported from 'app.mjs' or similar in your backend root
// You might need to adjust the path to your main application file.
// For example, if your main file is `epii_app/friendly-file-backend/server.mjs` (and it exports the app)
// import app from '../../server.mjs'; // Adjust based on your actual app export
// For this example, let's assume `app.mjs` exists at the root of `friendly-file-backend`
import app from '../../app.mjs'; // Placeholder: Adjust this path

// Mock the bpMCPService to control its behavior during tests
// This allows testing the route and controller logic without hitting the actual database
// or relying on the full behavior of the service for most tests.
import bpMCPService from '../../services/bpMCPService.mjs';

jest.mock('../../services/bpMCPService.mjs'); // Mock the entire service

describe('Graph API - /api/graph', () => {
  const mockServiceInstance = bpMCPService; // Get the mocked default instance

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/graph/create-node', () => {
    const validNodeData = {
      bimbaCoordinate: '#test-integ-child',
      parentCoordinate: '#test-integ-parent',
      relationshipType: 'INTEGRATION_TEST_REL',
      nodeName: 'Integration Test Node',
      qlPosition: 1,
      additionalProperties: { source: 'integration-test' },
    };

    test('should create a node and return 201 with node data on valid request', async () => {
      const mockCreatedNode = {
        id: 'mock-neo4j-id-123',
        bimbaCoordinate: validNodeData.bimbaCoordinate,
        name: validNodeData.nodeName,
        qlPosition: validNodeData.qlPosition,
        ...validNodeData.additionalProperties,
        parentCoordinate: validNodeData.parentCoordinate,
        relationshipType: validNodeData.relationshipType,
        // ... other properties added by the service/db like createdAt
      };
      
      // Mock the service method to simulate successful creation
      mockServiceInstance.createNodeInBimbaGraph.mockResolvedValueOnce([
        // Simulate the Neo4j record structure that the controller expects
        {
          get: (key) => ({
            createdNode: { properties: { 
                bimbaCoordinate: validNodeData.bimbaCoordinate, 
                name: validNodeData.nodeName, 
                qlPosition: validNodeData.qlPosition,
                ...validNodeData.additionalProperties 
            } },
            nodeId: { toString: () => 'mock-neo4j-id-123' }, // Simulate Neo4j Integer object
            parentBimbaCoordinate: validNodeData.parentCoordinate,
            relationshipTypeCreated: validNodeData.relationshipType,
          }[key]),
        },
      ]);

      const response = await request(app)
        .post('/api/graph/create-node') // Adjust if your app is not mounted at root
        .send(validNodeData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.message).toBe('Node created successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe('mock-neo4j-id-123');
      expect(response.body.data.bimbaCoordinate).toBe(validNodeData.bimbaCoordinate);
      expect(response.body.data.name).toBe(validNodeData.nodeName);
      expect(response.body.data.qlPosition).toBe(validNodeData.qlPosition);
      expect(response.body.data.source).toBe(validNodeData.additionalProperties.source);
      expect(response.body.data.parentCoordinate).toBe(validNodeData.parentCoordinate);
      expect(response.body.data.relationshipType).toBe(validNodeData.relationshipType);

      expect(mockServiceInstance.createNodeInBimbaGraph).toHaveBeenCalledWith(validNodeData);
    });

    test('should return 400 if required fields are missing', async () => {
      const incompleteData = {
        // parentCoordinate is missing
        bimbaCoordinate: '#missing-parent',
        relationshipType: 'MISSING_FIELD_REL',
        nodeName: 'Missing Field Node',
      };
      const response = await request(app)
        .post('/api/graph/create-node')
        .send(incompleteData)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body.error).toContain('Missing required fields');
      expect(mockServiceInstance.createNodeInBimbaGraph).not.toHaveBeenCalled();
    });
    
    test('should return 400 if bimbaCoordinate is same as parentCoordinate', async () => {
        const sameCoordData = { ...validNodeData, parentCoordinate: validNodeData.bimbaCoordinate };
        const response = await request(app)
          .post('/api/graph/create-node')
          .send(sameCoordData)
          .expect('Content-Type', /json/)
          .expect(400);
        
        expect(response.body.error).toBe('Node coordinate cannot be the same as its parent coordinate.');
        expect(mockServiceInstance.createNodeInBimbaGraph).not.toHaveBeenCalled();
      });

    test('should return 404 if parent node does not exist', async () => {
      // Mock the service to simulate parent not found (returns empty array or throws specific error)
      mockServiceInstance.createNodeInBimbaGraph.mockResolvedValueOnce([]); // Simulate empty result for parent not found

      const response = await request(app)
        .post('/api/graph/create-node')
        .send({ ...validNodeData, parentCoordinate: '#non-existent-parent' })
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body.error).toContain('Node creation failed. Parent node with coordinate #non-existent-parent may not exist.');
      expect(mockServiceInstance.createNodeInBimbaGraph).toHaveBeenCalledWith(
        expect.objectContaining({ parentCoordinate: '#non-existent-parent' })
      );
    });

    test('should return 409 if node with coordinate already exists', async () => {
      // Mock the service to simulate a conflict (e.g., unique constraint violation)
      const conflictError = new Error('Node with coordinate #already-exists already exists.');
      // You might need to simulate a Neo4j-specific error structure if your controller checks for `error.neo4jError.code`
      // For instance: conflictError.neo4jError = { code: 'Neo.ClientError.Schema.ConstraintValidationFailed' };
      mockServiceInstance.createNodeInBimbaGraph.mockRejectedValueOnce(conflictError);

      const response = await request(app)
        .post('/api/graph/create-node')
        .send({ ...validNodeData, bimbaCoordinate: '#already-exists' })
        .expect('Content-Type', /json/)
        .expect(409); // Assuming the controller maps this error to 409
      
      expect(response.body.error).toContain('Node with coordinate #already-exists already exists.');
    });
    
    test('should handle qlPosition correctly (e.g. when null or missing)', async () => {
        const nodeDataNoQl = {
            ...validNodeData,
            bimbaCoordinate: '#no-ql-node',
            qlPosition: undefined, // Explicitly undefined
          };
        
        // Mock a successful response structure
        mockServiceInstance.createNodeInBimbaGraph.mockResolvedValueOnce([
            { get: (key) => ({
                createdNode: { properties: { ...nodeDataNoQl, qlPosition: null } }, // Backend sets it to null
                nodeId: { toString: () => 'mock-id-no-ql' },
                parentBimbaCoordinate: nodeDataNoQl.parentCoordinate,
                relationshipTypeCreated: nodeDataNoQl.relationshipType,
              }[key]),
            },
        ]);
        
        const response = await request(app)
            .post('/api/graph/create-node')
            .send(nodeDataNoQl)
            .expect(201);

        expect(response.body.data.qlPosition).toBeNull();
        expect(mockServiceInstance.createNodeInBimbaGraph).toHaveBeenCalledWith(
            expect.objectContaining({ qlPosition: null }) // Controller should pass null
        );
    });

    test('should process additionalProperties correctly', async () => {
        const nodeDataWithExtraProps = {
            ...validNodeData,
            bimbaCoordinate: '#extra-props-node',
            additionalProperties: { custom1: 'value1', custom2: 123, uiSource: "EPII_CREATE_NODE_MODAL" },
          };
        
        mockServiceInstance.createNodeInBimbaGraph.mockResolvedValueOnce([
            { get: (key) => ({
                createdNode: { properties: { ...nodeDataWithExtraProps, ...nodeDataWithExtraProps.additionalProperties, qlPosition: validNodeData.qlPosition } },
                nodeId: { toString: () => 'mock-id-extra-props' },
                parentBimbaCoordinate: nodeDataWithExtraProps.parentCoordinate,
                relationshipTypeCreated: nodeDataWithExtraProps.relationshipType,
              }[key]),
            },
        ]);

        const response = await request(app)
            .post('/api/graph/create-node')
            .send(nodeDataWithExtraProps)
            .expect(201);

        expect(response.body.data.custom1).toBe('value1');
        expect(response.body.data.custom2).toBe(123);
        expect(response.body.data.uiSource).toBe("EPII_CREATE_NODE_MODAL");
        expect(mockServiceInstance.createNodeInBimbaGraph).toHaveBeenCalledWith(
            expect.objectContaining({ 
                additionalProperties: { custom1: 'value1', custom2: 123, uiSource: "EPII_CREATE_NODE_MODAL" }
            })
        );
    });

    // TODO: Add a test that bypasses service mocking to hit a real test database if feasible and desired.
    // This would require careful setup and teardown of test data.
    // Example:
    // if (process.env.RUN_REAL_DB_INTEGRATION_TESTS) {
    //   test.skip('should actually create a node in the test database', async () => {
    //     // Unmock the service for this specific test or use a different setup
    //     // Ensure your app connects to a dedicated TEST Neo4j instance
    //     // Perform the request
    //     // Query the DB to verify node creation
    //     // Cleanup: delete the created node
    //   });
    // }
  });

  describe('GET /api/graph/relationship-suggestions', () => {
    const validParentCoordinate = '#valid-parent-for-suggestions';

    test('should return relationship suggestions for a valid parentCoordinate', async () => {
      const mockSuggestions = ['HAS_COMPONENT', 'RELATES_TO', 'IS_CHILD_OF'];
      mockServiceInstance.getHarmoniousRelationships.mockResolvedValueOnce(mockSuggestions);

      const response = await request(app)
        .get(`/api/graph/relationship-suggestions?parentCoordinate=${encodeURIComponent(validParentCoordinate)}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toEqual(mockSuggestions);
      expect(mockServiceInstance.getHarmoniousRelationships).toHaveBeenCalledWith(validParentCoordinate);
    });

    test('should return 400 if parentCoordinate is missing', async () => {
      const response = await request(app)
        .get('/api/graph/relationship-suggestions') // No query param
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Missing required query parameter: parentCoordinate.');
      expect(mockServiceInstance.getHarmoniousRelationships).not.toHaveBeenCalled();
    });

    test('should return an empty array if no suggestions are found', async () => {
      mockServiceInstance.getHarmoniousRelationships.mockResolvedValueOnce([]);

      const response = await request(app)
        .get(`/api/graph/relationship-suggestions?parentCoordinate=${encodeURIComponent('#parent-no-suggestions')}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('should handle service errors gracefully', async () => {
      const errorMessage = 'Service failure while fetching suggestions';
      mockServiceInstance.getHarmoniousRelationships.mockRejectedValueOnce(new Error(errorMessage));

      const response = await request(app)
        .get(`/api/graph/relationship-suggestions?parentCoordinate=${encodeURIComponent(validParentCoordinate)}`)
        .expect('Content-Type', /json/)
        .expect(500);
      
      expect(response.body.error).toBe('Server error while fetching relationship suggestions.');
      expect(response.body.details).toBe(errorMessage);
    });
  });
});
