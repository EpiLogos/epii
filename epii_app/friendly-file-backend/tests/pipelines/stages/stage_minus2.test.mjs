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
        // 2.b Mock for analyzeChunkGroup: Updated to return the new rich JSON structure
        if (opts.analyzeAsSingleUnit) {
            return {
                assignedCoordinates: assignedCoords, // Should be [srcMeta.targetCoordinate]
                overallSummary: `Overall summary for batch starting with ${chunks[0].substring(0,10)}`,
                mainThemes: ["Theme Batch"],
                analysis: `Rich analysis for: ${opts.concatenatedContent.substring(0, 30)}...`,
                extractedMappings: [{type: "batch_mapping", value: chunks[0].substring(0,5)}],
                identifiedVariations: [{type: "batch_variation", text: chunks[0].substring(0,5)}],
                naturalElaborations: [{type: "batch_elaboration", text: chunks[0].substring(0,5)}],
                deepElaboration: [{point: "Batch deep"}],
                novelContributions: [{contribution: "Batch novel"}],
                qlDynamics: [{operator: "Batch QL"}],
                extractedTags: [`tag_${chunks[0].substring(0,3)}`],
                mefLensInsights: {},
                subnodeMappings: {},
                concatenatedContentLength: opts.concatenatedContent.length,
            };
        }
        // Fallback for old path (not primary focus of these tests anymore)
        return chunks.map((chunk, index) => ({
            analysis: `Analysis for ${chunk}`, chunkIndex: index, extractedMappings: [], 
            identifiedVariations: [], naturalElaborations: [], deepElaboration: [], 
            novelContributions: [], qlDynamics: [], extractedTags: []
        }));
    });


    mockStateFromStageMinus3 = {
      documentChunks: ["Chunk 1 processed text.", "Chunk 2 processed text.", "Chunk 3 processed text."],
      originalChunks: ["Original chunk 1.", "Original chunk 2.", "Original chunk 3."],
      sourceMetadata: { targetCoordinate: '#TARGET', sourceFileName: 'test.txt' },
      coordinateMap: { '#TARGET': 'Test Target Node' },
      fullBimbaMap: { nodes: [{id: 'N1', name: 'Node1'}], edges: [] },
      documentContent: "Original full document content.",
      bimbaEnhancedContext: "Bimba enhanced context string",
      projectContext: { projectName: "Test Project", projectDescription: "Test project description" },
      bimbaMapSummary: "Bimba map summary string",
      bimbaContext: [{ node: { name: 'Bimba Node', description: 'Bimba Desc' } }],
      userContext: { userName: "testUser" },
    };
  });

  it('should call analyzeChunkGroup with concatenated content and analyzeAsSingleUnit:true for each batch', async () => {
    // Default mockAnalyzeChunkGroup is fine for checking call parameters
    await runStageMinus2(mockStateFromStageMinus3);

    expect(mockAnalyzeChunkGroup).toHaveBeenCalledTimes(1); // For 3 chunks, batch size 6 -> 1 batch

    const [chunksArg, metadataArg, bimbaCtxArg, userCtxArg, assignedCoordsArg, metalogikonArg, optionsArg] = mockAnalyzeChunkGroup.mock.calls[0];
    
    expect(optionsArg.analyzeAsSingleUnit).toBe(true);
    expect(optionsArg.concatenatedContent).toBe("Original chunk 1.\n\n---\n\nOriginal chunk 2.\n\n---\n\nOriginal chunk 3.");
    expect(optionsArg.llmService).toBeDefined();
    expect(optionsArg.useProvidedContextWindows).toBe(true);
    expect(optionsArg.contextWindows).toBeInstanceOf(Array);
    expect(optionsArg.contextWindows.length).toBe(mockStateFromStageMinus3.originalChunks.length);
    expect(chunksArg).toEqual(mockStateFromStageMinus3.originalChunks);
    expect(assignedCoordsArg).toEqual([mockStateFromStageMinus3.sourceMetadata.targetCoordinate]);
  });

  // 2.a Output Validation Test
  it('should produce stageMinus2Output with batchAnalyses (rich objects) and populated batchMappings, etc.', async () => {
    // The default mock for analyzeChunkGroup in beforeEach will return the rich structure
    const output = await runStageMinus2(mockStateFromStageMinus3);

    expect(output.batchAnalyses).toBeInstanceOf(Array);
    expect(output.batchAnalyses.length).toBe(1);
    const firstBatchAnalysis = output.batchAnalyses[0];
    expect(firstBatchAnalysis.overallSummary).toContain('Overall summary for batch');
    expect(firstBatchAnalysis.extractedMappings).toEqual([{type: "batch_mapping", value: "Origi"}]); // From default mock
    expect(firstBatchAnalysis.extractedTags).toEqual(["tag_Ori"]);

    expect(output.hasEnhancedBatchAnalysis).toBe(true);

    expect(output.batchMappings).toBeInstanceOf(Array);
    expect(output.batchMappings.length).toBe(1);
    expect(output.batchMappings[0]).toEqual(firstBatchAnalysis.extractedMappings);

    expect(output.batchVariations).toBeInstanceOf(Array);
    expect(output.batchVariations.length).toBe(1);
    expect(output.batchVariations[0]).toEqual(firstBatchAnalysis.identifiedVariations);
    
    expect(output.batchTags).toBeInstanceOf(Array);
    expect(output.batchTags.length).toBe(1);
    expect(output.batchTags[0]).toEqual(firstBatchAnalysis.extractedTags);
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
      // Adding new rich fields for the mock response
      overallSummary: "Overall summary from mock.",
      mainThemes: ["Mock Theme 1"],
      extractedTags: ["MockTag1"],
      mefLensInsights: {},
      subnodeMappings: {},
      concatenatedContentLength: 100,
      assignedCoordinates: [mockStateFromStageMinus3.sourceMetadata.targetCoordinate],
    });

    await runStageMinus2(mockStateFromStageMinus3);

    expect(output.batchAnalyses).toBeInstanceOf(Array);
    expect(output.batchAnalyses.length).toBe(1);
    expect(output.batchAnalyses[0]).toEqual(batchAnalysisResultFromMock); // Check if the whole rich object is stored
    expect(output.hasEnhancedBatchAnalysis).toBe(true);

    // Check population of batchMappings, batchVariations, batchTags
    expect(output.batchMappings).toBeInstanceOf(Array);
    expect(output.batchMappings.length).toBe(1);
    expect(output.batchMappings[0]).toEqual(batchAnalysisResultFromMock.extractedMappings);
    
    expect(output.batchVariations).toBeInstanceOf(Array);
    expect(output.batchVariations.length).toBe(1);
    expect(output.batchVariations[0]).toEqual(batchAnalysisResultFromMock.identifiedVariations);
    
    expect(output.batchTags).toBeInstanceOf(Array);
    expect(output.batchTags.length).toBe(1);
    expect(output.batchTags[0]).toEqual(batchAnalysisResultFromMock.extractedTags);
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

    // 2.b Mock for analyzeChunkGroup: Ensure it returns rich objects for multiple calls
    const richResultBatch1 = {
        assignedCoordinates: ["#TARGET"], overallSummary: "Summary B1", mainThemes: ["TB1"], analysis: "Analysis B1",
        extractedMappings: [{type: "map_b1"}], identifiedVariations: [{type: "var_b1"}], naturalElaborations: [],
        deepElaboration: [], novelContributions: [], qlDynamics: [], extractedTags: ["tag_b1"],
        mefLensInsights: {}, subnodeMappings: {}, concatenatedContentLength: 100
    };
    const richResultBatch2 = {
        assignedCoordinates: ["#TARGET"], overallSummary: "Summary B2", mainThemes: ["TB2"], analysis: "Analysis B2",
        extractedMappings: [{type: "map_b2"}], identifiedVariations: [{type: "var_b2"}], naturalElaborations: [],
        deepElaboration: [], novelContributions: [], qlDynamics: [], extractedTags: ["tag_b2"],
        mefLensInsights: {}, subnodeMappings: {}, concatenatedContentLength: 50
    };
    mockAnalyzeChunkGroup
        .mockResolvedValueOnce(richResultBatch1)
        .mockResolvedValueOnce(richResultBatch2);

    const output = await runStageMinus2(mockStateFromStageMinus3);
    
    // Batch size is 6. 8 chunks = 2 batches (6 in first, 2 in second)
    expect(mockAnalyzeChunkGroup).toHaveBeenCalledTimes(2);
    expect(output.batchAnalyses.length).toBe(2);
    expect(output.batchAnalyses[0]).toEqual(richResultBatch1);
    expect(output.batchAnalyses[1]).toEqual(richResultBatch2);

    // Verify population of batchMappings etc. for multiple batches
    expect(output.batchMappings[0]).toEqual(richResultBatch1.extractedMappings);
    expect(output.batchMappings[1]).toEqual(richResultBatch2.extractedMappings);
    expect(output.batchTags[0]).toEqual(richResultBatch1.extractedTags);
    expect(output.batchTags[1]).toEqual(richResultBatch2.extractedTags);

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
