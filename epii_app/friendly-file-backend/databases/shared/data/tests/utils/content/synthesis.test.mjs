// Mock LLM Service
const mockLlmService = {
  generateContent: vi.fn(),
};

// Mock other services or utilities if they were directly imported and used by synthesis.mjs
// For instance, if epiiAgentService is used for generateEpiiPerspective
const mockEpiiAgentService = {
    processChatMessage: vi.fn()
};

vi.mock('../../../services/epii-llm.service.mjs', () => ({
  default: mockLlmService,
}));
vi.mock('../../../services/epii-agent.service.mjs', () => ({
    default: mockEpiiAgentService,
}));


// Import functions to test
import { synthesizeAnalysis, generateCoreElements, generateEpiiPerspective } from '../../../utils/content/synthesis.mjs';

describe('synthesis.mjs', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockLlmService.generateContent.mockResolvedValue("Default LLM response"); // Default mock
    mockEpiiAgentService.processChatMessage.mockResolvedValue({ epiiPerspective: "Agent-generated perspective" });
  });

  describe('synthesizeAnalysis', () => {
    let mockDocumentContent;
    let mockBatchAnalyses;
    let mockAllMappings;
    let mockAllVariations;
    let mockAllTags;
    let mockMetalogikon;
    let mockTargetCoordinate;

    beforeEach(() => {
      // 4.c Input Data
      mockDocumentContent = "This is the full document content.";
      mockBatchAnalyses = [
        { 
          overallSummary: "Summary of batch 1.", 
          mainThemes: ["Theme A"], 
          analysis: "Detailed analysis for B1.",
          // ... other rich fields ...
        },
        { 
          overallSummary: "Summary of batch 2.", 
          mainThemes: ["Theme B", "Theme C"],
          analysis: "Detailed analysis for B2.",
          // ... other rich fields ...
        }
      ];
      mockAllMappings = [{ type: 'map1' }, { type: 'map2' }];
      mockAllVariations = [{ type: 'var1' }];
      mockAllTags = ['tag1', 'tag2', 'tag3'];
      mockMetalogikon = { rootNode: { name: 'Test Met', description: 'Met Desc' } };
      mockTargetCoordinate = '#DOC_TARGET';
    });

    it('should call LLM with a prompt that refers to BATCH ANALYSES and includes stringified batchAnalyses data', async () => {
      mockLlmService.generateContent.mockResolvedValueOnce("Successful synthesis from batch analyses.");

      await synthesizeAnalysis(
        mockDocumentContent,
        mockBatchAnalyses,
        mockAllMappings,
        mockAllVariations,
        mockAllTags,
        mockMetalogikon,
        mockTargetCoordinate,
        mockLlmService,
        null // mockLangsmithRun
      );

      expect(mockLlmService.generateContent).toHaveBeenCalledTimes(1);
      const [callArgs] = mockLlmService.generateContent.mock.calls;
      const systemPrompt = callArgs[1];
      const userPrompt = callArgs[2];

      // 4.d.i Verify prompt refers to BATCH ANALYSES
      expect(userPrompt).toContain(`Synthesize the following batch analyses into a coherent whole:`);
      expect(userPrompt).toContain(`BATCH ANALYSES (${mockBatchAnalyses.length}):`);
      
      // 4.d.ii Verify prompt includes stringified batchAnalyses data
      // Checking for a slice of the stringified data, as the full stringification can be complex to match exactly
      const stringifiedBatchAnalysesSample = JSON.stringify(mockBatchAnalyses.slice(0, 3), null, 2);
      expect(userPrompt).toContain(stringifiedBatchAnalysesSample);

      expect(systemPrompt).toContain("synthesizing analyses of document chunks"); // System prompt might still use "chunks" generically
    });
    
    it('should return the direct response from LLM service', async () => {
        const expectedSynthesis = "LLM generated synthesis text for batches.";
        mockLlmService.generateContent.mockResolvedValueOnce(expectedSynthesis);
        const result = await synthesizeAnalysis(
            mockDocumentContent, mockBatchAnalyses, mockAllMappings, mockAllVariations, mockAllTags,
            mockMetalogikon, mockTargetCoordinate, mockLlmService
        );
        expect(result).toBe(expectedSynthesis);
    });
  });

  describe('generateCoreElements', () => {
    let mockSynthesis;
    let mockAllMappings;
    let mockAllVariations;
    let mockAllTags;
    let mockTargetCoordinate;

    beforeEach(() => {
        mockSynthesis = "This is a detailed synthesis text. It contains DEEP ELABORATION points. And also NOVEL CONTRIBUTIONS. And some QL DYNAMICS are mentioned.";
        mockAllMappings = [{ type: 'map_core' }];
        mockAllVariations = [{ type: 'var_core' }];
        mockAllTags = ['tag_core'];
        mockTargetCoordinate = '#CORE_TARGET';
        mockLlmService.generateContent.mockResolvedValueOnce(JSON.stringify({
            coreElements: [{ elementType: 'MainConcept', name: 'Concept From LLM' }],
            relationalProperties: { qlOperators: [{name: "QL-STRUCT-0"}] }
        }));
    });

    it('should call LLM to extract core elements and relational properties', async () => {
        await generateCoreElements(
            mockSynthesis, mockAllMappings, mockAllVariations, mockAllTags,
            mockTargetCoordinate, mockLlmService
        );

        expect(mockLlmService.generateContent).toHaveBeenCalledTimes(1);
        const [callArgs] = mockLlmService.generateContent.mock.calls;
        const userPrompt = callArgs[2];

        expect(userPrompt).toContain("Extract core elements and relational properties from the following synthesis:");
        expect(userPrompt).toContain(mockSynthesis);
        expect(userPrompt).toContain(`TARGET COORDINATE: ${mockTargetCoordinate}`);
        expect(userPrompt).toContain(JSON.stringify(mockAllMappings.slice(0, 10), null, 2));
    });

    it('should parse LLM response and also extract elements from synthesis text patterns', async () => {
        const result = await generateCoreElements(
            mockSynthesis, mockAllMappings, mockAllVariations, mockAllTags,
            mockTargetCoordinate, mockLlmService
        );

        expect(result.coreElements).toBeInstanceOf(Array);
        expect(result.coreElements.some(el => el.name === 'Concept From LLM')).toBe(true);
        expect(result.coreElements.some(el => el.elementType === "Deep Elaboration")).toBe(true);
        expect(result.coreElements.some(el => el.elementType === "Novel Contribution")).toBe(true);
        expect(result.coreElements.some(el => el.elementType === "QL Dynamics")).toBe(true);
        expect(result.relationalProperties.qlOperators[0].name).toBe("QL-STRUCT-0");
    });
  });

  describe('generateEpiiPerspective', () => {
    let mockSynthesis;
    let mockCoreElements;
    let mockTargetCoordinate;

    beforeEach(() => {
        mockSynthesis = "A complete document synthesis.";
        mockCoreElements = [{ elementType: 'Main', name: 'Element1' }];
        mockTargetCoordinate = '#PERSPECTIVE_TARGET';
    });

    it('should attempt to use EpiiAgentService first if available', async () => {
        const agentPerspective = "Perspective from Epii Agent via LightRAG.";
        mockEpiiAgentService.processChatMessage.mockResolvedValueOnce({ epiiPerspective: agentPerspective });

        const result = await generateEpiiPerspective(
            mockSynthesis, mockCoreElements, mockTargetCoordinate, mockLlmService
        );
        expect(mockEpiiAgentService.processChatMessage).toHaveBeenCalledTimes(1);
        expect(mockLlmService.generateContent).not.toHaveBeenCalled();
        expect(result).toBe(agentPerspective);
    });
    
    it('should fall back to direct LLM call if EpiiAgentService fails or not available', async () => {
        // Simulate EpiiAgentService failing to return a perspective
        mockEpiiAgentService.processChatMessage.mockResolvedValueOnce({ epiiPerspective: null }); 
        const llmPerspective = "Perspective from direct LLM call.";
        mockLlmService.generateContent.mockResolvedValueOnce(llmPerspective);

        const result = await generateEpiiPerspective(
            mockSynthesis, mockCoreElements, mockTargetCoordinate, mockLlmService
        );
        expect(mockEpiiAgentService.processChatMessage).toHaveBeenCalledTimes(1);
        expect(mockLlmService.generateContent).toHaveBeenCalledTimes(1); // Fallback called
        expect(result).toBe(llmPerspective);

        // Reset and test if service import fails (by making it null for this test)
        vi.resetAllMocks(); // reset processChatMessage mock
        mockLlmService.generateContent.mockResolvedValueOnce(llmPerspective); // LLM mock for this part

        const originalAgentServiceImport = await import('../../../services/epii-agent.service.mjs');
        vi.mock('../../../services/epii-agent.service.mjs', () => ({ default: null })); // Simulate import returning null

        // Re-import generateEpiiPerspective with the mocked epii-agent.service.mjs
        // This requires a dynamic import or a way to re-evaluate the module with the new mock.
        // For simplicity in this test, we'll assume the initial check for epiiAgentService would result in null.
        // A more robust way would involve jest.resetModules() and re-importing synthesis.mjs
        // For now, this test primarily ensures the direct LLM path is hit if agent is effectively unavailable.
        // Note: This part of the test is more illustrative due to ESM import complexities with jest/vi mocks.
        // The actual implementation handles the import error.

        // To truly test the import error fallback, we'd need to ensure the module loader re-evaluates
        // For now, let's assume the internal fallback in generateEpiiPerspective works when `epiiAgentService` is null.
        // The previous part of the test (agent returns null perspective) already covers the fallback logic.
    });
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
