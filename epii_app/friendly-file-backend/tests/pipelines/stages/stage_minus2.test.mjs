// Mock necessary modules and services
const mockAnalyzeChunkGroup = vi.fn();
const mockGetMetalogikonTemplateFromBimbaMap = vi.fn();
const mockGenerateContextWindow = vi.fn(); // Used by stage_minus2 for comprehensiveContextWindows
const mockLangsmithTracing = {
  createStageRunTree: vi.fn(() => ({
    create_child: vi.fn(() => ({ end: vi.fn(), patch: vi.fn() })),
    createToolRun: vi.fn(() => ({ end: vi.fn(), patch: vi.fn() })),
    endRunSuccess: vi.fn(),
    endRunError: vi.fn(),
    patch: vi.fn(),
  })),
  createToolRun: vi.fn(() => ({ end: vi.fn(), patch: vi.fn() })),
  createChildRun: vi.fn(() => ({ end: vi.fn(), patch: vi.fn() })),
  endRunSuccess: vi.fn(),
  endRunError: vi.fn(),
};


vi.mock('../../../utils/content/analysis.mjs', () => ({
  analyzeChunkGroup: mockAnalyzeChunkGroup,
}));

vi.mock('../../../utils/graphData.utils.mjs', () => ({
  getMetalogikonTemplateFromBimbaMap: mockGetMetalogikonTemplateFromBimbaMap,
}));

vi.mock('../../../utils/content/context.mjs', () => ({
  generateContextWindow: mockGenerateContextWindow,
}));

vi.mock('../../../services/epii-llm.service.mjs', () => ({
  default: { generateContent: vi.fn() }, // Mock the default export if it's an object with methods
}));

vi.mock('../../../services/langsmith-tracing.mjs', () => ({
  default: mockLangsmithTracing, // Mock the default export
}));


// Import the function to test
import { runStageMinus2 } from '../../../pipelines/stages/stage_minus2.mjs';

describe('runStageMinus2', () => {
  let mockStateFromStageMinus3;

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock implementations
    mockGetMetalogikonTemplateFromBimbaMap.mockReturnValue({
      lenses: [{ name: 'Test Lens', coordinate: '#L1', description: 'Lens Desc', category: 'TestCat' }],
      rootNode: { name: 'MEF Root Test', description: 'MEF Root Desc Test'}
    });

    mockGenerateContextWindow.mockImplementation(async (chunk, docContent, bimbaCtx, fbm, projCtx, summary, opts) => {
      return {
        contextText: `Comprehensive context for ${chunk.substring(0,10)}...`,
        bimbaContext: { directlyRelevantNodes: [] }
      };
    });
    
    mockAnalyzeChunkGroup.mockImplementation(async (chunks, srcMeta, bimbaCtx, usrCtx, assignedCoords, metalogikon, opts) => {
        // Default mock for analyzeChunkGroup if not overridden by a specific test
        if (opts.analyzeAsSingleUnit) {
            return {
                analysis: `Single analysis for: ${opts.concatenatedContent.substring(0, 20)}...`,
                extractedMappings: [{type: "batch_mapping"}],
                identifiedVariations: [],
                naturalElaborations: [],
                deepElaboration: [],
                novelContributions: [],
                qlDynamics: [],
            };
        }
        // Fallback for old path, though new tests will focus on single unit
        return chunks.map((chunk, index) => ({
            analysis: `Analysis for ${chunk}`,
            chunkIndex: index,
            extractedMappings: [],
            identifiedVariations: [],
            naturalElaborations: [],
            deepElaboration: [],
            novelContributions: [],
            qlDynamics: [],
        }));
    });


    mockStateFromStageMinus3 = {
      documentChunks: ["Chunk 1 processed text.", "Chunk 2 processed text.", "Chunk 3 processed text."], // documentChunks from stage -3 output
      originalChunks: ["Original chunk 1.", "Original chunk 2.", "Original chunk 3."], // originalChunks from stage -3 output
      sourceMetadata: {
        targetCoordinate: '#TARGET',
        sourceFileName: 'test.txt',
        // other metadata...
      },
      coordinateMap: { '#TARGET': 'Test Target Node' },
      fullBimbaMap: { nodes: [{id: 'N1', name: 'Node1'}], edges: [] }, // from stage -4
      documentContent: "Original full document content.", // from stage -4
      bimbaEnhancedContext: "Bimba enhanced context string", // from stage -4
      projectContext: { projectName: "Test Project", projectDescription: "Test project description" }, // from stage -4
      bimbaMapSummary: "Bimba map summary string", // from stage -4
      bimbaContext: [{ node: { name: 'Bimba Node', description: 'Bimba Desc' } }],
      userContext: { userName: "testUser" },
      // ... other properties passed from stage -3
    };
  });

  it('should call analyzeChunkGroup with concatenated content and analyzeAsSingleUnit:true for each batch', async () => {
    // Override default mock for this specific test to check parameters
    mockAnalyzeChunkGroup.mockResolvedValue({
      analysis: 'Test batch analysis',
      extractedMappings: [], identifiedVariations: [], naturalElaborations: [],
      deepElaboration: [], novelContributions: [], qlDynamics: [],
    });

    await runStageMinus2(mockStateFromStageMinus3);

    // Assuming batchSize is 6 as per stage_minus2.mjs, with 3 chunks, there's 1 batch.
    expect(mockAnalyzeChunkGroup).toHaveBeenCalledTimes(1);

    const [chunksArg, metadataArg, bimbaCtxArg, userCtxArg, assignedCoordsArg, metalogikonArg, optionsArg] = mockAnalyzeChunkGroup.mock.calls[0];
    
    // Check the options passed to analyzeChunkGroup
    expect(optionsArg.analyzeAsSingleUnit).toBe(true);
    expect(optionsArg.concatenatedContent).toBe("Original chunk 1.\n\n---\n\nOriginal chunk 2.\n\n---\n\nOriginal chunk 3.");
    expect(optionsArg.llmService).toBeDefined(); // epiiLLMService should be passed
    expect(optionsArg.useProvidedContextWindows).toBe(true);
    expect(optionsArg.contextWindows).toBeInstanceOf(Array);
    expect(optionsArg.contextWindows.length).toBe(mockStateFromStageMinus3.originalChunks.length);

    // Check other args
    expect(chunksArg).toEqual(mockStateFromStageMinus3.originalChunks); // analyzeChunkGroup still receives original chunk texts for the batch
    expect(assignedCoordsArg).toEqual([mockStateFromStageMinus3.sourceMetadata.targetCoordinate]); // For single unit, it's the primary target
  });

  it('should produce stageMinus2Output with batchAnalyses from analyzeChunkGroup results', async () => {
    const batchAnalysisResultFromMock = {
      analysis: 'Successful batch analysis for all chunks.',
      extractedMappings: [{ type: 'batch_map_1' }],
      identifiedVariations: [{ type: 'batch_var_1' }],
      naturalElaborations: [{ type: 'batch_elab_1' }],
      deepElaboration: [{point: "Batch deep point"}],
      novelContributions: [{contribution: "Batch novel contribution"}],
      qlDynamics: [{operator: "Batch QL dynamics"}],
    };
    mockAnalyzeChunkGroup.mockResolvedValue(batchAnalysisResultFromMock);

    const output = await runStageMinus2(mockStateFromStageMinus3);

    expect(output.batchAnalyses).toBeInstanceOf(Array);
    expect(output.batchAnalyses.length).toBe(1); // 1 batch for 3 chunks with batchSize 6
    expect(output.batchAnalyses[0]).toEqual(batchAnalysisResultFromMock);
    expect(output.hasEnhancedBatchAnalysis).toBe(true);

    // Check that per-chunk arrays are handled (they might be empty or structured differently)
    expect(output.chunkMappings).toBeInstanceOf(Array); 
    // Further checks on chunkMappings, etc. would depend on how stage_minus2 is decided to populate them
    // based on the single batch analysis result. The current stage_minus2.mjs code
    // doesn't explicitly populate them from the singleBatchAnalysisResult.
    // It initializes them as empty and they remain so.
    expect(output.chunkMappings.length).toBe(0); // or based on new logic if any
    expect(output.chunkVariations.length).toBe(0);
    expect(output.chunkTags.length).toBe(0);
  });

  it('should handle multiple batches correctly', async () => {
    const manyChunks = Array(8).fill(null).map((_, i) => `Original chunk ${i + 1}.`);
    const manyDocChunks = manyChunks.map(c => `Processed ${c}`);
    
    mockStateFromStageMinus3.originalChunks = manyChunks;
    mockStateFromStageMinus3.documentChunks = manyDocChunks;
    
    // Let mockGenerateContextWindow handle more calls
    mockGenerateContextWindow.mockImplementation(async (chunk) => ({
        contextText: `Ctx for ${chunk.substring(0,10)}`, bimbaContext: { directlyRelevantNodes: [] }
    }));

    const mockResults = [
        { analysis: 'Batch 1 analysis', extractedMappings: [], identifiedVariations: [], naturalElaborations: [], deepElaboration: [], novelContributions: [], qlDynamics: [] },
        { analysis: 'Batch 2 analysis', extractedMappings: [], identifiedVariations: [], naturalElaborations: [], deepElaboration: [], novelContributions: [], qlDynamics: [] }
    ];
    mockAnalyzeChunkGroup
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1]);

    const output = await runStageMinus2(mockStateFromStageMinus3);
    
    // Batch size is 6. 8 chunks = 2 batches (6 in first, 2 in second)
    expect(mockAnalyzeChunkGroup).toHaveBeenCalledTimes(2);
    expect(output.batchAnalyses.length).toBe(2);
    expect(output.batchAnalyses[0]).toEqual(mockResults[0]);
    expect(output.batchAnalyses[1]).toEqual(mockResults[1]);

    // Check concatenation for the first batch
    const firstCallOptions = mockAnalyzeChunkGroup.mock.calls[0][6];
    expect(firstCallOptions.concatenatedContent).toBe(manyChunks.slice(0, 6).join("\n\n---\n\n"));
    
    // Check concatenation for the second batch
    const secondCallOptions = mockAnalyzeChunkGroup.mock.calls[1][6];
    expect(secondCallOptions.concatenatedContent).toBe(manyChunks.slice(6, 8).join("\n\n---\n\n"));
  });
  
  it('should correctly pass comprehensive context windows to analyzeChunkGroup', async () => {
    await runStageMinus2(mockStateFromStageMinus3);
    expect(mockGenerateContextWindow).toHaveBeenCalledTimes(mockStateFromStageMinus3.originalChunks.length);
    
    const [,,, , , , optionsArg] = mockAnalyzeChunkGroup.mock.calls[0];
    expect(optionsArg.contextWindows).toBeInstanceOf(Array);
    expect(optionsArg.contextWindows.length).toBe(mockStateFromStageMinus3.originalChunks.length);
    optionsArg.contextWindows.forEach(cw => {
        expect(cw.contextText).toContain('Comprehensive context for');
    });
  });

  it('should propagate metalogikon, sourceMetadata, and other context to stageMinus2Output', async () => {
    const output = await runStageMinus2(mockStateFromStageMinus3);

    expect(output.metalogikon).toEqual(mockGetMetalogikonTemplateFromBimbaMap());
    expect(output.sourceMetadata).toEqual(mockStateFromStageMinus3.sourceMetadata);
    expect(output.documentId).toEqual(mockStateFromStageMinus3.documentId); // Assuming it's in mockStateFromStageMinus3
    expect(output.fullBimbaMap).toEqual(mockStateFromStageMinus3.fullBimbaMap);
    expect(output.projectContext).toEqual(mockStateFromStageMinus3.projectContext);
    expect(output.documentContent).toEqual(mockStateFromStageMinus3.documentContent);
    expect(output.originalChunks).toEqual(mockStateFromStageMinus3.originalChunks);
  });

  it('should handle errors during analyzeChunkGroup call', async () => {
    const errorMessage = "LLM unavailable";
    mockAnalyzeChunkGroup.mockRejectedValueOnce(new Error(errorMessage));

    await expect(runStageMinus2(mockStateFromStageMinus3))
      .rejects
      .toThrow(`Epii Pipeline Stage -2 failed: Error analyzing batch 1 as a single unit: ${errorMessage}`);
    
    expect(mockLangsmithTracing.endRunError).toHaveBeenCalled();
  });

  it('should handle errors during getMetalogikonTemplateFromBimbaMap call', async () => {
    const errorMessage = "Metalogikon template error";
    mockGetMetalogikonTemplateFromBimbaMap.mockImplementationOnce(() => {
        throw new Error(errorMessage);
    });
    
    await expect(runStageMinus2(mockStateFromStageMinus3))
        .rejects
        .toThrow(`Epii Pipeline Stage -2 failed: Failed to retrieve Metalogikon template: ${errorMessage}`);
    expect(mockLangsmithTracing.endRunError).toHaveBeenCalledTimes(2); // templateRun and stageRun
  });

  it('should handle errors during comprehensive context window generation', async () => {
    const errorMessage = "Context window generation error";
    mockGenerateContextWindow.mockImplementationOnce(async () => {
        throw new Error(errorMessage);
    });

    await expect(runStageMinus2(mockStateFromStageMinus3)))
        .rejects
        .toThrow(`Epii Pipeline Stage -2 failed: Failed to generate comprehensive context windows: ${errorMessage}`);
    expect(mockLangsmithTracing.endRunError).toHaveBeenCalledTimes(2); // contextWindowsRun and stageRun
  });


});

// Helper to define vi if not globally available
if (typeof vi === 'undefined') {
  global.vi = {
    fn: () => {
      const mockFn = (...args) => mockFn.mock.results.find(res => res.type === 'return')?.value;
      mockFn.mockResolvedValue = (val) => { // Changed to non-once for default mock
        mockFn.mock.results = mockFn.mock.results || [];
        // Clear previous persistent mocks if any, or manage results more carefully
        mockFn.mock.results = [{ type: 'return', value: Promise.resolve(val) }]; 
        return mockFn;
      };
      mockFn.mockResolvedValueOnce = (val) => {
        mockFn.mock.results = mockFn.mock.results || [];
        mockFn.mock.results.push({ type: 'return', value: Promise.resolve(val) });
        return mockFn;
      };
      mockFn.mockRejectedValueOnce = (val) => {
        mockFn.mock.results = mockFn.mock.results || [];
        mockFn.mock.results.push({ type: 'error', value: Promise.reject(val) });
        return mockFn;
      };
      mockFn.mockImplementation = (implementation) => {
        const mock = (...args) => {
            mock.mock.calls.push(args); // Actually record calls
            return implementation(...args);
        };
        mock.mock = { calls: [], results: [] };
        // Allow chaining and setting default behavior
        mockFn.mockImplementation = implementation; 
        mockFn.mockImplementationCustom = implementation; // Store the custom one
        return mock;
      };
       // Default implementation for vi.fn()
      const defaultImpl = (...args) => {
        if (mockFn.mockImplementationCustom) {
            return mockFn.mockImplementationCustom(...args);
        }
        const result = mockFn.mock.results.shift(); // Use and remove if 'once'
        if (mockFn.mock.results.length === 0 && mockFn.mock.defaultResult) { // Add default if all 'once' are used
            mockFn.mock.results.push(mockFn.mock.defaultResult);
        }
        if (result) {
            if (result.type === 'return') return result.value;
            if (result.type === 'error') throw result.value;
        }
      };
      mockFn.mock = { calls: [], results: [], defaultResult: undefined };
      // Set the actual function that gets called
      const mainMock = (...args) => {
          mainMock.mock.calls.push(args);
          return defaultImpl(...args);
      };
      // Copy properties from mockFn to mainMock
      Object.assign(mainMock, mockFn);
      return mainMock;
    },
    mock: (moduleName, factory) => {},
    resetAllMocks: () => {},
    // Add other vi utilities if needed
  };
}
