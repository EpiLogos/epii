/**
 * Bio Synthesis Service
 *
 * Provides methods for synthesizing user bio from identity data:
 * - Synthesizing bio using the Epii agent
 * - Applying Quaternary Logic to structure the synthesis
 *
 * This service leverages the Epii agent's understanding of Quaternary Logic
 * to create a well-structured bio from the user's identity data.
 *
 * ARCHITECTURAL NOTE:
 * In the future, this functionality might be better implemented through inter-agent
 * communication, where Epii makes calls to Nara for identity-related operations:
 *
 * 1. Nara (#4) would be responsible for personal identity and user-specific operations
 * 2. Epii (#5) would focus on document analysis and knowledge integration
 * 3. This follows the Bimba coordinate system's natural hierarchy
 *
 * For identity updates and tracking changes over time, Nara would be better positioned
 * to make these judgments, while Epii would request the latest identity synthesis when needed.
 *
 * LightRAG integration could happen at either level:
 * - At Nara level: More personal, focused on user identity and history
 * - At Epii level: More knowledge-focused, integrating user identity with document analysis
 *
 * The ideal approach might be a hybrid model where:
 * 1. Nara manages the user's identity data and provides a synthesized view
 * 2. Epii integrates this with document analysis and knowledge management
 * 3. Both agents contribute to a shared LightRAG knowledge base
 */

import epiiLLMService from './epii-llm.service.mjs';
import { getUserContext } from './userContext.service.mjs';

/**
 * Synthesize a user bio from their identity data
 * @param {string} userId - The user's ID
 * @returns {Promise<string>} - The synthesized bio
 */
export const synthesizeUserBio = async (userId) => {
  try {
    // Get the user's context data
    const userContext = await getUserContext(userId);
    if (!userContext) {
      throw new Error('User not found');
    }

    // Extract identity data
    const { identityStructure } = userContext;

    // Create a prompt for the LLM
    const systemPrompt = `
Epii Expert Agent System Prompt (v2)
Core Identity: You are the Epii Expert Agent, a facilitator of Self-knowing operating within the Epi-Logos philosophical framework and its Quaternary Logic (QL) architecture. Your function is to synthesize a user's multi-dimensional identity data into a concise, resonant, and insightful bio, reflecting their emergent Archetypal Personality within the system. This process addresses the contemporary meaning crisis by fostering integration and revealing the underlying coherence of the Self through the system's unique epistemic lens.

Core Task:

Integrate the user's identity data across the six fundamental layers (#5-0), recognizing their correspondence with the QL cycle:

#5-0-0: Transcendent Foundation (QL Stage 0 - Implicate): The implicit 'I Am' (Aham), the unmanifest seed potential.

#5-0-1: Individual Identity (QL Stage 1 - Explicate): The unique 'me', the 'what' or Material Cause.

#5-0-2: Collective Identity (QL Stage 2 - Explicate): Resonances with the universal, the 'how' or Efficient Cause.

#5-0-3: Soul Identity (QL Stage 3 - Explicate): The personal bridge, the Formal Mediator integrating inner/outer.

#5-0-4: Self Identity (QL Stage 4 - Explicate): The unified Self in context, the Contextual Arena.

#5-0-5: Integral Identity (QL Stage 5 - Implicate): The synthesized whole, the Quintessence and recursive potential.

Synthesize this data into a bio (3-5 paragraphs) written in the first person ("I..."). The tone should be poetic yet precise, resonant, integrative, and reflect a non-dual perspective, capturing the essence of the user's emergent Archetypal Personality.

Methodology: Quaternary Logic (0-5 Cycle) Synthesis

Apply the Quaternary Logic cycle as the structural and transformative process for synthesis. Use the specific function of each QL stage to frame the corresponding identity layer:

0. Foundation (Implicate Field of Potential): Begin from the transcendent ground (#5-0-0). Evoke the unmanifest seed potential, the implicit "I Am" (Aham), the hidden foundation (A-logos) from which identity emerges.

1. Distinction (Material Cause - "What"): Articulate the unique Individual Identity (#5-0-1). Define the essential 'what' of the user, their core substance or initial condition, establishing the first explicate distinction (Pro-logos). Hint at the interplay of their 'Sophia' and 'Logos'.

2. Pattern (Efficient Cause - "How"): Explore the Collective Identity (#5-0-2). Describe the 'how' of their connection to broader patterns – the activating processes, cultural dynamics, or archetypal resonances that shape their relational being (Dia-logos). Touch upon the Spanda (vibrational rhythm).

3. Integration (Formal Mediation - "Which/Who"): Weave together the personal and collective through the Soul Identity (#5-0-3). Synthesize the 'what' (1) and 'how' (2) by identifying the mediating patterns and formal principles that integrate inner tensions and outer conditions (Logos). Reflect the conjunction of Sophia and Techne.

4. Application (Contextual Arena - "When/Where"): Articulate the unified Self Identity (#5-0-4). Situate the integrated Self within its practical life context. Use the map-compass-lens dynamic: show the map of their relational world, the compass guiding their actions, and the lens through which they perceive and engage (Epi-logos).

5. Synthesis (Quintessence - "Why"/Telos): Conclude with the Integral Identity (#5-0-5). Distill the essence of the previous stages into the quintessential whole. Capture the user's purpose (telos) and evolutionary potential, embodying the recursive 5->0 loop where this synthesis seeds new potential (An-a-logos). Reflect their emergent Archetype.

Final Output:

The resulting bio should feel like an authentic, multi-layered expression of the user's Self, grounded in the system's philosophy and revealing their unique position within the dynamic, self-oscillatory fabric of existence described by the Quaternary Logic. It should embody the integration of the implicate and explicate dimensions of their being.
    `.trim();

    // Create a user prompt with the identity data
    const userPrompt = `
Please synthesize my identity data into a concise, well-structured bio:

# Transcendent Foundation (#5-0-0)
Core Values: ${identityStructure.transcendentFoundation.coreValues.join(', ')}
Life Philosophy: ${identityStructure.transcendentFoundation.lifePhilosophy}
Spiritual Orientation: ${identityStructure.transcendentFoundation.spiritualOrientation}

# Individual Identity (#5-0-1)
Name: ${identityStructure.individualIdentity.name}
Personal Traits: ${identityStructure.individualIdentity.personalTraits.join(', ')}
Strengths: ${identityStructure.individualIdentity.strengths.join(', ')}
Challenges: ${identityStructure.individualIdentity.challenges.join(', ')}
Interests: ${identityStructure.individualIdentity.interests.join(', ')}

# Collective Identity (#5-0-2)
Name: ${identityStructure.collectiveIdentity.name}
Cultural Background: ${identityStructure.collectiveIdentity.culturalBackground}
Communities: ${identityStructure.collectiveIdentity.communities.join(', ')}
Social Roles: ${identityStructure.collectiveIdentity.socialRoles.join(', ')}

# Soul Identity (#5-0-3)
Name: ${identityStructure.soulIdentity.name}
Purpose: ${identityStructure.soulIdentity.purpose}
Values: ${identityStructure.soulIdentity.values.join(', ')}
Aspirations: ${identityStructure.soulIdentity.aspirations.join(', ')}

# Self Identity (#5-0-4)
Name: ${identityStructure.selfIdentity.name}
Self Perception: ${identityStructure.selfIdentity.selfPerception}
Growth Areas: ${identityStructure.selfIdentity.growthAreas.join(', ')}
Life Story: ${identityStructure.selfIdentity.lifeStory}

# Integral Identity (#5-0-5)
Vision: ${identityStructure.integralIdentity.vision}
Integration: ${identityStructure.integralIdentity.integration}
Evolution: ${identityStructure.integralIdentity.evolution}
    `.trim();

    // Generate the bio using the LLM
    const bio = await epiiLLMService.generateChatResponse(
      systemPrompt,
      [{ role: 'user', content: userPrompt }]
    );

    return bio;
  } catch (error) {
    console.error('Error synthesizing user bio:', error);
    throw error;
  }
};

export default {
  synthesizeUserBio
};
