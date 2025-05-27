// Import the BPMCPService class
// Assuming BPMCPService is the default export from '../services/bpMCPService.mjs'
// If it's a named export, adjust the import accordingly.
import BPMCPService from './bpMCPService.mjs'; // Adjust path as necessary

describe('BPMCPService - createNodeInBimbaGraph', () => {
  let service;
  let mockQueryBimbaGraph;

  beforeEach(() => {
    // Create a new instance of the service for each test
    service = new BPMCPService();
    
    // Mock the queryBimbaGraph method for this instance
    // This is crucial to prevent actual database calls during unit tests.
    mockQueryBimbaGraph = jest.fn();
    service.queryBimbaGraph = mockQueryBimbaGraph;

    // Mock the log method if it's used internally and not critical for the test
    // service.log = jest.fn(); // If your service class has a `this.log` method
    // If log is not on the instance, but a module, you might need to mock that module.
    // For simplicity, we'll assume console.log/error/info are used if this.log is not present.
    // Or, if `this.log` is essential, ensure it's properly mocked or part of the service.
    // The provided service code does not show a `this.log` method, so we'll rely on console spies if needed
    // or assume its absence for unit testing the query construction logic.
    // For the provided service code, it seems to have `this.log` within `createNodeInBimbaGraph`
    // So, it's better to mock it.
    service.log = jest.fn(); 
  });

  test('should throw an error if required parameters are missing', async () => {
    const testCases = [
      { parentCoordinate: '#p', relationshipType: 'REL', nodeName: 'Name' }, // Missing bimbaCoordinate
      { bimbaCoordinate: '#c', relationshipType: 'REL', nodeName: 'Name' }, // Missing parentCoordinate
      { bimbaCoordinate: '#c', parentCoordinate: '#p', nodeName: 'Name' },   // Missing relationshipType
      { bimbaCoordinate: '#c', parentCoordinate: '#p', relationshipType: 'REL' }, // Missing nodeName
    ];

    for (const params of testCases) {
      // Using a try-catch or expect(...).toThrow() for async functions
      await expect(service.createNodeInBimbaGraph(params)).rejects.toThrow(
        /Missing required parameters/
      );
    }
    expect(mockQueryBimbaGraph).not.toHaveBeenCalled();
  });

  test('should construct correct Cypher query and params with qlPosition', async () => {
    const params = {
      bimbaCoordinate: '#test-child',
      parentCoordinate: '#test-parent',
      relationshipType: 'HAS_CHILD',
      nodeName: 'Test Child Node',
      qlPosition: 7,
      additionalProperties: { customField: 'customValue' },
    };
    
    mockQueryBimbaGraph.mockResolvedValue([{ get: () => ({ properties: {} }) }]); // Mock a successful DB response

    await service.createNodeInBimbaGraph(params);

    expect(mockQueryBimbaGraph).toHaveBeenCalledTimes(1);
    const [query, queryParams] = mockQueryBimbaGraph.mock.calls[0];

    // Check the Cypher query string (can be a substring match or more precise regex)
    expect(query).toContain('MATCH (p:BimbaNode {bimbaCoordinate: $parentCoordinate})');
    expect(query).toContain('CREATE (n:BimbaNode)');
    expect(query).toContain('SET n = $nodeProperties');
    expect(query).toContain(`CREATE (p)-[rel:${params.relationshipType}]->(n)`);
    expect(query).toContain('RETURN n AS createdNode');

    // Check the parameters passed to the query
    expect(queryParams.parentCoordinate).toBe(params.parentCoordinate);
    expect(queryParams.nodeProperties.bimbaCoordinate).toBe(params.bimbaCoordinate);
    expect(queryParams.nodeProperties.name).toBe(params.nodeName);
    expect(queryParams.nodeProperties.qlPosition).toBe(params.qlPosition);
    expect(queryParams.nodeProperties.customField).toBe(params.additionalProperties.customField);
    expect(queryParams.nodeProperties.createdBy).toBe('EPII_UI_NODE_CREATION_SYSTEM');
    expect(queryParams.nodeProperties.createdAt).toBeDefined();
    expect(queryParams.nodeProperties.updatedAt).toBeDefined();
  });

  test('should construct correct Cypher query and params without qlPosition (should be null)', async () => {
    const params = {
      bimbaCoordinate: '#another-child',
      parentCoordinate: '#another-parent',
      relationshipType: 'IS_PART_OF',
      nodeName: 'Another Child Node',
      // qlPosition is omitted, should default to null in service logic
      additionalProperties: { anotherCustom: true },
    };

    mockQueryBimbaGraph.mockResolvedValue([{ get: () => ({ properties: {} }) }]);

    await service.createNodeInBimbaGraph(params);

    expect(mockQueryBimbaGraph).toHaveBeenCalledTimes(1);
    const [, queryParams] = mockQueryBimbaGraph.mock.calls[0];

    expect(queryParams.parentCoordinate).toBe(params.parentCoordinate);
    expect(queryParams.nodeProperties.bimbaCoordinate).toBe(params.bimbaCoordinate);
    expect(queryParams.nodeProperties.name).toBe(params.nodeName);
    expect(queryParams.nodeProperties.qlPosition).toBeNull(); // Check for explicit null
    expect(queryParams.nodeProperties.anotherCustom).toBe(params.additionalProperties.anotherCustom);
  });
  
  test('should construct correct Cypher query and params when qlPosition is explicitly null', async () => {
    const params = {
      bimbaCoordinate: '#child-null-ql',
      parentCoordinate: '#parent-null-ql',
      relationshipType: 'HAS_PROPERTY',
      nodeName: 'Child Null QL',
      qlPosition: null, 
      additionalProperties: { someFlag: false },
    };

    mockQueryBimbaGraph.mockResolvedValue([{ get: () => ({ properties: {} }) }]);
    await service.createNodeInBimbaGraph(params);
    const [, queryParams] = mockQueryBimbaGraph.mock.calls[0];

    expect(queryParams.nodeProperties.qlPosition).toBeNull();
    expect(queryParams.nodeProperties.someFlag).toBe(false);
  });

  test('should correctly merge additionalProperties, with explicit params taking precedence', async () => {
    const params = {
      bimbaCoordinate: '#child-override',
      parentCoordinate: '#parent-override',
      relationshipType: 'LINKS_TO',
      nodeName: 'Child Override', // Explicit nodeName
      qlPosition: 100,         // Explicit qlPosition
      additionalProperties: {
        name: 'Name From Additional Props (should be overridden)',
        qlPosition: 200,       // qlPosition from additional (should be overridden)
        extraDetail: 'This should be kept'
      },
    };
    mockQueryBimbaGraph.mockResolvedValue([{ get: () => ({ properties: {} }) }]);
    await service.createNodeInBimbaGraph(params);
    const [, queryParams] = mockQueryBimbaGraph.mock.calls[0];

    expect(queryParams.nodeProperties.name).toBe('Child Override');
    expect(queryParams.nodeProperties.qlPosition).toBe(100);
    expect(queryParams.nodeProperties.extraDetail).toBe('This should be kept');
  });

  test('should return the result from queryBimbaGraph on success', async () => {
    const mockDbResult = [{ 
        get: (key) => ({
            'createdNode': { properties: { name: 'Test Node' } },
            'nodeId': { low: 1, high: 0 }, // Neo4j Integer representation
            'parentBimbaCoordinate': '#test-parent',
            'relationshipTypeCreated': 'HAS_CHILD'
        }[key])
    }];
    mockQueryBimbaGraph.mockResolvedValue(mockDbResult);

    const params = {
      bimbaCoordinate: '#test-child',
      parentCoordinate: '#test-parent',
      relationshipType: 'HAS_CHILD',
      nodeName: 'Test Child Node',
    };

    const result = await service.createNodeInBimbaGraph(params);
    expect(result).toBe(mockDbResult);
  });

  test('should re-throw errors from queryBimbaGraph', async () => {
    const dbError = new Error('Database connection failed');
    mockQueryBimbaGraph.mockRejectedValue(dbError);

    const params = {
      bimbaCoordinate: '#error-case',
      parentCoordinate: '#error-parent',
      relationshipType: 'CAUSES_ERROR',
      nodeName: 'Error Node',
    };

    await expect(service.createNodeInBimbaGraph(params)).rejects.toThrow(dbError);
  });

  // Tests for getHarmoniousRelationships
  describe('BPMCPService - getHarmoniousRelationships', () => {
    test('should throw error if parentCoordinate is missing', async () => {
      await expect(service.getHarmoniousRelationships(undefined)).rejects.toThrow(
        'parentCoordinate is required for getHarmoniousRelationships.'
      );
      await expect(service.getHarmoniousRelationships(null)).rejects.toThrow(
        'parentCoordinate is required for getHarmoniousRelationships.'
      );
      await expect(service.getHarmoniousRelationships('')).rejects.toThrow(
        'parentCoordinate is required for getHarmoniousRelationships.'
      );
    });

    test('should construct correct Cypher query for harmonious relationships', async () => {
      const parentCoordinate = '#some-parent';
      mockQueryBimbaGraph.mockResolvedValue([]); // Return empty array for this test

      await service.getHarmoniousRelationships(parentCoordinate);

      expect(mockQueryBimbaGraph).toHaveBeenCalledTimes(1);
      const [query, queryParams] = mockQueryBimbaGraph.mock.calls[0];

      expect(query).toContain('MATCH (p:BimbaNode {bimbaCoordinate: $parentCoordinate})-[r]->()');
      expect(query).toContain('WITH type(r) AS relationshipType, count(type(r)) AS frequency');
      expect(query).toContain('ORDER BY frequency DESC');
      expect(query).toContain('LIMIT 10');
      expect(query).toContain('RETURN relationshipType');
      expect(queryParams.parentCoordinate).toBe(parentCoordinate);
    });

    test('should process and return relationship types from queryBimbaGraph result', async () => {
      const parentCoordinate = '#parent-with-rels';
      const mockDbResult = [
        { get: (key) => (key === 'relationshipType' ? 'HAS_CHILD' : null) },
        { get: (key) => (key === 'relationshipType' ? 'RELATES_TO' : null) },
        { get: (key) => (key === 'relationshipType' ? 'HAS_PROPERTY' : null) },
      ];
      mockQueryBimbaGraph.mockResolvedValue(mockDbResult);

      const result = await service.getHarmoniousRelationships(parentCoordinate);

      expect(result).toEqual(['HAS_CHILD', 'RELATES_TO', 'HAS_PROPERTY']);
    });

    test('should return empty array if queryBimbaGraph returns empty or no results', async () => {
      const parentCoordinate = '#parent-no-rels';
      mockQueryBimbaGraph.mockResolvedValue([]);
      let result = await service.getHarmoniousRelationships(parentCoordinate);
      expect(result).toEqual([]);

      mockQueryBimbaGraph.mockResolvedValue(null); // Test for null/undefined response
      result = await service.getHarmoniousRelationships(parentCoordinate);
      expect(result).toEqual([]);
    });

    test('should handle records with non-standard structure gracefully', async () => {
        const parentCoordinate = '#parent-mixed-rels';
        const mockDbResult = [
          { get: (key) => (key === 'relationshipType' ? 'TYPE_A' : null) },
          { relationshipType: 'TYPE_B' }, // Simplified structure
          { get: () => null }, // Record that doesn't have .get('relationshipType')
          {}, // Empty record
        ];
        mockQueryBimbaGraph.mockResolvedValue(mockDbResult);
  
        const result = await service.getHarmoniousRelationships(parentCoordinate);
        expect(result).toEqual(['TYPE_A', 'TYPE_B']); // Should filter out nulls
      });

    test('should re-throw errors from queryBimbaGraph during harmonious relationship fetching', async () => {
      const parentCoordinate = '#parent-error';
      const dbError = new Error('DB error on relationship fetch');
      mockQueryBimbaGraph.mockRejectedValue(dbError);

      await expect(service.getHarmoniousRelationships(parentCoordinate)).rejects.toThrow(dbError);
    });
  });
});
