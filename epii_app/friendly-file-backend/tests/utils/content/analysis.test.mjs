// Mock necessary modules and services
const mockLlmService = {
  generateContent: vi.fn(),
};

const mockGenerateContextWindow = vi.fn();

// Mock the module containing generateContextWindow if it's different from analysis.mjs itself
// Assuming generateContextWindow is also in utils/content/context.mjs as per previous analysis
vi.mock('../../../../utils/content/context.mjs', () => ({
  generateContextWindow: mockGenerateContextWindow,
  formatRelevantCoordinates: vi.fn().mockReturnValue("Formatted Relevant Coordinates"), // Assuming this is also in context.mjs
}));


// Import the function to test
import { analyzeChunkGroup } from '../../../utils/content/analysis.mjs'; // Adjust path as per actual structure

describe('analyzeChunkGroup', () => {
  let mockSourceMetadata;
  let mockBimbaContext;
  let mockUserContext;
  let mockMetalogikon;
  let mockFullBimbaMap;
  let mockState;

  beforeEach(() => {
    vi.resetAllMocks();

    mockSourceMetadata = {
      targetCoordinate: '#TARGET_COORD',
      documentContent: 'Full document content here.',
    };
    mockBimbaContext = [{ node: { name: 'Test Node', description: 'Test Description' } }];
    mockUserContext = {
      projectContext: { projectDescription: 'Test Project Description' },
    };
    mockMetalogikon = {
      lenses: [{ name: 'Lens 1', coordinate: '#LENS1', description: 'Lens 1 Desc', category: 'CategoryA' }],
      rootNode: { name: 'MEF Root', description: 'MEF Root Desc' }
    };
    mockFullBimbaMap = { nodes: [], edges: [] };
    mockState = { documentContent: 'Full document content from state.' };

    mockGenerateContextWindow.mockImplementation(async (chunk, docContent, bimbaCtx, fbm, usrCtx, summary, opts) => {
        return {
            contextText: `Context for: ${chunk.substring(0,10)}... Options: ${JSON.stringify(opts)}`,
            bimbaContext: { directlyRelevantNodes: [] }
        };
    });
  });

  describe('analyzeAsSingleUnit: true', () => {
    it('should analyze concatenated content as a single unit and return a single analysis object', async () => {
      const concatenatedContent = "Chunk 1 content.\n\n---\n\nChunk 2 content.";
      const mockChunks = ["Chunk 1 content.", "Chunk 2 content."];
      const mockContextWindows = [
        { contextText: 'Context for Original Chunk 1 (part of this batch):\nDetails C1.', bimbaContext: { directlyRelevantNodes: [{name: "NodeC1"}] } },
        { contextText: 'Context for Original Chunk 2 (part of this batch):\nDetails C2.', bimbaContext: { directlyRelevantNodes: [{name: "NodeC2"}] } },
      ];
      // 1.b Rich JSON Output Test: Mock LLM to return the new rich structure
      const mockRichAnalysisResult = {
        assignedCoordinates: [mockSourceMetadata.targetCoordinate],
        overallSummary: "Overall summary for the batch.",
        mainThemes: ["Theme A", "Theme B"],
        analysis: "Detailed analysis of the concatenated content.",
        extractedMappings: [{ mappingType: 'BatchMapping', mappingValue: 'Value1' }],
        identifiedVariations: [{ variationType: 'BatchVar', variationText: 'Text1' }],
        naturalElaborations: [{ elaborationType: 'BatchElab', elaborationText: 'Text1', targetCoordinate: '#T1', confidenceScore: 0.9 }],
        deepElaboration: [{ point: 'BatchDeep1', evidence: 'Evidence1', significance: 'Sig1' }],
        novelContributions: [{ contribution: 'BatchNovel1', explanation: 'Expl1' }],
        qlDynamics: [{ operator: 'BatchQL1', type: 'structural', explanation: 'Expl1' }],
        extractedTags: ["Tag1", "Tag2"],
        mefLensInsights: { "#LENS1": "Insight via lens 1 for batch" },
        subnodeMappings: {},
        concatenatedContentLength: concatenatedContent.length,
      };
      mockLlmService.generateContent.mockResolvedValueOnce(JSON.stringify(mockRichAnalysisResult));

      const options = {
        llmService: mockLlmService,
        fullBimbaMap: mockFullBimbaMap,
        contextWindows: mockContextWindows,
        useProvidedContextWindows: true,
        concatenatedContent: concatenatedContent,
        analyzeAsSingleUnit: true,
        documentContent: mockSourceMetadata.documentContent,
      };

      const result = await analyzeChunkGroup(
        mockChunks, mockSourceMetadata, mockBimbaContext, mockUserContext,
        [mockSourceMetadata.targetCoordinate], mockMetalogikon, options, mockState
      );

      // 1.b Rich JSON Output Test: Verify parsing of rich JSON
      expect(result).toEqual(mockRichAnalysisResult);
      expect(mockLlmService.generateContent).toHaveBeenCalledTimes(1);
      
      const [callArgs] = mockLlmService.generateContent.mock.calls;
      const systemPrompt = callArgs[1];
      const userPrompt = callArgs[2];

      // 1.a Context Aggregation Test: Verify prompt includes aggregated context
      expect(systemPrompt).toContain('CONTEXT INFORMATION:');
      expect(systemPrompt).toContain('Aggregated Context from Batch Chunks');
      expect(systemPrompt).toContain('Context for Original Chunk 1 (part of this batch):\nDetails C1.');
      expect(systemPrompt).toContain('Context for Original Chunk 2 (part of this batch):\nDetails C2.');
      
      expect(systemPrompt).toContain('analyze the provided block of text');
      expect(systemPrompt).toContain('Format your response as a single, structured JSON object');
      expect(userPrompt).toContain('TEXT BLOCK TO ANALYZE:');
      expect(userPrompt).toContain(concatenatedContent);
      expect(userPrompt).toContain('"overallSummary": "string (concise summary of the entire text block)"'); // Check for new rich fields in prompt
      expect(userPrompt).toContain('"mainThemes": ["string (list of main themes or topics)"]');
      expect(userPrompt).toContain('"extractedTags": ["string (list of relevant tags or keywords for the block)"]');
    });

    it('should use fallback context generation if no contextWindows provided for single unit', async () => {
        const concatenatedContent = "Single chunk content for context test.";
        const mockChunks = [concatenatedContent]; 
        const mockRichAnalysisResult = { 
            analysis: 'Fallback context test', 
            // include other fields from the rich structure with default/empty values
            assignedCoordinates: [mockSourceMetadata.targetCoordinate],
            overallSummary: "Summary for fallback", mainThemes: [], extractedMappings: [], 
            identifiedVariations: [], naturalElaborations: [], deepElaboration: [], 
            novelContributions: [], qlDynamics: [], extractedTags: [], mefLensInsights: {}, subnodeMappings: {}
        };
        mockLlmService.generateContent.mockResolvedValueOnce(JSON.stringify(mockRichAnalysisResult));
  
        mockGenerateContextWindow.mockResolvedValueOnce({ // This is the fallback generation for chunks[0]
            contextText: `Generated context for: ${concatenatedContent.substring(0,10)}... Options: ${JSON.stringify({forAnalysis: true})}`,
            bimbaContext: { directlyRelevantNodes: [] }
        });

        const options = {
          llmService: mockLlmService,
          fullBimbaMap: mockFullBimbaMap,
          contextWindows: [], // No context windows provided
          useProvidedContextWindows: false, // Allow generation
          concatenatedContent: concatenatedContent,
          analyzeAsSingleUnit: true,
          documentContent: mockSourceMetadata.documentContent,
        };
  
        await analyzeChunkGroup(
          mockChunks,
          mockSourceMetadata,
          mockBimbaContext,
          mockUserContext,
          [mockSourceMetadata.targetCoordinate],
          mockMetalogikon,
          options,
          mockState
        );
        
        // Check if generateContextWindow was called because contextWindows was empty
        expect(mockGenerateContextWindow).toHaveBeenCalled();
        const [callArgs] = mockLlmService.generateContent.mock.calls;
        const systemPrompt = callArgs[1];
        expect(systemPrompt).toContain(`Generated context for: ${concatenatedContent.substring(0,10)}`);
    });
  });

  describe('analyzeAsSingleUnit: false (existing behavior)', () => {
    it('should analyze a group of chunks and return an array of analysis objects', async () => {
      const chunks = ["Chunk 1 text.", "Chunk 2 text."];
      const assignedCoordinates = [["#C1"], ["#C2"]];
      const mockContextWindows = [
        { contextText: 'Context for C1', bimbaContext: { directlyRelevantNodes: [] } },
        { contextText: 'Context for C2', bimbaContext: { directlyRelevantNodes: [] } },
      ];

      const llmResponseArray = [
        { chunkIndex: 0, analysis: 'Analysis for C1', extractedMappings: [], identifiedVariations: [], naturalElaborations: [], assignedCoordinates: ["#C1"] },
        { chunkIndex: 1, analysis: 'Analysis for C2', extractedMappings: [], identifiedVariations: [], naturalElaborations: [], assignedCoordinates: ["#C2"] },
      ];
      mockLlmService.generateContent.mockResolvedValueOnce(JSON.stringify(llmResponseArray));

      const options = {
        llmService: mockLlmService,
        fullBimbaMap: mockFullBimbaMap,
        contextWindows: mockContextWindows,
        useProvidedContextWindows: true,
        analyzeAsSingleUnit: false,
        documentContent: mockSourceMetadata.documentContent,
      };

      const results = await analyzeChunkGroup(
        chunks,
        mockSourceMetadata,
        mockBimbaContext,
        mockUserContext,
        assignedCoordinates,
        mockMetalogikon,
        options,
        mockState
      );

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(2);
      expect(results[0]).toHaveProperty('analysis', 'Analysis for C1');
      expect(results[1]).toHaveProperty('analysis', 'Analysis for C2');
      expect(mockLlmService.generateContent).toHaveBeenCalledTimes(1);
      
      const [callArgs] = mockLlmService.generateContent.mock.calls;
      const systemPrompt = callArgs[1];
      const userPrompt = callArgs[2];

      expect(systemPrompt).toContain('analyze a group of related text chunks');
      expect(systemPrompt).toContain('Format your response as a structured JSON array with one entry per chunk');
      expect(userPrompt).toContain('CHUNK GROUP TO ANALYZE:');
      expect(userPrompt).toContain('CHUNK 1:');
      expect(userPrompt).toContain(chunks[0]);
      expect(userPrompt).toContain('CHUNK 2:');
      expect(userPrompt).toContain(chunks[1]);
      expect(userPrompt).toContain('Context for C1');
      expect(userPrompt).toContain('Context for C2');
      expect(userPrompt).toContain('"chunkIndex": 0'); // Expect array format example
    });

    it('should regenerate context windows if useProvidedContextWindows is false and existing ones are insufficient', async () => {
        const chunks = ["Chunk for regen."];
        const assignedCoordinates = [["#CR"]];
        // Insufficient context window (e.g., missing bimbaContext.directlyRelevantNodes)
        const mockContextWindows = [{ contextText: 'Initial context for CR' }]; 
        
        mockLlmService.generateContent.mockResolvedValueOnce(JSON.stringify([
          { chunkIndex: 0, analysis: 'Analysis for CR regen', extractedMappings: [], identifiedVariations: [], naturalElaborations: [], assignedCoordinates: ["#CR"] }
        ]));
  
        // mockGenerateContextWindow is already set up in beforeEach
        // It will be called by the logic within analyzeChunkGroup
        mockGenerateContextWindow.mockResolvedValueOnce({ // specific mock for this test's call
            contextText: `Regenerated context for: ${chunks[0].substring(0,10)}... Options: ${JSON.stringify({forAnalysis: true})}`,
            bimbaContext: { directlyRelevantNodes: [{name: "Test Relevant Node"}] } // Ensure it's "sufficient"
        });

        const options = {
          llmService: mockLlmService,
          fullBimbaMap: mockFullBimbaMap,
          contextWindows: mockContextWindows,
          useProvidedContextWindows: false, // This will trigger regeneration logic
          analyzeAsSingleUnit: false,
          documentContent: mockSourceMetadata.documentContent,
        };
  
        await analyzeChunkGroup(
          chunks,
          mockSourceMetadata,
          mockBimbaContext,
          mockUserContext,
          assignedCoordinates,
          mockMetalogikon,
          options,
          mockState
        );
        
        expect(mockGenerateContextWindow).toHaveBeenCalledTimes(1); // Was called to regenerate
        const [llmCallArgs] = mockLlmService.generateContent.mock.calls;
        const userPrompt = llmCallArgs[2];
        expect(userPrompt).toContain(`Regenerated context for: ${chunks[0].substring(0,10)}`);
    });
  });
});

// Helper to define vi if not globally available (e.g. when running in a non-Vitest/Jest env for planning)
if (typeof vi === 'undefined') {
  global.vi = {
    fn: () => {
      const mockFn = (...args) => mockFn.mock.results.find(res => res.type === 'return')?.value;
      mockFn.mockResolvedValueOnce = (val) => {
        mockFn.mock.results = mockFn.mock.results || [];
        mockFn.mock.results.push({ type: 'return', value: Promise.resolve(val) });
        return mockFn;
      };
      mockFn.mockImplementation = (implementation) => {
        // A very simplified mock implementation
        const mock = (...args) => implementation(...args);
        mock.mock = { calls: [], results: [] }; // Simplified
        return mock;
      };
      mockFn.mock = { calls: [], results: [] };
      return mockFn;
    },
    mock: (moduleName, factory) => {},
    resetAllMocks: () => {},
    // Add other vi utilities if needed
  };
}
