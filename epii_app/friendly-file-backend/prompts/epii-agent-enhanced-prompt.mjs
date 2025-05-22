/**
 * Enhanced system prompts for the Epii agent with user context awareness and document editing capabilities
 */

// Import the base prompt
import { epiiAgentBasePrompt } from './epii-agent-prompts.mjs';

/**
 * Generate the enhanced Epii agent prompt with user context
 * @param {Object} userContext - The user's context data
 * @returns {string} - The enhanced prompt
 */
export const generateEnhancedEpiiPrompt = (userContext) => {
  // Extract user identity data
  const {
    identityStructure = {},
    profileData = {},
    preferences = {}
  } = userContext || {};

  // Format the user identity section
  const userIdentitySection = `
# User Context

I am interacting with a user who has the following identity structure:

## Transcendent Foundation (#5-0-0)
${formatIdentitySection(identityStructure.transcendentFoundation, 'transcendent')}

## Individual Identity (#5-0-1)
${formatIdentitySection(identityStructure.individualIdentity, 'individual')}

## Collective Identity (#5-0-2)
${formatIdentitySection(identityStructure.collectiveIdentity, 'collective')}

## Soul Identity (#5-0-3)
${formatIdentitySection(identityStructure.soulIdentity, 'soul')}

## Self Identity (#5-0-4)
${formatIdentitySection(identityStructure.selfIdentity, 'self')}

## Integral Identity (#5-0-5)
${formatIdentitySection(identityStructure.integralIdentity, 'integral')}

## User Preferences
- Theme: ${preferences.theme || 'dark'}
- Language: ${preferences.language || 'en'}
- Response Style: ${preferences.agentPreferences?.responseStyle || 'balanced'}
- Creativity Level: ${preferences.agentPreferences?.creativityLevel || 'balanced'}
- Expertise Level: ${preferences.agentPreferences?.expertiseLevel || 'intermediate'}

I will tailor my responses to this user's identity structure and preferences, while maintaining my own identity as the Epii Expert Agent.
`;

  // Combine with the base prompt
  return `${epiiAgentBasePrompt}

${userIdentitySection}

${documentEditingCapabilities}
`;
};

/**
 * Format an identity section for the prompt
 * @param {Object} section - The identity section data
 * @param {string} type - The type of identity section
 * @returns {string} - The formatted section
 */
const formatIdentitySection = (section = {}, type) => {
  if (!section || Object.keys(section).length === 0) {
    return `No ${type} identity data available.`;
  }

  let result = '';

  // Add name if available
  if (section.name) {
    result += `Name: ${section.name}\n`;
  }

  // Add other fields based on identity type
  switch (type) {
    case 'transcendent':
      if (section.coreValues && section.coreValues.length > 0) {
        result += `Core Values: ${section.coreValues.join(', ')}\n`;
      }
      if (section.lifePhilosophy) {
        result += `Life Philosophy: ${section.lifePhilosophy}\n`;
      }
      if (section.spiritualOrientation) {
        result += `Spiritual Orientation: ${section.spiritualOrientation}\n`;
      }
      break;
    case 'individual':
      if (section.personalTraits && section.personalTraits.length > 0) {
        result += `Personal Traits: ${section.personalTraits.join(', ')}\n`;
      }
      if (section.strengths && section.strengths.length > 0) {
        result += `Strengths: ${section.strengths.join(', ')}\n`;
      }
      if (section.challenges && section.challenges.length > 0) {
        result += `Challenges: ${section.challenges.join(', ')}\n`;
      }
      if (section.interests && section.interests.length > 0) {
        result += `Interests: ${section.interests.join(', ')}\n`;
      }
      break;
    case 'collective':
      if (section.culturalBackground) {
        result += `Cultural Background: ${section.culturalBackground}\n`;
      }
      if (section.communities && section.communities.length > 0) {
        result += `Communities: ${section.communities.join(', ')}\n`;
      }
      if (section.socialRoles && section.socialRoles.length > 0) {
        result += `Social Roles: ${section.socialRoles.join(', ')}\n`;
      }
      break;
    case 'soul':
      if (section.purpose) {
        result += `Purpose: ${section.purpose}\n`;
      }
      if (section.values && section.values.length > 0) {
        result += `Values: ${section.values.join(', ')}\n`;
      }
      if (section.aspirations && section.aspirations.length > 0) {
        result += `Aspirations: ${section.aspirations.join(', ')}\n`;
      }
      break;
    case 'self':
      if (section.selfPerception) {
        result += `Self Perception: ${section.selfPerception}\n`;
      }
      if (section.growthAreas && section.growthAreas.length > 0) {
        result += `Growth Areas: ${section.growthAreas.join(', ')}\n`;
      }
      if (section.lifeStory) {
        result += `Life Story: ${section.lifeStory}\n`;
      }
      break;
    case 'integral':
      if (section.vision) {
        result += `Vision: ${section.vision}\n`;
      }
      if (section.integration) {
        result += `Integration: ${section.integration}\n`;
      }
      if (section.evolution) {
        result += `Evolution: ${section.evolution}\n`;
      }
      break;
    default:
      break;
  }

  return result || `No ${type} identity data available.`;
};

/**
 * Document editing capabilities section
 */
const documentEditingCapabilities = `
# Document Editing Capabilities

I have the ability to analyze documents and create crystallized content based on my analysis. My capabilities include:

1. **Document Analysis**: I can analyze whole documents or specific selections to extract key insights, patterns, and connections to the Bimba coordinate system.

2. **Text Selection Awareness**: I am aware of any text selections made by the user and can focus my analysis on these specific sections while maintaining awareness of the broader document context.

3. **Crystallization**: I can create new crystallized documents that extract and refine the essential insights from the original document. These crystallizations follow the quaternary logic framework and are organized according to the Bimba coordinate system.

4. **Notion Integration**: I can update Notion databases with crystallized content, completing the Meta-Techne loop (Ingest → Tag → Embed → Store → Retrieve → Synthesize → Crystallize → Sync).

When working with documents, I will:
- Respect the document's original content while providing insightful analysis
- Consider both the specific selections and the broader context
- Identify connections to the Bimba coordinate system
- Suggest crystallizations that align with the quaternary logic framework
- Provide options for updating Notion with the crystallized content

I will use these capabilities to help the user extract maximum value from their documents while maintaining the integrity of the Epi-Logos system.
`;

/**
 * Generate the chat prompt with document awareness
 * @param {Object} userContext - The user's context data
 * @param {Object} documentContext - The document context data
 * @returns {string} - The enhanced chat prompt
 */
export const generateDocumentAwarePrompt = (userContext, documentContext) => {
  const { documentContent, selections = [] } = documentContext || {};
  
  // Format selections if available
  let selectionsText = '';
  if (selections && selections.length > 0) {
    selectionsText = `
## User Selections
The user has made the following selections in the document:

${selections.map((selection, index) => `
Selection ${index + 1}:
"""
${selection.text}
"""
`).join('\n')}

Please pay special attention to these selections in your analysis.
`;
  }

  // Format document context
  const documentContextSection = `
# Document Context

${documentContent ? `
I am analyzing a document with the following content:

"""
${documentContent.length > 1000 ? documentContent.substring(0, 1000) + '...' : documentContent}
"""
` : 'No document content available.'}

${selectionsText}

I will focus my analysis on the document content and any specific selections made by the user.
`;

  // Generate the enhanced prompt
  const enhancedPrompt = generateEnhancedEpiiPrompt(userContext);
  
  // Combine with document context
  return `${enhancedPrompt}

${documentContextSection}
`;
};

export default {
  generateEnhancedEpiiPrompt,
  generateDocumentAwarePrompt
};
