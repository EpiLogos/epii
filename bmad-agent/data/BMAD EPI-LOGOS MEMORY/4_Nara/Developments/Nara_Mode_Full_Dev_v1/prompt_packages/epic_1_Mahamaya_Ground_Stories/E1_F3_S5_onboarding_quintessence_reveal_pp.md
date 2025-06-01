# AI Builder Prompt Package: User Onboarding - Archetypal Quintessence Reveal

**Story:** E1.F3.S5: User Onboarding - Archetypal Quintessence Reveal
**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** User Onboarding Design & Implementation
**AI Builder Target:** Augment Code (Claude 4)

## 1. Overall Context from Epic & Feature

This story is the culmination of the initial user onboarding flow for the Mahamaya Ground. The user has already provided birth data, completed a Jungian assessment, and been introduced to their Gene Keys, Human Design, and I Ching layers. The primary goal of Epic 1 is to establish the foundational symbolic architecture for Nara, with the Mahamaya Ground (and its synthesized Archetypal Quintessence) being central to the user's unique existential signature. This step focuses on revealing this synthesized identity to the user in an impactful way, marking a key transition point.

The `ui-ux-spec.md` emphasizes a design that facilitates transformative dialogue, with the Identity Dynamics section (housing the Mahamaya Ground) acting as a living archetypal map. The Quintessence reveal should be a significant moment, consistent with Nara's branding and UI principles, including responsiveness and accessibility.

## 2. Story Definition (from `story_E1_F3_S5_onboarding_quintessence_reveal.md`)

**Goal:** Design and implement a UI screen (or series of screens) that presents the user's "Archetypal Quintessence" – the synthesized persona derived from all preceding data (as per Story 1.7) – in an engaging and meaningful way. This includes its visual representation (e.g., custom tarot card, glyph, avatar) and a concise explanation of what it represents and how it was formed.

**Key Acceptance Criteria:**
*   **AC1 (Frontend - UI/UX Design):** Compelling and clear UI/UX for revealing the Archetypal Quintessence, consistent with `ui-ux-spec.md`.
*   **AC2 (Frontend - Visual Representation Display):** UI effectively displays the visual representation of the user's Quintessence.
*   **AC3 (Frontend - Explanatory Text):** UI presents a concise, insightful textual summary of the Quintessence.
*   **AC4 (Backend - Data Retrieval):** Frontend retrieves the user's calculated Archetypal Quintessence data (visual references and textual summary) from the backend.
*   **AC5 (Frontend - Connection to Previous Layers):** Presentation subtly reinforces how the Quintessence is a culmination of previous layers.
*   **AC6 (Frontend - Call to Explore):** UI encourages exploration of the full Mahayana Ground and other Nara features.
*   **AC7 (Frontend - Onboarding Completion):** This step may mark the completion of core Mahamaya Ground onboarding, transitioning the user.
*   **AC8 (Responsiveness & Accessibility):** Adherence to `ui-ux-spec.md` standards.

## 3. Technical Context & Design System

*   **Frontend Framework:** Assume React with TypeScript (or as previously established for the project).
*   **State Management:** Assume a solution like Redux, Zustand, or Context API is in use.
*   **Styling:** Assume CSS-in-JS (e.g., Styled Components) or Tailwind CSS, consistent with `ui-ux-spec.md`.
*   **UI/UX Specification:** Adhere strictly to `/Users/admin/Documents/Epi-Logos_Seed_Files/bmad-agent/data/BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/docs/design/ui-ux-spec.md`. This includes principles of quaternary logic, dynamic triad, personalized archetypal map, rich symbolic environment, reflective mirror, recursive interface design, and multimodal experience where applicable.
*   **Component Library:** Utilize existing components from the project's design system. If new, specific components are needed for the Quintessence reveal (e.g., a special card display, animated reveal sequence), they should be designed to be reusable and align with the overall system.
*   **API Interaction:** The frontend will need to make API calls to fetch the Archetypal Quintessence data. Assume RESTful or GraphQL endpoints.
*   **BPMCP Components:** While the story focuses on frontend, the data originates from backend processes (Story 1.7) likely involving BPMCP for data orchestration from MongoDB (Mahamaya Matrix) and potentially Bimba (for universal symbolic interpretations if relevant to the Quintessence explanation).

## 4. Constraints & Assumptions

*   **Constraint:** The visual representation and textual summary of the Archetypal Quintessence are pre-calculated by backend logic (Story 1.7) and available via an API endpoint.
*   **Constraint:** The UI must be highly engaging and impactful, marking a significant moment for the user.
*   **Assumption:** The exact format of the visual Quintessence (e.g., tarot card image URL, SVG data, parameters for a generative avatar) and the structure of the textual summary will be defined by the API response from the backend (Story 1.7).
*   **Assumption:** The `ui-ux-spec.md` provides sufficient guidance for visual design, interaction patterns, and branding.
*   **Assumption:** The transition point after this reveal (e.g., to a main dashboard or the "Identity Dynamics" section) is defined or will be handled by routing logic.

## 5. Inputs for AI Builder (Claude 4)

1.  **Story File:** `story_E1_F3_S5_onboarding_quintessence_reveal.md` (content provided above).
2.  **Epic File:** `epic-1.md` (for overarching context, summarized above).
3.  **UI/UX Specification:** `ui-ux-spec.md` (key aspects summarized above, full path: `/Users/admin/Documents/Epi-Logos_Seed_Files/bmad-agent/data/BMAD EPI-LOGOS MEMORY/4_Nara/Developments/Nara_Mode_Full_Dev_v1/docs/design/ui-ux-spec.md`).
4.  **Assumed API Endpoint for Quintessence Data:** `/api/user/quintessence` (GET request, returns JSON with fields like `visual_url`, `visual_alt_text`, `title`, `summary_html`, `key_components: [{name, description}]`).
5.  **Assumed Visual Format:** The `visual_url` will point to an image (e.g., a custom tarot card). The UI should display this image prominently.

## 6. Expected Outputs from AI Builder

1.  **Frontend Code (React/TypeScript components):**
    *   A main component for the Quintessence reveal screen (e.g., `QuintessenceRevealScreen.tsx`).
    *   Sub-components for displaying the visual representation (e.g., `QuintessenceVisual.tsx`).
    *   Sub-components for displaying the textual explanation (e.g., `QuintessenceText.tsx`).
    *   Components for any interactive elements or animations for the reveal (e.g., a staged reveal animation).
2.  **State Management Logic:** (e.g., Redux actions/reducers, Zustand store slice, or Context API logic) for:
    *   Fetching the Quintessence data from the API.
    *   Managing loading and error states.
    *   Storing the fetched Quintessence data.
    *   Potentially updating a global onboarding state to mark this step as complete.
3.  **API Call Implementation:** Service function to call the `/api/user/quintessence` endpoint.
4.  **Styling:** CSS-in-JS or Tailwind CSS classes adhering to `ui-ux-spec.md`.
5.  **Routing/Navigation:** Placeholder or example of how to navigate to this screen and transition away from it upon completion (e.g., using React Router).
6.  **Unit Test Stubs:** Basic test stubs for the created components and state logic.

## 7. Detailed Prompt for Claude 4

```prompt
As an expert frontend developer, your task is to implement the "Archetypal Quintessence Reveal" screen for the Nara application's user onboarding flow, based on Story E1.F3.S5. This is a critical and impactful moment for the user, marking the culmination of their initial Mahamaya Ground setup.

**Project Context:**
*   **Application:** Nara - a platform for symbolic interpretation and transformative dialogue.
*   **Framework:** React with TypeScript.
*   **Styling:** [Specify chosen styling solution, e.g., Styled Components or Tailwind CSS].
*   **State Management:** [Specify chosen state management, e.g., Redux Toolkit, Zustand, or React Context API].
*   **UI/UX Guidelines:** Strictly adhere to the provided `ui-ux-spec.md`. Key aspects include creating a compelling, clear, responsive, and accessible UI. The design should feel significant and align with Nara's branding. Refer to the `ui-ux-spec.md` for principles like quaternary logic, dynamic triad, personalized archetypal map, rich symbolic environment, reflective mirror, recursive interface design, and multimodal experience where applicable to this screen.

**Story Goal:**
Design and implement a UI screen (or series of screens) that presents the user's "Archetypal Quintessence" – the synthesized persona derived from all preceding data – in an engaging and meaningful way. This includes its visual representation (e.g., custom tarot card, glyph, avatar) and a concise explanation of what it represents and how it was formed.

**Key Requirements (from Story E1.F3.S5 & `ui-ux-spec.md`):**
1.  **Quintessence Data Retrieval:** Fetch the user's Archetypal Quintessence data from the backend API endpoint: `GET /api/user/quintessence`. Assume the API returns JSON like: `{
    "visual_url": "https://example.com/path/to/quintessence-image.png",
    "visual_alt_text": "Your Archetypal Quintessence Visual",
    "title": "The Weaver of Worlds",
    "summary_html": "<p>You are the Weaver of Worlds, a unique synthesis of...</p>",
    "key_components": [
        {"name": "Dominant Element: Fire", "description": "Your core energy is driven by passion and transformation."},
        {"name": "Key Gene Key: 25th - Universal Love", "description": "Your path involves embracing acceptance and unconditional love."}
    ]
}`.
2.  **Visual Representation Display:** Prominently display the visual representation of the Quintessence (e.g., an image from `visual_url`). Ensure it's presented in an aesthetically pleasing and impactful manner.
3.  **Textual Explanation:** Clearly present the `title`, `summary_html` (render HTML safely), and `key_components` of the Quintessence. The explanation should be concise, insightful, and subtly reinforce how it's a culmination of previous onboarding steps.
4.  **Impactful Reveal:** Design the reveal to be a significant moment. Consider subtle animations or a staged presentation if appropriate and aligned with `ui-ux-spec.md`.
5.  **Call to Explore:** Include a clear call to action encouraging the user to explore their full Mahayana Ground and other Nara features now that their foundational identity is established (e.g., a button "Explore Your Nara").
6.  **Onboarding Completion & Transition:** This step may mark the completion of the core Mahamaya Ground onboarding. Implement logic to (or show where to integrate logic for) updating the global onboarding state. Implement or suggest routing to transition the user to the main application dashboard or the "Identity Dynamics" section upon completion.
7.  **Responsiveness & Accessibility:** Ensure the screen is fully responsive and adheres to WCAG 2.1 AA accessibility standards as per `ui-ux-spec.md`.

**Deliverables:**
1.  **React/TypeScript Components:**
    *   `QuintessenceRevealScreen.tsx`: The main container component for this screen.
    *   `QuintessenceVisual.tsx`: Component to display the visual (e.g., image).
    *   `QuintessenceText.tsx`: Component to display the title, summary, and key components.
    *   (Optional) Components for any reveal animations or special UI elements.
2.  **State Management Logic:** Code for fetching data, managing loading/error states, and storing Quintessence data using [Chosen State Management].
3.  **API Service Function:** A function to make the GET request to `/api/user/quintessence`.
4.  **Styling:** Implement styles using [Chosen Styling Solution], ensuring they are consistent with `ui-ux-spec.md`.
5.  **Routing:** Show how this screen would be integrated into React Router, including navigation to it and away from it.
6.  **Test Stubs:** Basic Jest/React Testing Library stubs for the created components.

**Instructions:**
*   Organize the code clearly into logical files and folders.
*   Prioritize readability, maintainability, and adherence to React best practices.
*   Use placeholder content for text where appropriate, but structure it to match the expected API response.
*   Comment your code where necessary, especially for complex logic or design decisions related to `ui-ux-spec.md`.
*   Assume necessary utility functions (e.g., for safe HTML rendering) are available or create simple stubs.

Begin by outlining the structure of your components and state logic, then proceed with the implementation.
```

## 8. Review & Validation Notes

*   Verify that the generated UI is compelling and aligns with the significance of the Quintessence reveal.
*   Check for correct data fetching and display from the mock API structure.
*   Ensure the UI is responsive across common breakpoints.
*   Validate accessibility features (e.g., alt text for images, keyboard navigation for interactive elements).
*   Confirm that the transition to the next part of the application is handled correctly.
*   Ensure the explanation of the Quintessence is clear and reinforces its connection to previous onboarding steps.
*   Code should be clean, well-commented, and follow project conventions.