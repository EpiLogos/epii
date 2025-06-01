# AI Builder Prompt Package: E5_F4_S1 - Intuitive Navigation, Accessibility, and Clear Pathways

**Project:** Nara Concrescent Interface Development
**Epic:** E5 - Concrescent Interface Development: The Living Mandala
**Feature:** E5_F4 - Intuitive Interaction & Navigation
**Story ID:** E5_F4_S1 - Ensure Intuitive Navigation, Accessibility, and Clear Pathways for Prehending the Interface

## 1. Context Overview

This prompt package addresses the foundational requirement of ensuring the Nara application, despite its inherent complexity and dynamic, philosophically-rich nature (the "Living Mandala"), is intuitive to use, easy to navigate, and accessible to all users. The goal is to enable users to effortlessly "prehend" (grasp, understand, interact with) its diverse functionalities, facilitating their creative advance and self-understanding without cognitive overload.

## 2. Story Definition (from E5_F4_S1)

**As a** User (an experiencing subject with a subjective aim towards self-understanding),
**I want** the Nara interface, despite its rich features and dynamic nature (reflecting the complexity of actual occasions), to be intuitive to use, easy to navigate, and accessible,
**So that** I can effortlessly prehend and utilize all its functionalities (like advanced Oracle modes, Journal synthesis, Identity exploration) without feeling overwhelmed or lost, allowing for a smooth creative advance in my engagement with the system.

## 3. Technical & Philosophical Context

*   **Balancing Complexity and Usability:** Nara aims to be a "Living Mandala," reflecting complex psycho-spiritual processes. This richness must be presented through an interface that is clear and does not overwhelm the user.
*   **Prehension as a Core Concept:** The UI must facilitate the user's ability to positively prehend its offerings – to perceive them as relevant data for their own becoming and interact effectively.
*   **Accessibility as a Priority:** Adherence to accessibility standards (e.g., WCAG AA) is not an afterthought but a core design principle to ensure inclusivity.
*   **Foundation for All Features:** The success of all other UI features in Epic 5 (and Nara as a whole) depends on a solid foundation of intuitive navigation and accessibility.
*   **`ag-ui` Protocol:** The underlying `ag-ui` protocol may inform or support responsive and interactive UI elements, contributing to overall usability.

## 4. Constraints & Design Challenges

*   **Information Architecture for Complex Systems:** Designing a logical and understandable structure for a multi-faceted application with interconnected modules (Identity, Oracle, Journal).
*   **Consistent Navigation Across Dynamic Elements:** Maintaining consistent navigation patterns even as some UI elements might be dynamic or self-modifying (as per other Epic 5 stories).
*   **Discoverability of Advanced Features:** Ensuring users can find and understand how to use powerful but potentially less-obvious functionalities.
*   **Meeting WCAG AA Standards:** Systematically addressing requirements for keyboard navigation, screen reader compatibility, color contrast, text resizing, focus indicators, etc.
*   **Minimizing Cognitive Load:** Presenting information and options clearly to prevent user confusion or fatigue.
*   **Responsive Design:** Ensuring a seamless experience across various screen sizes and devices.
*   **Integrating Accessibility from Outset:** Avoiding the pitfalls of retrofitting accessibility.

## 5. Inputs for AI Builder

1.  **User Story Document:** `story_E5_F4_S1_intuitive_navigation_accessibility.md` (this document's source).
2.  **Nara Feature Overview:** Descriptions of core modules like Identity, Oracle (including advanced modes), Journal (including synthesis tools), and their intended interactions.
3.  **Existing UI Mockups/Wireframes (if any):** Any preliminary design artifacts for Nara.
4.  **Target User Personas (if defined):** Information about the intended users and their technical proficiency or accessibility needs.
5.  **`ag-ui` Protocol Specifications (if relevant):** Details of the `ag-ui` protocol that might influence UI component behavior or accessibility features.
6.  **WCAG 2.1/2.2 AA Guidelines:** The specific accessibility standards to be met.
7.  **List of Dynamic UI Elements:** Information on elements planned in other Epic 5 stories (e.g., phase indicators, Mahamaya motifs) that need to be considered within the overall navigation and accessibility framework.

## 6. Expected Outputs from AI Builder

1.  **Information Architecture (IA) Document:**
    *   Detailed sitemap of the Nara application.
    *   User flow diagrams for key tasks within each module (Identity, Oracle, Journal).
    *   Rationale for the IA choices, emphasizing clarity and logical progression.
2.  **Navigation Design Specification:**
    *   Detailed design for primary and secondary navigation systems (e.g., global menus, sidebars, tab bars).
    *   Specifications for breadcrumbs, back-button behavior, and in-page navigation.
    *   Design for search functionality, if applicable.
    *   Consistent labeling conventions.
3.  **Accessibility Compliance Plan & Design Guidelines (WCAG AA):**
    *   A comprehensive strategy for meeting WCAG AA standards.
    *   Specific design guidelines for:
        *   Keyboard navigation (tab order, focus management).
        *   Screen reader compatibility (ARIA attributes, semantic HTML).
        *   Color contrast ratios for text, UI elements, and dynamic indicators.
        *   Resizable text and adaptable/responsive layouts.
        *   Clear and consistent focus indicators.
        *   Accessible forms and interactive elements.
        *   Alternatives for non-text content (if any).
4.  **Responsive Design Strategy:**
    *   Definition of key breakpoints for desktop, tablet, and potentially mobile views.
    *   Guidelines for how content and navigation should adapt across these breakpoints.
5.  **Cognitive Load Reduction Strategies:**
    *   Principles for clear information presentation (e.g., progressive disclosure, chunking).
    *   Design for contextual help, tooltips, or onboarding cues where appropriate.
    *   Guidelines for minimizing visual clutter.
6.  **User Feedback Mechanism Design:**
    *   Specifications for visual, auditory, or haptic feedback for common user actions (e.g., clicks, saves, errors, loading states).
7.  **Basic Usability Testing Plan:**
    *   Outline of a simple usability testing protocol (e.g., key tasks, target user profiles for testing, methods for gathering feedback) to identify major pain points early.
8.  **Feature Discoverability Enhancement Plan:**
    *   Strategies for making advanced or less frequently used features discoverable (e.g., contextual prompts, clear labeling in menus, tutorials/guides).

## 7. Prompt for Generative AI

```
As a lead UI/UX architect and accessibility expert, you are tasked with defining the foundational navigation, interaction, and accessibility framework for the Nara application, as per User Story E5_F4_S1. Nara is a complex, philosophically-rich application aiming to be a "Living Mandala," yet it must be intuitive, easy to navigate, and fully accessible (WCAG AA).

**Objective:** Design an interface structure that allows users to effortlessly "prehend" and utilize all Nara functionalities (Identity, Oracle, Journal, etc.) without overwhelm, ensuring a smooth creative advance and adherence to accessibility best practices.

**Given Inputs (assume access to):**
1.  The full User Story E5_F4_S1.
2.  An overview of Nara's core modules (Identity, Oracle, Journal) and their key features/interactions.
3.  Any existing preliminary UI mockups or wireframes for Nara.
4.  The WCAG 2.1/2.2 AA guidelines.
5.  Information about other dynamic UI elements planned for Nara (e.g., concrescence phase indicators, Mahamaya motifs) that must coexist with the core navigation and accessibility features.

**Produce the Following Outputs (as detailed in Section 6 of the Prompt Package E5_F4_S1_prompt_package.md):

1.  **Information Architecture (IA) Document:** Deliver a sitemap and key user flow diagrams. Justify your IA choices for clarity and logical structure.

2.  **Navigation Design Specification:** Detail the primary/secondary navigation, breadcrumbs, back-button logic, and labeling conventions.

3.  **Accessibility Compliance Plan & Design Guidelines (WCAG AA):** Provide a comprehensive strategy and specific design guidelines for keyboard navigation, screen reader support (ARIA), color contrast, text resizing, focus indicators, and accessible forms. This is critical.

4.  **Responsive Design Strategy:** Define breakpoints and how navigation/content will adapt.

5.  **Cognitive Load Reduction Strategies:** Outline principles for clear information presentation and contextual help to minimize user confusion.

6.  **User Feedback Mechanism Design:** Specify how the UI will provide feedback for user actions.

7.  **Basic Usability Testing Plan:** Propose a simple plan to test key navigation and interaction flows.

8.  **Feature Discoverability Enhancement Plan:** Suggest methods to make advanced Nara features easily findable and understandable.

**Key Considerations for Your Design:**
*   **Clarity and Simplicity:** Prioritize ease of understanding and use above all else for core navigation.
*   **Accessibility First:** Integrate WCAG AA principles from the ground up in all design decisions.
*   **Consistency:** Ensure navigation patterns and interactions are consistent throughout the application.
*   **Scalability:** The IA and navigation should accommodate future growth in features.
*   **Harmony with Dynamic Elements:** Ensure that foundational navigation and accessibility are not compromised by, but rather harmoniously integrate with, the more dynamic and symbolic UI elements planned for Nara.
*   **Effortless Prehension:** The ultimate goal is for users to intuitively grasp and interact with the interface and its contents.

Present your response in a structured format, addressing each of the 8 output points comprehensively and with actionable detail.
```