# AI Builder Prompt Package: Epic 1 - Story E1.F3.S1: User Onboarding Flow Design & Initial Mahamaya Ground Introduction

**Context:** 4_Nara / Nara_Mode_Full_Dev_v1
**Epic:** Epic 1: Mahamaya Ground Implementation: The 64-Fold Archetypal Foundation
**Feature:** User Onboarding Design & Implementation
**Sub-Feature:** Design and Implement Initial Onboarding Steps for Mahamaya Ground Data Collection
**AI Builder Target:** Augment Code (Claude 4)

## 1. Story Definition

This story focuses on designing and implementing the initial steps of the first-time user experience (FTUE) for Nara. The primary goal of this initial onboarding phase is to guide users through the process of providing the necessary information to populate the first few layers of their Mahamaya Ground, specifically focusing on birthdata collection for the "Birthdate Encoding" and "Astrological Natal Chart" layers.

The onboarding should be engaging, clear, and allow users to understand the purpose of the information they are providing. It should also allow users to complete it in stages.

**Acceptance Criteria:**

*   **AC1 (Frontend - UI/UX Design):** Clear and intuitive UI/UX design for the initial onboarding flow, consistent with `ui-ux-spec.md`. Includes screens for Welcome, Birth Date, Birth Time (with 'unknown' option), Birth Location (with picker/autocomplete).
*   **AC2 (Frontend - Implementation):** Onboarding screens implemented as functional UI components.
*   **AC3 (Frontend - Data Input & Validation):** User input for birth date, time, and location captured and validated.
*   **AC4 (Backend - Data Submission):** Validated birth data securely submitted to the backend to create/update user's Mahamaya Matrix.
*   **AC5 (Frontend - Progress Indication & Navigation):** Clear progress indication and back navigation.
*   **AC6 (Frontend - Save & Continue Later):** System allows saving progress and resuming later; onboarding completion tracked.
*   **AC7 (Frontend - Clarity of Purpose):** Each step explains why information is needed.
*   **AC8 (Responsiveness & Accessibility):** UI is responsive and adheres to WCAG 2.1 AA (as per `ui-ux-spec.md`).

## 2. Technical Context

**From Epic 1: Mahamaya Ground Implementation:**

*   User onboarding guides users through the six #0 layers, starting with birthdate for encoding and natal chart.
*   Users can complete onboarding in stages.
*   The Mahamaya Ground is presented in the "Identity Dynamics" section.

**From Architecture Documents (feature-context-bimba-alignment-package_Part1.md & Part2.md):**

*   **System Architecture:** Frontend (Vue.js, Quasar), Back-to-Front (Node.js, Express), Backend (Python, Flask/FastAPI).
*   **Frontend Target Directory:** `/epii_app/friendly-file-front/src/`
*   **Key Frontend Components for this story:** Likely within `/epii_app/friendly-file-front/src/pages/Onboarding/` or `/epii_app/friendly-file-front/src/components/Onboarding/`. Vue components for each step, state management (Pinia/Vuex), API service for submitting data.
*   **Back-to-Front Layer:** Will handle API requests from the frontend and route them to the backend. `/epii_app/friendly-file-back2front/`.
*   **Backend Layer:** Will receive data, perform validation, and interact with MongoDB to store Mahamaya Matrix data (as per E1.F2.S1). `/epii_app/friendly-file-backend/`.
*   **Communication:** Frontend calls B2F API, B2F calls Backend API (AG-UI and A2A protocols).

**Dependency:** `ui-ux-spec.md` - This document is crucial for UI/UX consistency. **The AI Builder will need its content or key guidelines from it.**

## 3. Constraints & Considerations

*   **UI/UX:** Must be consistent with `ui-ux-spec.md`.
*   **Location Picker/Geocoding:** Requires a service (e.g., Google Places, Mapbox). API key security is vital.
*   **Time Zone Handling:** Critical for accuracy. Use libraries like `moment-timezone` or `date-fns-tz`.
*   **User Experience:** First impression; must be smooth and encouraging.
*   **Modularity:** Design for future onboarding steps.
*   **Error Handling:** Clear feedback for validation/API errors.
*   **Security:** HTTPS for data transmission.
*   **Handling Unknown Birth Time:** Clearly communicate implications to the user.
*   **Save & Continue Later Flow:** Define how users are reminded/guided back.
*   **EFDD Not Found:** The Feature Definition Document (E1_F3_EFDD.md) was not available.

## 4. Inputs to AI Builder (Claude 4 - Augment Code)

*   Story description, acceptance criteria, and tasks for E1.F3.S1.
*   Key UI/UX guidelines from `ui-ux-spec.md` (or the full document if available and parsable by the AI).
*   Details on the chosen geocoding service (if decided) or request for suggestions with pros/cons.
*   Data structure for birth details to be submitted to the backend (compatible with E1.F2.S1).
*   Target directory structure within `/epii_app/friendly-file-front/src/`.
*   API endpoint details on the B2F layer for submitting onboarding data.

## 5. Expected Outputs from AI Builder

1.  **Frontend UI Component Structure (Vue.js with Quasar framework):
    *   Vue component files (`.vue`) for each onboarding step (Welcome, Birth Date, Birth Time, Birth Location).
    *   Basic HTML structure and Quasar components within each file.
    *   Props definition and event handling setup.
2.  **Frontend State Management (Pinia or Vuex - specify preference or ask AI to choose and justify):
    *   Store setup for managing onboarding form data and current step.
    *   Actions/mutations for updating state and handling data submission.
3.  **Input Validation Logic (Client-side):
    *   JavaScript/TypeScript functions or library usage (e.g., Vuelidate) for validating birth date, time, and location inputs.
4.  **Geocoding Service Integration (Frontend):
    *   Example code for integrating a geocoding service (e.g., Google Places API or Mapbox API) for the birth location input. Include how to handle API keys securely (e.g., via B2F proxy or environment variables for frontend build if unavoidable).
    *   Logic to derive latitude, longitude, and timezone from the selected location.
5.  **API Integration (Frontend Service):
    *   A JavaScript/TypeScript service module (e.g., `onboardingService.js`) to handle API calls to the B2F layer for submitting onboarding data.
6.  **Backend Onboarding State Tracking (Conceptual - Python/MongoDB):
    *   Suggestions or conceptual model for how the backend (Python/MongoDB) should track user onboarding progress (e.g., a field in the user's Mahamaya Matrix document).
7.  **Explanatory Copy Snippets (Frontend):
    *   Placeholder text or suggestions for the explanatory copy for each onboarding step.
8.  **Documentation Snippets (Markdown):
    *   Brief overview of the frontend onboarding components and state management.
    *   Notes on geocoding service integration and API key handling.

## 6. Detailed Prompt for AI Builder (Claude 4 - Augment Code)

```
As an AI Code Augmentation assistant (Claude 4), your task is to help implement the frontend components and related logic for Story E1.F3.S1: User Onboarding Flow Design, within the Nara project.

**Project Context:**
Nara uses Vue.js with the Quasar framework for its frontend, located in `/epii_app/friendly-file-front/src/`. The backend is Python/Flask/FastAPI, and there's a Node.js/Express Back-to-Front (B2F) layer. This story focuses on the initial user onboarding steps to collect birth details.

**Story Goal:** Design and implement engaging and clear UI/UX for collecting birth date, time, and location. This data will populate the user's Mahamaya Ground. The flow must allow saving progress and resuming later.

**Key UI/UX Guidelines (Assume these are from `ui-ux-spec.md` - adapt if actual spec is provided later):
*   **Visual Style:** Modern, clean, intuitive, with a calming and mystical aesthetic.
*   **Layout:** Responsive, mobile-first design.
*   **Components:** Utilize Quasar components where possible for consistency (e.g., `q-input`, `q-date`, `q-time`, `q-select`, `q-stepper` for flow).
*   **Accessibility:** Adhere to WCAG 2.1 AA.

**Key Requirements from Story & Technical Context:**

1.  **Onboarding Steps (Vue Components):
    *   **Welcome Screen:** Introduction to Nara and Mahamaya Ground.
    *   **Birth Date Input:** Year, Month, Day (e.g., using `q-date`).
    *   **Birth Time Input:** Hour, Minute (e.g., using `q-time`). Include an option/checkbox for 'Birth time unknown/approximate' and explain its impact on accuracy.
    *   **Birth Location Input:** City, Country. Integrate a geocoding service (e.g., Mapbox Geocoding API - suggest this or an alternative with free tier) for autocomplete and to derive latitude, longitude, and timezone. Handle API key securely.

2.  **Frontend State Management (Pinia is preferred for Vue 3):
    *   Set up a Pinia store for onboarding data (birthDate, birthTime, birthLocation {city, country, lat, lon, timezone}, unknownTimeFlag) and current step.
    *   Implement actions to update data and submit to the B2F API.

3.  **Input Validation (Client-side):
    *   Validate date, time, and location inputs. Provide clear error messages.

4.  **API Submission:
    *   Create a service to POST the collected and validated birth details to a B2F endpoint (e.g., `/api/onboarding/birth-details`).

5.  **Save & Continue Later / Progress Tracking:
    *   The Pinia store should manage the state of completion for these initial steps.
    *   Conceptually, how would the backend be informed of this progress (e.g., a field in the user's Mahamaya Matrix like `onboarding_step_completed`).

**Expected Output Structure:**

Organize your response into the following sections. Provide runnable Vue.js/Pinia code where applicable, assuming a project structure within `/epii_app/friendly-file-front/src/` (e.g., `pages/OnboardingPage.vue`, `components/onboarding/WelcomeStep.vue`, etc., `stores/onboardingStore.js`).

1.  **Vue Component Structure (`.vue` files - provide key snippets or full basic structure):
    *   `OnboardingPage.vue` (parent component, possibly using `q-stepper`).
    *   `WelcomeStep.vue`
    *   `BirthDateStep.vue`
    *   `BirthTimeStep.vue`
    *   `BirthLocationStep.vue` (including geocoding integration - show Mapbox example if possible, or Google Places).
2.  **Pinia Store (`onboardingStore.js`):
    *   State definition, getters, actions (including API call).
3.  **Geocoding Service Integration Details:
    *   Example of integrating Mapbox Geocoding API (or chosen alternative) in `BirthLocationStep.vue`.
    *   How to handle the API key (e.g., suggest B2F proxy for actual calls, or frontend env var for client-side SDK if necessary, noting security implications).
4.  **API Service (`services/onboardingService.js`):
    *   Function to call the B2F API.
5.  **Conceptual Backend Progress Tracking (Markdown):
    *   Brief description of how the backend might store onboarding progress.
6.  **Explanatory Copy Placeholders (Markdown):
    *   Suggestions for brief, engaging text for each step explaining its purpose.

**Focus on providing practical, runnable Vue.js and Pinia code. Clearly state any assumptions (e.g., B2F API endpoint structure).**
Assume the developer has Vue 3, Quasar, and Pinia set up.
Provide guidance on secure API key handling for the geocoding service.
```