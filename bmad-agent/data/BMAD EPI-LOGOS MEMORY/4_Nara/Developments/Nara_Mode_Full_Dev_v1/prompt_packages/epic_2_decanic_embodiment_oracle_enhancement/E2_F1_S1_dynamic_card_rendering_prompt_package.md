# AI Builder Prompt Package: E2_F1_S1 - Dynamic Card Rendering: Decanic Archetypes & Psyche's Mirror

**Development Context:** Nara_Mode_Full_Dev_v1
**Epic:** 2 - Decanic Embodiment & Oracle Enhancement
**Feature:** F1 - Oracle Section Enhancement - Decanic Theater
**Story ID:** E2_F1_S1

## 1. Context & Goal

This prompt package is for the AI Builder (Claude 4) to generate the necessary frontend and backend components for User Story E2_F1_S1. The goal is to enhance the Oracle section by dynamically displaying or linking a drawn Tarot card to its Hermetic decanic association, revealing specific archetypal energies and fostering deeper self-understanding for the user. This involves mapping cards to decans, displaying this information in the UI, and ensuring the interpretation resonates psychologically.

## 2. Story Definition (from `story_E2_F1_S1_dynamic_card_rendering.md`)

**As a** User seeking deeper self-understanding through the Oracle,
**I want** any card I draw to visually display or clearly link to its Hermetic decanic association, revealing the specific archetypal energies (e.g., the 5 of Cups showing/linking to Venus in Scorpio's 3rd decan as a particular facet of the psyche's emotional landscape),
**So that** I can immediately understand the specific decanic influence shaping the card's meaning, recognizing it as a symbolic mirror reflecting potential inner dynamics, shadow aspects, or calls towards individuation, and glimpse the subtle play of consciousness (Spanda) manifesting through these archetypal patterns.

**Key Acceptance Criteria Highlights:**

*   System access to Tarot card-to-Hermetic decan mapping (archetypal influence).
*   Clear display of decanic association (e.g., "Venus in Scorpio - 3rd Decan: Archetype of Intense Emotional Processing") on or near the card image, or via an interactive link.
*   If linked, interaction reveals relevant Hermetic decanic imagery/text for reflection.
*   Accurate Hermetic Tarot correspondences, interpreted with Jungian psychological resonance.
*   Clear, intuitive, and seamlessly integrated UI presentation enhancing symbolic depth.
*   Responsive and accessible design.
*   Subtle evocation of the decan as a specific 'flavor' of consciousness.

## 3. Technical Context

*   **Frontend:** React, TypeScript, Next.js (Assumed, confirm with project defaults)
*   **Styling:** Tailwind CSS (Assumed, confirm with project defaults)
*   **State Management:** Zustand or Redux (Assumed, confirm with project defaults)
*   **UI/UX Specifications:** Defined in `docs/design/ui-ux-spec.md`. Key aspects include:
    *   Oracle section UI for card display.
    *   Emphasis on symbolic "reading" and interpretive dialogue.
    *   Dynamic card rendering and integration of archetypal symbols.
    *   Responsive design for various screen sizes.
*   **Backend:** Node.js, Express.js, MongoDB (Assumed for data storage, confirm with project defaults)
*   **API Interaction:** Frontend will need to fetch decanic mapping data and potentially imagery/text descriptions.
*   **Data Source:** A comprehensive dataset mapping Tarot cards to Hermetic decanic associations (planet, sign, decan number) is crucial. This might be a JSON file, a database collection, or fetched via an external API.
*   **BPMCP Integration:** Data related to decans, archetypes, and card meanings will likely be sourced via the Bimba-Pratibimba Memory Control Plane (BPMCP) from underlying databases like Neo4j (for `bimba_map` relations) or MongoDB.
*   **Epic Context (`epic-2.md`):** This story is part of transforming the Oracle into a "decanic theater," integrating real-time astrological conditions and user's archetypal foundation. This specific story focuses on the foundational decanic association of the card itself.

## 4. Constraints & Assumptions

*   **AI Builder:** Claude 4
*   **Primary Tarot System:** Thoth Deck or Rider-Waite-Smith will be the default for decanic attributions.
*   **Decanic Data Availability:** Assume a structured data source (e.g., JSON file or API endpoint) is available or will be created, providing: Card Name, Decan Name (e.g., "Venus in Scorpio - 3rd Decan"), Archetypal Keywords/Themes, (Optional) Associated Imagery URL, (Optional) Reflective Text/Prompts.
*   **Existing Oracle UI:** Assume a basic Oracle UI exists where cards are drawn and displayed. This story enhances that display.
*   **Focus:** This story is on the static Hermetic decanic association. Real-time astrological integration and natal chart cross-referencing are for subsequent stories (E2_F1_S2, E2_F1_S3).

## 5. Inputs for AI Builder (Claude 4)

1.  **This Prompt Package Document.**
2.  **User Story File:** `story_E2_F1_S1_dynamic_card_rendering.md`
3.  **Epic Definition File:** `docs/epics/epic-2.md`
4.  **UI/UX Specification File:** `docs/design/ui-ux-spec.md`
5.  **(Assumption) Sample Decanic Data Structure:**
    ```json
    [
      {
        "card_name": "5 of Cups",
        "decan_association": "Venus in Scorpio - 3rd Decan",
        "archetype_description": "Archetype of Intense Emotional Processing and Confronting Loss for Deeper Understanding",
        "keywords": ["loss", "grief", "emotional depth", "transformation through sorrow", "reassessment"],
        "imagery_url_placeholder": "/images/decans/venus_scorpio_3.png",
        "reflective_prompt": "How might current feelings of disappointment be inviting a deeper look into what truly holds value?"
      }
      // ... more card mappings
    ]
    ```

## 6. Expected Outputs from AI Builder (Code & Explanations)

### Frontend (React/TypeScript/Next.js)

1.  **`DecanDisplay` Component:**
    *   Receives `cardName` (or `cardId`) as a prop.
    *   Fetches decanic information for the given card from a data source (e.g., a local JSON, or an API endpoint).
    *   Displays the decanic association (text) clearly on or near the card.
    *   If applicable, includes an icon/link to reveal more detailed imagery/text.
    *   Handles loading and error states gracefully.
    *   Styled according to `ui-ux-spec.md` and Tailwind CSS.
2.  **Integration into existing Oracle Card Component:** Show how `DecanDisplay` is integrated into the component that renders a drawn Tarot card.
3.  **(Optional) `DecanModal` or `DecanPopover` Component:** If detailed information is shown on interaction, provide this component to display imagery and reflective text.
4.  **State Management Logic (Zustand/Redux):** If necessary, for managing decanic data or UI state related to decan display.
5.  **API Call Logic:** Functions to fetch decanic data (if from an API).
6.  **Type Definitions:** TypeScript interfaces for decanic data.

### Backend (Node.js/Express.js - if decanic data is served via a new API endpoint)

1.  **API Endpoint (`/api/decans/:cardName` or `/api/decanic-info`):**
    *   Retrieves decanic information for a given card from the data source (e.g., MongoDB collection or JSON file).
    *   Returns data in the format specified in section 5.
2.  **Data Model/Schema (MongoDB):** If storing decanic data in MongoDB, provide the Mongoose schema.
3.  **Service/Controller Logic:** To handle the request and data retrieval.

### Data

1.  **Sample `decanic_mappings.json` file:** A small, illustrative JSON file with 5-10 card-to-decan mappings, following the structure in section 5.

### Explanations

*   Clear explanation of how the components work together.
*   How to integrate the new components into an existing Next.js application.
*   Assumptions made during code generation.
*   Suggestions for further development or improvements.

## 7. Detailed Prompt for AI Builder (Claude 4)

```
Primary Goal: Implement User Story E2_F1_S1 - Dynamic Card Rendering for Decanic Archetypes in the Nara Oracle.

Refer to the provided context: this prompt package, `story_E2_F1_S1_dynamic_card_rendering.md`, `epic-2.md`, and `ui-ux-spec.md`.

Your task is to generate the necessary frontend (React/TypeScript/Next.js with Tailwind CSS) and, if applicable, backend (Node.js/Express.js/MongoDB) code to achieve the following:

1.  **Frontend Development:**
    *   Create a reusable React component (`DecanDisplay`) that takes a `cardName` (or `cardId`) as a prop.
    *   This component should fetch or look up the Hermetic decanic association for the card (e.g., "Venus in Scorpio - 3rd Decan: Archetype of Intense Emotional Processing"). Assume the decanic data (including archetypal description, keywords, optional imagery URL, and reflective prompt) is available from a source (you can initially mock this with a local JSON, or design an API call).
    *   Display this decanic association text clearly and aesthetically on or immediately adjacent to a conceptual Tarot card image placeholder. The display should be intuitive and enhance symbolic depth as per the UI/UX spec.
    *   Implement a mechanism (e.g., a small icon or a designated area) that, upon user interaction (hover or click), can reveal more detailed information: relevant Hermetic decanic imagery (use a placeholder if no actual images are provided) and a brief reflective text/prompt related to the decan's archetypal significance.
    *   Ensure the component is responsive and accessible.
    *   Provide an example of how this `DecanDisplay` component would be integrated into an existing (hypothetical) `TarotCard` component that displays the main card image.
    *   Define necessary TypeScript types/interfaces for the decanic data.
    *   If global state management (e.g., Zustand) is beneficial for caching decanic data, illustrate its setup and usage for this feature.

2.  **Data Handling:**
    *   Create a sample `decanic_mappings.json` file containing data for at least 5 Tarot cards. Each entry should include: `card_name`, `decan_association` (text), `archetype_description`, `keywords` (array of strings), `imagery_url_placeholder` (string), and `reflective_prompt` (string).
    *   Show how the `DecanDisplay` component would consume this data (either directly from the JSON for now, or by fetching from an API endpoint if you design one).

3.  **Backend Development (Optional - if you propose an API for decanic data):**
    *   If you deem an API endpoint necessary for serving decanic data (e.g., if it were stored in a database):
        *   Define a Node.js/Express.js API endpoint (e.g., `/api/decans/:cardName`) that retrieves and returns the decanic information for a given card from a data source (e.g., the `decanic_mappings.json` file or a conceptual MongoDB collection).
        *   If using MongoDB, provide a Mongoose schema for the decanic data.

4.  **Guidance and Explanation:**
    *   Explain the structure of your solution, how the components interact, and how to integrate them.
    *   Clearly state any assumptions made (e.g., structure of existing components, availability of specific libraries not mentioned).
    *   Adhere to the technical stack: React, TypeScript, Next.js, Tailwind CSS for frontend. Node.js, Express.js, MongoDB for backend (if creating API).
    *   Focus on clarity, modularity, and adherence to the story's acceptance criteria and the UI/UX principles outlined in the provided documents.

Remember to provide complete, runnable code snippets where applicable, and ensure your explanations are thorough. The goal is to provide a developer with a strong foundation to implement this feature.
```

## 8. Review & Follow-up

*   Ensure all acceptance criteria from the story are addressed.
*   Verify alignment with `epic-2.md` and `ui-ux-spec.md`.
*   Check for clarity and completeness of the generated code and explanations.
*   The EFDD `E2_F1_EFDD.md` was not found and is not a critical input for this specific story's prompt package generation.