/**
 * Nara Skills Initializer
 * Initializes the skills provided by the Nara agent
 *
 * Bimba Coordinate: #5-4-4
 * Represents the Nara agent skills within the Siva-Shakti layer
 */

// Mock BPMCP service for testing - will be replaced with actual service
const bpMCPService = {
  async queryMongo(collection, query) {
    console.log(`Mock BPMCP: Querying MongoDB collection ${collection} with query:`, query);
    return { success: true, data: [] };
  },
  async queryNotion(databaseId, query) {
    console.log(`Mock BPMCP: Querying Notion database ${databaseId} with query:`, query);
    return { success: true, data: [] };
  },
  async queryBimbaGraph(query) {
    console.log(`Mock BPMCP: Querying Bimba graph with query:`, query);
    return { success: true, data: [] };
  },
  async queryPratibimbaVector(query) {
    console.log(`Mock BPMCP: Querying Pratibimba vector store with query:`, query);
    return { success: true, data: [] };
  }
};

/**
 * Initialize Nara skills
 * @param {Object} naraAgentService The Nara agent service
 * @returns {Object} The skills registry with Nara skills
 */
function initializeNaraSkills(naraAgentService, skillsRegistry) {
  if (!naraAgentService) {
    console.warn('No Nara agent service provided, using mock implementation');
    naraAgentService = {
      processChatMessage: async (content, context) => {
        return {
          response: `Mock Nara response for: ${content}`,
          metadata: { context }
        };
      },
      naraAgentNode: async (state) => {
        return {
          ...state,
          synthesized_response: `Mock Nara response for state: ${JSON.stringify(state).substring(0, 100)}...`
        };
      }
    };
  }

  // Register the main Nara skill
  skillsRegistry.registerSkill({
    id: 'personalize-dialogue',
    name: 'Personalize Dialogue',
    description: 'Personalizes dialogue responses based on user context and identity',
    bimbaCoordinate: '#4-5',
    agentId: 'nara-agent',
    qlMetadata: {
      qlPosition: 4,
      contextFrame: '(4.0-4.4/5)',
      qlMode: 'ascending'
    },
    harmonicMetadata: {
      resonantFrequency: 'contextual application',
      harmonicRelations: ['#4-0', '#4-4'],
      paraVakAspect: 'vaikhari', // Manifest aspect of speech
      ontologicalLayer: 'dia-logos'
    },
    handler: async (content, context) => {
      // Call the Nara agent service to process the message
      return await naraAgentService.processChatMessage(content, {
        ...context,
        targetCoordinate: '#4-5',
        mode: 'personalize-dialogue',
        qlMetadata: {
          qlPosition: 4,
          contextFrame: '(4.0-4.4/5)',
          qlMode: 'ascending'
        }
      });
    }
  });

  // Register the Generate Personal Archetypal Signature skill
  skillsRegistry.registerSkill({
    id: 'generate-personal-archetypal-signature',
    name: 'Generate Personal Archetypal Signature',
    description: 'Creates a unique archetypal profile for a user by synthesizing birthdate encoding and natal chart data',
    bimbaCoordinate: '#4-0',
    agentId: 'nara-agent',
    qlMetadata: {
      qlPosition: 0,
      contextFrame: '(4.0-4/5)',
      qlMode: 'ascending'
    },
    handler: async (content, context) => {
      // Extract birthdate and natal chart data from content if provided
      let birthdate = null;
      let natalChart = null;

      if (typeof content === 'object') {
        birthdate = content.birthdate;
        natalChart = content.natalChart;
      }

      // Query user data from MongoDB
      const userData = await bpMCPService.queryMongo('UserIdentityData', {
        userId: context.userId
      });

      // Call the Nara agent service to generate the archetypal signature
      return await naraAgentService.processChatMessage(JSON.stringify({
        action: 'generate-archetypal-signature',
        birthdate: birthdate || userData?.data?.birthdate,
        natalChart: natalChart || userData?.data?.natalChart
      }), {
        ...context,
        targetCoordinate: '#4-0',
        mode: 'archetypal-signature',
        userData: userData?.data
      });
    }
  });

  // Register the Interpret Symbolic Input Personalized skill
  skillsRegistry.registerSkill({
    id: 'interpret-symbolic-input-personalized',
    name: 'Interpret Symbolic Input Personalized',
    description: 'Interprets symbolic input specifically for a given user, filtering through their unique archetypal signature',
    bimbaCoordinate: '#4-2',
    agentId: 'nara-agent',
    qlMetadata: {
      qlPosition: 2,
      contextFrame: '(4.0-4/5)',
      qlMode: 'bidirectional'
    },
    handler: async (content, context) => {
      // Extract symbolic input from content
      let symbolicInput = content.symbolicInput || content;
      let userContext = content.context || '';

      // Query user archetypal signature
      const userSignature = await bpMCPService.queryMongo('UserIdentityData', {
        userId: context.userId,
        fields: ['archetypalSignature']
      });

      // Query relevant symbolic correspondences from Bimba graph
      const symbolCorrespondences = await bpMCPService.queryBimbaGraph(`
        MATCH (s:Symbol)-[r]-(c)
        WHERE s.name CONTAINS "${typeof symbolicInput === 'object' ? symbolicInput.type : 'symbol'}"
        RETURN s, r, c
        LIMIT 10
      `);

      // Call the Nara agent service to interpret the symbolic input
      return await naraAgentService.processChatMessage(JSON.stringify({
        action: 'interpret-symbolic-input',
        symbolicInput,
        userContext,
        userSignature: userSignature?.data?.archetypalSignature,
        symbolCorrespondences: symbolCorrespondences?.data
      }), {
        ...context,
        targetCoordinate: '#4-2',
        mode: 'symbolic-interpretation',
        userSignature: userSignature?.data?.archetypalSignature
      });
    }
  });

  // Register the Generate Bespoke Psycho-Techne skill
  skillsRegistry.registerSkill({
    id: 'generate-bespoke-psycho-techne',
    name: 'Generate Bespoke Psycho-Techne',
    description: 'Generates personalized practical guidance such as rituals, meditations, or daily routines',
    bimbaCoordinate: '#4-3',
    agentId: 'nara-agent',
    qlMetadata: {
      qlPosition: 3,
      contextFrame: '(4.0-4/5)',
      qlMode: 'descending'
    },
    handler: async (content, context) => {
      // Extract goal/context and guidance type from content
      let goalOrContext = content.goalOrContext || content;
      let guidanceType = content.guidanceType || 'ritual';

      // Query user archetypal signature
      const userSignature = await bpMCPService.queryMongo('UserIdentityData', {
        userId: context.userId,
        fields: ['archetypalSignature']
      });

      // Query relevant practices from Notion
      const practices = await bpMCPService.queryNotion('PracticesDB', {
        filter: {
          property: 'Type',
          select: {
            equals: guidanceType
          }
        }
      });

      // Call the Nara agent service to generate the psycho-techne
      return await naraAgentService.processChatMessage(JSON.stringify({
        action: 'generate-psycho-techne',
        goalOrContext,
        guidanceType,
        userSignature: userSignature?.data?.archetypalSignature,
        relevantPractices: practices?.data
      }), {
        ...context,
        targetCoordinate: '#4-3',
        mode: 'psycho-techne',
        userSignature: userSignature?.data?.archetypalSignature
      });
    }
  });

  // Register the Map User to Concrescence Cycle skill
  skillsRegistry.registerSkill({
    id: 'map-user-to-concrescence-cycle',
    name: 'Map User to Concrescence Cycle',
    description: 'Determines the user\'s current phase within the 12-Fold Concrescence model',
    bimbaCoordinate: '#4-4',
    agentId: 'nara-agent',
    qlMetadata: {
      qlPosition: 4,
      contextFrame: '(4.0-4/5)',
      qlMode: 'bidirectional'
    },
    handler: async (content, context) => {
      // Extract user context description from content
      let userContextDescription = content.userContextDescription || content;

      // Query user history from MongoDB
      const userHistory = await bpMCPService.queryMongo('UserInteractions', {
        userId: context.userId,
        limit: 10,
        sort: { timestamp: -1 }
      });

      // Query concrescence cycle model from Bimba graph
      const concrescenceModel = await bpMCPService.queryBimbaGraph(`
        MATCH (c:ConcrescencePhase)
        RETURN c
        ORDER BY c.position
      `);

      // Call the Nara agent service to map the user to the concrescence cycle
      return await naraAgentService.processChatMessage(JSON.stringify({
        action: 'map-to-concrescence-cycle',
        userContextDescription,
        userHistory: userHistory?.data,
        concrescenceModel: concrescenceModel?.data
      }), {
        ...context,
        targetCoordinate: '#4-4',
        mode: 'concrescence-mapping'
      });
    }
  });

  return skillsRegistry;
}

module.exports = {
  initializeNaraSkills,
  bpMCPService // Export the mock BPMCP service for testing
};
