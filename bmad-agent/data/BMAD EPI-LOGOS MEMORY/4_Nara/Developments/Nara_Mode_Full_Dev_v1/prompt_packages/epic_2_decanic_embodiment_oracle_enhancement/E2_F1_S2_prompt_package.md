# AI Builder Prompt Package: Epic 2, Feature 1, Story 2 - Real-time Astrological Data Integration

**Development Name:** Nara_Mode_Full_Dev_v1
**Epic:** Epic 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** Feature 1 - Oracle Core Enhancements
**Story:** E2_F1_S2 - Real-time Astrological Data Integration

## 1. Context & Objective

This document outlines the requirements for an AI code generation task to implement **Story E2_F1_S2: Real-time Astrological Data Integration**. The goal is to integrate real-time astrological data (planetary positions, aspects, transits) into the Oracle section of the Nara application. This data will be used to dynamically influence card interpretations, suggest relevant spreads, and provide users with a richer, more contextually aware divinatory experience.

This story builds upon the foundations laid in Epic 2, focusing on enhancing the Oracle's capabilities by connecting it to live celestial events. It directly supports the epic's aim to transform the Oracle into a "dynamic theater integrating astrological conditions."

## 2. Source Documents for AI Context

*   **Story Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/Stories/epic-2/story_E2_F1_S2_real_time_astro_integration.md`
*   **Epic Definition:** `BMAD EPI-LOGOS MEMORY/4_Nara/epics/epic-2.md`
*   **UI/UX Specifications:** `BMAD EPI-LOGOS MEMORY/4_Nara/design/ui-ux-spec.md`
*   **Overall Feature Definition (EFDD/PRD):** `BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/1_feature_definition/efdd.md`

## 3. Technical Context & Assumptions

*   **Frontend:** React, TypeScript, existing state management solution (e.g., Redux, Zustand, or Context API - to be confirmed from existing codebase patterns if available, otherwise suggest one), existing styling solution (e.g., Styled Components, Tailwind CSS - to be confirmed).
*   **Backend Assumptions:**
    *   An API endpoint exists or will be created (as part of this task or a separate backend task) to provide real-time astrological data. This API should ideally be accessible via the BPMCP.
    *   The API will return data in a structured format (e.g., JSON) detailing current planetary positions, aspects, and relevant transits.
    *   If a specific astrological calculation library is preferred or already in use on the backend, its output format will be the basis for the API response.
*   **API Interaction:**
    *   The frontend will need to make API calls to fetch this astrological data.
    *   Consider caching strategies for this data to avoid excessive API calls (e.g., update every few minutes or on specific user actions).
*   **UI/UX Integration:**
    *   The UI/UX spec (`ui-ux-spec.md`) provides guidance on how astrological information might be visually presented or influence the Oracle interface. The generated components should align with these specifications.
    *   The integration should be seamless and enhance the user's symbolic reading experience.
*   **BPMCP Integration:** As per `efdd.md`, interactions with backend services, including potential new astrological data services, should ideally be routed through the Bimba-Pratibimba Memory Context Protocol (BPMCP).
*   **Error Handling:** Robust error handling for API calls (e.g., network issues, API errors) is required.

## 4. Constraints & Considerations

*   **Performance:** Fetching and processing astrological data should not negatively impact the Oracle section's performance.
*   **Accuracy:** The source of astrological data should be reliable. For this task, we assume the backend API provides accurate data.
*   **Modularity:** Components related to astrological data display and integration should be modular and reusable where possible.
*   **User Experience:** The presentation of astrological data should be intuitive and meaningful to the user, not overwhelming.
*   **Security:** If API keys are required for the astrological data service, they must be handled securely (typically a backend concern, but the frontend should not expose them).

## 5. Input for AI Code Generation

1.  **Story Definition File Content:** (Content of `story_E2_F1_S2_real_time_astro_integration.md`)
2.  **Epic Definition File Content:** (Content of `epic-2.md`)
3.  **UI/UX Specification File Content:** (Content of `ui-ux-spec.md`)
4.  **EFDD/PRD File Content:** (Content of `efdd.md` for overall context)
5.  **Sample Astrological Data API Response (Illustrative):**
    ```json
    {
      "timestamp": "2023-10-27T10:30:00Z",
      "planets": [
        {"name": "Sun", "sign": "Scorpio", "degrees": 4.52, "motion": "direct"},
        {"name": "Moon", "sign": "Taurus", "degrees": 18.78, "motion": "direct"},
        // ... other planets
      ],
      "aspects": [
        {"planet1": "Sun", "planet2": "Moon", "aspect": "Opposition", "orb": 1.2},
        // ... other aspects
      ],
      "currentTransits": [
        {"planet": "Saturn", "transitingSign": "Pisces", "natalPlanetImpacted": "Mars", "natalSign": "Gemini"}
        // ... other significant transits relevant to a generic or user-specific context if available
      ]
    }
    ```

## 6. Expected Outputs from AI Code Generation

1.  **Frontend Components (React/TypeScript):**
    *   Component(s) to fetch and display relevant real-time astrological information (e.g., current sign of Sun/Moon, major aspects).
    *   Logic to integrate this data into the Oracle's card interpretation process (e.g., modifying display, suggesting interpretations based on active astrological energies).
    *   (Optional, if specified by UI/UX) Visual elements or indicators within the Oracle UI to represent current astrological influences.
2.  **State Management Logic:**
    *   Actions, reducers/slices, and selectors (or equivalent for other state management libraries) for managing astrological data in the frontend state.
3.  **API Call Logic:**
    *   Service/utility functions for making API calls to the astrological data endpoint (via BPMCP if applicable).
    *   Type definitions for the API request and response.
4.  **Type Definitions (TypeScript):**
    *   Interfaces/types for astrological data structures used throughout the frontend.
5.  **Backend API Endpoint (Illustrative - if AI is asked to suggest a backend structure):
    *   A Node.js/Express (or other agreed-upon backend stack) example of an API endpoint `/api/astrology/current` that could serve the sample data structure. This is secondary to the frontend work.
6.  **Explanation & Documentation:**
    *   Clear comments in the code.
    *   A brief markdown document explaining the implemented components, their props, state management integration, and how to use them.
    *   Notes on any assumptions made or potential areas for future improvement.

## 7. Prompt for Generative AI (e.g., Claude 3.5 Sonnet / GPT-4)

```
Given the provided context (Story E2_F1_S2, Epic 2, UI/UX Specifications, EFDD, and sample API data), please generate the necessary frontend code (React with TypeScript) to implement the "Real-time Astrological Data Integration" feature for the Nara Oracle.

**Key Requirements:**

1.  **Astrological Data Fetching & Management:**
    *   Create a service/utility function to fetch real-time astrological data from an API endpoint (assume `/api/bpmcp/astrology/current` which internally calls the actual astro service). Use the provided sample JSON as the expected response structure.
    *   Implement state management logic (using Redux Toolkit or Zustand - please choose one and be consistent) to store and update this astrological data. Include actions, reducers/slices, and selectors.
    *   Define TypeScript interfaces for all astrological data structures.

2.  **UI Integration & Display:**
    *   Develop a React component, `AstrologicalContextDisplay`, that fetches (on mount and perhaps on a timer or user action) and displays key astrological information (e.g., Sun's sign and degrees, Moon's sign and degrees, and one or two major active aspects). This component should be designed to be embeddable within the Oracle section.
    *   The display should be clean, concise, and align with the general aesthetic described in the UI/UX spec (symbolic, immersive, not overly cluttered).

3.  **Influence on Oracle Interpretation (Conceptual Logic):**
    *   Outline in comments or a separate markdown section how the fetched astrological data *could* be used to influence Tarot card interpretations or suggest relevant spreads within the Oracle. For example, if Mars is heavily aspected, interpretations might highlight themes of action or conflict. Actual implementation of this interpretive logic might be complex and iterative, so provide a foundational structure or hooks for it.

4.  **Code Structure & Best Practices:**
    *   Organize the code into logical directories (e.g., `components/oracle/astrology`, `features/astrology`, `services/astrology`).
    *   Ensure components are functional, use hooks, and are well-typed.
    *   Include basic error handling for the API call (e.g., display a message if data cannot be fetched).
    *   Provide clear comments in the code.

5.  **Deliverables:**
    *   All necessary TypeScript/TSX files for the components, state management, services, and types.
    *   A brief `README.md` explaining the generated code, how to integrate it, and any assumptions made.

**Assumptions for you to make:**
*   Assume a Redux Toolkit setup is already in place for state management. If you opt for Zustand, state that clearly.
*   Assume a global CSS or styling solution (like Tailwind or Styled Components) is available for basic styling; focus on structure and logic rather than pixel-perfect styling, but apply sensible class names or inline styles for clarity.
*   The application uses a standard React project structure (e.g., created with Create React App or Vite).

Focus on creating a robust and well-structured foundation for this feature.
```

## 8. Review & Next Steps

*   The generated code will be reviewed for alignment with requirements, code quality, and integration potential.
*   Further iterations may be needed based on review feedback.
*   Backend API development for astrological data is a parallel or prerequisite task.
*   Integration with the actual Oracle card rendering and interpretation logic will be the subsequent step after this foundational astrological data integration is in place.