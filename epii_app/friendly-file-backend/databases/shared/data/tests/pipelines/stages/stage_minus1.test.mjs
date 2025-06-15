// Mock necessary modules and services
const mockSynthesizeAnalysis = vi.fn();
const mockGenerateCoreElements = vi.fn();
const mockLangsmithTracing = {
  createStageRunTree: vi.fn(() => ({
    create_child: vi.fn(() => ({ end: vi.fn(), patch: vi.fn() })),
    endRunSuccess: vi.fn(),
    endRunError: vi.fn(),
    patch: vi.fn(),
  })),
  createChildRun: vi.fn(() => ({ end: vi.fn(), patch: vi.fn() })), // for synthesizeAnalysis and generateCoreElements
  endRunSuccess: vi.fn(),
  endRunError: vi.fn(),
};

// Mock utilities from synthesis.mjs
vi.mock('../../../utils/content/synthesis.mjs', () => ({
  synthesizeAnalysis: mockSynthesizeAnalysis,
  generateCoreElements: mockGenerateCoreElements,
}));

// Mock other services if directly used by stage_minus1 (e.g., epiiLLMService, though it's usually passed to utils)
vi.mock('../../../services/epii-llm.service.mjs', () => ({
  default: { /* mock LLM methods if any are called directly by stage_minus1 */ },
}));
vi.mock('../../../services/langsmith-tracing.mjs', () => ({
  default: mockLangsmithTracing,
}));
vi.mock('../../../utils/content/processing.mjs', () => ({
    consolidateMappingsEnhanced: vi.fn((mappings) => mappings) // Simple mock, just returns what's passed
}));


// Import the function to test
import { runStageMinus1 } from '../../../pipelines/stages/stage_minus1.mjs';

describe('runStageMinus1', () => {
  let mockStateFromStageMinus2;

  beforeEach(() => {
    vi.resetAllMocks();

    // 3.b Input Data: Simulate new output from stage_minus2.mjs
    mockStateFromStageMinus2 = {
      batchAnalyses: [ // Array of rich objects
        { 
          overallSummary: "Summary for batch 1", 
          mainThemes: ["Theme A", "Theme B"],
          analysis: "Detailed analysis for batch 1.",
          // ... other rich fields from analyzeChunkGroup output ...
        },
        { 
          overallSummary: "Summary for batch 2", 
          mainThemes: ["Theme C"],
          analysis: "Detailed analysis for batch 2.",
          // ... other rich fields ...
        }
      ],
      batchMappings: [ // Array of arrays (mappings per batch)
        [{ type: 'map_b1_1' }, { type: 'map_b1_2' }],
        [{ type: 'map_b2_1' }]
      ],
      batchVariations: [ // Array of arrays (variations per batch)
        [{ type: 'var_b1_1' }],
        [{ type: 'var_b2_1' }, { type: 'var_b2_2' }]
      ],
      batchTags: [ // Array of arrays (tags per batch)
        ['tag_b1_1', 'tag_b1_2'],
        ['tag_b2_1']
      ],
      metalogikon: { rootNode: { name: 'Test Metalogikon' } },
      sourceMetadata: { 
        targetCoordinate: '#TARGET_DOC', 
        sourceFileName: 'doc.txt' 
      },
      documentContent: "Full document content for synthesis context.",
      documentId: 'doc123',
      fileId: 'file456',
      userId: 'user789',
      bpMCPService: { /* mock bpMCPService if needed, though not directly used in stage_minus1 logic */ }
    };

    // 3.c Mock for synthesizeAnalysis and generateCoreElements
    mockSynthesizeAnalysis.mockResolvedValue("Synthesized text incorporating all batch analyses.");
    mockGenerateCoreElements.mockResolvedValue({
      coreElements: [{ elementType: 'TestElement', name: 'Synthesized Element' }],
      relationalProperties: {
        qlOperators: [{ name: 'QL-TEST-1' }],
        epistemicEssence: [],
        archetypalAnchors: [],
        semanticFramework: []
      }
    });
  });

  it('should call synthesizeAnalysis with batchAnalyses and other consolidated data', async () => {
    await runStageMinus1(mockStateFromStageMinus2);

    expect(mockSynthesizeAnalysis).toHaveBeenCalledTimes(1);
    const synthesizeArgs = mockSynthesizeAnalysis.mock.calls[0];
    
    // 3.d.i Verify synthesizeAnalysis call
    expect(synthesizeArgs[0]).toBe(mockStateFromStageMinus2.documentContent);
    expect(synthesizeArgs[1]).toEqual(mockStateFromStageMinus2.batchAnalyses); // Check batchAnalyses is passed
    
    // 3.d.ii Verify allMappings, allVariations, allTags are correctly flattened
    const expectedAllMappings = mockStateFromStageMinus2.batchMappings.flat();
    const expectedAllVariations = mockStateFromStageMinus2.batchVariations.flat();
    const expectedAllTags = [...new Set(mockStateFromStageMinus2.batchTags.flat())]; // Set is used for tags

    expect(synthesizeArgs[2]).toEqual(expect.arrayContaining(expectedAllMappings));
    expect(synthesizeArgs[3]).toEqual(expect.arrayContaining(expectedAllVariations));
    expect(synthesizeArgs[4]).toEqual(expect.arrayContaining(expectedAllTags));
    
    expect(synthesizeArgs[5]).toBe(mockStateFromStageMinus2.metalogikon);
    expect(synthesizeArgs[6]).toBe(mockStateFromStageMinus2.sourceMetadata.targetCoordinate);
    // epiiLLMService (arg 7) is imported within stage_minus1, not passed, so harder to check directly without deeper mocking
    // synthesisRun (arg 8) is a langsmith object
  });

  it('should call generateCoreElements with the output of synthesizeAnalysis', async () => {
    const synthesisResult = "Custom synthesis result for this test.";
    mockSynthesizeAnalysis.mockResolvedValue(synthesisResult);

    await runStageMinus1(mockStateFromStageMinus2);

    expect(mockGenerateCoreElements).toHaveBeenCalledTimes(1);
    const generateCoreElementsArgs = mockGenerateCoreElements.mock.calls[0];

    expect(generateCoreElementsArgs[0]).toBe(synthesisResult); // Check it received the synthesis
    const expectedAllMappings = mockStateFromStageMinus2.batchMappings.flat();
    expect(generateCoreElementsArgs[1]).toEqual(expect.arrayContaining(expectedAllMappings)); // Check allMappings
    // ... similar checks for allVariations, allTags
    expect(generateCoreElementsArgs[4]).toBe(mockStateFromStageMinus2.sourceMetadata.targetCoordinate);
  });

  it('should produce the correct output structure for stage -0', async () => {
    const output = await runStageMinus1(mockStateFromStageMinus2);

    expect(output).toHaveProperty('synthesis', "Synthesized text incorporating all batch analyses.");
    expect(output).toHaveProperty('coreElements', [{ elementType: 'TestElement', name: 'Synthesized Element' }]);
    expect(output.relationalProperties.qlOperators).toEqual([{ name: 'QL-TEST-1' }]);
    expect(output.allMappings).toEqual(mockStateFromStageMinus2.batchMappings.flat());
    expect(output.allVariations).toEqual(mockStateFromStageMinus2.batchVariations.flat());
    expect(output.allTags).toEqual([...new Set(mockStateFromStageMinus2.batchTags.flat())]);
    expect(output).toHaveProperty('actionableSummary'); // Check if it attempts to extract this
    expect(output.documentId).toBe('doc123');
    expect(output.fileId).toBe('file456');
    expect(output.userId).toBe('user789');
    expect(output.sourceMetadata).toBe(mockStateFromStageMinus2.sourceMetadata);
    expect(output.bpMCPService).toBe(mockStateFromStageMinus2.bpMCPService);
  });
  
  it('should handle empty batchAnalyses, batchMappings etc. gracefully', async () => {
    mockStateFromStageMinus2.batchAnalyses = [];
    mockStateFromStageMinus2.batchMappings = [];
    mockStateFromStageMinus2.batchVariations = [];
    mockStateFromStageMinus2.batchTags = [];

    await runStageMinus1(mockStateFromStageMinus2);

    expect(mockSynthesizeAnalysis).toHaveBeenCalledWith(
      mockStateFromStageMinus2.documentContent,
      [], // empty batchAnalyses
      [], // empty allMappings
      [], // empty allVariations
      [], // empty allTags
      mockStateFromStageMinus2.metalogikon,
      mockStateFromStageMinus2.sourceMetadata.targetCoordinate,
      expect.anything(), // llmService
      expect.anything()  // synthesisRun
    );
    // The rest of the flow should also work with empty inputs
    expect(mockGenerateCoreElements).toHaveBeenCalled(); 
  });

});

// Helper to define vi if not globally available
if (typeof vi === 'undefined') {
  global.vi = {
    fn: () => {
      const mockFn = (...args) => mockFn.mock.results.find(res => res.type === 'return')?.value;
      mockFn.mockResolvedValue = (val) => {
        mockFn.mock.results = mockFn.mock.results || [];
        mockFn.mock.results = [{ type: 'return', value: Promise.resolve(val) }]; 
        return mockFn;
      };
      mockFn.mockResolvedValueOnce = (val) => {
        mockFn.mock.results = mockFn.mock.results || [];
        mockFn.mock.results.push({ type: 'return', value: Promise.resolve(val) });
        return mockFn;
      };
      mockFn.mockImplementation = (implementation) => {
        const mock = (...args) => {
            mock.mock.calls.push(args);
            return implementation(...args);
        };
        mock.mock = { calls: [], results: [] };
        mockFn.mockImplementationCustom = implementation;
        return mock;
      };
      const defaultImpl = (...args) => {
        if (mockFn.mockImplementationCustom) return mockFn.mockImplementationCustom(...args);
        const result = mockFn.mock.results.shift();
        if (mockFn.mock.results.length === 0 && mockFn.mock.defaultResult) {
            mockFn.mock.results.push(mockFn.mock.defaultResult);
        }
        if (result) {
            if (result.type === 'return') return result.value;
            if (result.type === 'error') throw result.value;
        }
      };
      mockFn.mock = { calls: [], results: [], defaultResult: undefined };
      const mainMock = (...args) => {
          mainMock.mock.calls.push(args);
          return defaultImpl(...args);
      };
      Object.assign(mainMock, mockFn);
      return mainMock;
    },
    mock: (moduleName, factory) => {},
    resetAllMocks: () => {},
  };
}
