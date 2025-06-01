# AI Builder Prompt Package: Epic 2, Feature 1, Story 3 - Natal Psyche Resonance: Oracle Guidance for Individuation

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 1 - Oracle Core Enhancements
**Story:** E2_F1_S3 - Natal Psyche Resonance: Oracle Guidance for Individuation

## 1. Context & Objective

This document outlines the requirements for an AI code generation task to implement **Story E2_F1_S3: Natal Psyche Resonance**. The goal is to personalize Oracle guidance by cross-referencing drawn Tarot cards and current astrological transits with the user's unique natal chart placements. This aims to provide insights that are deeply relevant to the user's individuation journey, illuminating how current energies interact with their innate psychological patterns and potentials.

This story builds upon E2_F1_S1 (Dynamic Card Rendering) and E2_F1_S2 (Real-time Astrological Data Integration), adding a crucial layer of personalization to the Oracle experience.

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/stories/epic_2_decanic_embodiment_oracle_enhancement/story_E2_F1_S3_natal_chart_cross_referencing.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md`
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`

## 3. Technical Context & Assumptions

*   **Frontend:** React, TypeScript, existing state management solution (e.g., Redux Toolkit or Zustand), existing styling solution.
*   **Backend Assumptions / Dependencies:**
    *   User's natal chart data is accessible (e.g., via BPMCP from Mahamaya Ground storage, as per Story E1_F1_S2).
    *   Drawn card's decanic information is available (from E2_F1_S1).
    *   Current astrological transit data is available (from E2_F1_S2).
    *   A sophisticated backend service/agent (e.g., Nara Agent, Parashakti Agent) will perform the core logic of:
        *   Accessing natal chart data.
        *   Identifying resonances between the drawn card's decan, current transits, and the user's natal placements (e.g., planets in the card's decan, aspects involving the decan's ruler, transits to natal planets).
        *   Synthesizing personalized insights based on these cross-references.
    *   This backend service will expose an API endpoint that the frontend can call, providing the drawn card, current transits, and user identifier, and receiving personalized interpretive text or structured data in return.
*   **API Interaction (Frontend Focus):**
    *   The frontend will need to call this new backend API endpoint after a card is drawn and real-time astrological data is fetched.
    *   The frontend will then display the personalized insights received from the backend.
*   **UI/UX Integration:**
    *   The UI should clearly present this personalized layer of interpretation, as guided by `ui-ux-spec.md` and story E2_F1_S3 (e.g., a section titled "Personal Resonance" or "For Your Journey").
    *   The presentation should be psychologically resonant and foster self-understanding.
*   **BPMCP Integration:** Backend services for natal chart data and the new synthesis logic should ideally be accessible via BPMCP.

## 4. Constraints & Considerations

*   **Complexity of Astrological Synthesis:** The core synthesis logic is complex and primarily a backend concern. The frontend's role is to request and display this information.
*   **Data Privacy:** User's natal chart data is sensitive. Ensure all interactions adhere to privacy policies.
*   **Performance:** API calls for personalized insights should be efficient.
*   **Clarity of Information:** Personalized insights should be presented clearly and avoid jargon where possible, or explain terms.

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E2_F1_S3_natal_chart_cross_referencing.md`)
2.  **Epic Definition File Content:** (Content of `epic-2.md`)
3.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md`)
4.  **EFDD/PRD File Content:** (Content of `efdd.md`)
5.  **Illustrative API for Personalized Insights (Frontend Expectation):**
    *   **Request (Frontend to Backend):**
        ```json
        POST /api/bpmcp/oracle/personal-resonance
        {
          "userId": "user-123",
          "drawnCard": {
            "name": "The Magician",
            "decan": "Aries I (Mars)" // Example decanic info
          },
          "currentTransits": { /* ... transit data from E2_F1_S2 ... */ }
        }
        ```
    *   **Response (Backend to Frontend - Illustrative):**
        ```json
        {
          "personalizedInsights": [
            {
              "title": "Resonance with Your Natal Sun in Aries I",
              "text": "The Magician's energy of initiative strongly echoes your core identity. Current transits suggest this is a potent time to manifest new beginnings aligned with your essential self.",
              "type": "natal_planet_in_decan"
            },
            {
              "title": "Transit Spotlight on Your Natal Venus",
              "text": "With transiting Jupiter activating your natal Venus, this card may also point to opportunities for growth in your relationships or creative values, especially concerning how you assert your will.",
              "type": "transit_to_natal_aspect"
            }
          ],
          "reflectivePrompts": [
            "How does the archetype of The Magician resonate with your current sense of personal power?",
            "In what area of your life are you feeling called to take a bold first step, supported by your innate Aries energy?"
          ]
        }
        ```

## 6. Expected Outputs from AI Code Generation

1.  **Frontend Components (React/TypeScript):**
    *   A new component, `PersonalResonanceDisplay`, responsible for displaying the personalized insights and reflective prompts received from the backend.
    *   This component should be designed to be integrated into the main Oracle reading flow.
2.  **State Management Logic (Enhancement):**
    *   Extend existing Oracle state (or create new state slices if appropriate using Redux Toolkit/Zustand) to store the personalized insights and reflective prompts.
    *   Actions, reducers/slices, and selectors for managing this data.
3.  **API Call Logic (New Service/Utility):**
    *   A new service/utility function to make the API call to the `/api/bpmcp/oracle/personal-resonance` endpoint.
    *   TypeScript type definitions for the request payload and the expected API response (as illustrated above).
4.  **Integration Logic:**
    *   Logic within the Oracle flow to trigger the call for personal resonance after a card is drawn and astrological transits are available.
    *   Logic to pass the necessary data (drawn card, transits, user ID) to the API call.
5.  **Explanation & Documentation:**
    *   Clear comments in the code.
    *   A brief markdown document explaining the new components, state changes, API interaction, and how it fits into the Oracle flow.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E2_F1_S3, Epic 2, UI/UX Specifications, EFDD, and illustrative API structure), please generate the necessary frontend code (React with TypeScript) to implement the "Natal Psyche Resonance" feature for the Nara Oracle.

**Key Requirements:**

1.  **API Interaction for Personalized Insights:**
    *   Create a service/utility function to make a POST request to `/api/bpmcp/oracle/personal-resonance`. This function will send `userId`, `drawnCard` (with at least `name` and `decan` properties), and `currentTransits` data.
    *   Define TypeScript interfaces for the request payload and the expected API response (matching the illustrative structure: `personalizedInsights` array and `reflectivePrompts` array).

2.  **State Management (Redux Toolkit or Zustand - please choose one and be consistent, assuming Redux Toolkit if not specified):**
    *   Define actions, reducers/slices, and selectors to manage the `personalizedInsights` and `reflectivePrompts` received from the API.
    *   This data should be stored in a way that's associated with the current Oracle reading.

3.  **Display Component (`PersonalResonanceDisplay`):**
    *   Develop a React component that takes `personalizedInsights` and `reflectivePrompts` as props (or selects them from the store).
    *   It should render each insight with its title and text, and list the reflective prompts.
    *   The styling should be minimal but clean, allowing for integration into the broader Oracle UI. Refer to UI/UX spec for general aesthetic guidance.

4.  **Integration into Oracle Flow:**
    *   Show (in comments or a conceptual outline) where in the existing Oracle component hierarchy or logic this new API call would be triggered (e.g., after a card is drawn and its decan identified, and after current transits are fetched).
    *   Explain how the `PersonalResonanceDisplay` component would be conditionally rendered once the personalized data is available.

5.  **Code Structure & Best Practices:**
    *   Organize code into logical directories.
    *   Ensure components are functional, use hooks, and are well-typed.
    *   Include basic error handling for the API call (e.g., if insights cannot be fetched, display a fallback or nothing).
    *   Provide clear comments.

6.  **Deliverables:**
    *   All necessary TypeScript/TSX files for the component(s), state management, service functions, and types.
    *   A brief `README.md` explaining the generated code, its integration points, and any assumptions made.

**Assumptions for you to make:**
*   Assume a Redux Toolkit setup is already in place for state management. If you opt for Zustand, state that clearly.
*   The `userId`, `drawnCard` details (including decan), and `currentTransits` data are available in the frontend context when the API call needs to be made.
*   Focus on the frontend's role in requesting, managing, and displaying this personalized data. The complex backend synthesis is out of scope for this frontend task.
```

## 8. Review & Next Steps

*   The generated code will be reviewed for alignment with requirements, code quality, and integration potential.
*   Backend API development for the `/api/bpmcp/oracle/personal-resonance` endpoint is a critical dependency.
*   This feature will be integrated into the main Oracle reading display flow.