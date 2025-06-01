# AI Builder Prompt Package: E4_F4_S2 - Real-Time Astrological Service Integration

## 1. Overview

**Story ID:** E4_F4_S2
**Epic:** 4 - Nara Agent Core & Coordination: The Orchestrating Intelligence
**Feature:** F4 - External Service & Data Integration
**Project:** Nara Mode Full Dev v1 (Epi-Logos)
**Objective:** Integrate Nara with one or more real-time astrological calculation services to access current planetary positions, aspects, and other relevant astrological data. This data, viewed as symbolic indicators of active archetypal forces (Jung) and the vibratory energy of consciousness (Spanda/Saivism), will be used to incorporate timely astrological influences into Oracle readings, decanic lifestyle suggestions, and other guidance, aiding the user's individuation and awareness of transpersonal patterns.

## 2. Story Definition

**As a** Nara agent, attuned to the subtle interplay between the individual psyche (Pramata) and the cosmos (Paramashiva),
**I want** to integrate with one or more real-time astrological calculation services to access current planetary positions, aspects, and other relevant astrological data—viewed as symbolic indicators of active archetypal forces (Jung) and the ever-present vibratory energy of consciousness (Spanda),
**So that** I can incorporate these timely astrological influences (as reflections of synchronicity and the cosmic Lila) into Oracle readings, decanic lifestyle suggestions, and other contextually relevant guidance, helping the user navigate their individuation journey with greater awareness of the transpersonal patterns influencing their experience and supporting the recognition of their own divine play (Svatantrya).

## 3. Technical Context & Design Philosophy

*   **Focus:** Integration with external real-time astrological calculation services/APIs.
*   **Purpose of Data:** Provide timely astrological influences (planetary positions, aspects) for Oracle readings, decanic suggestions, etc.
*   **Interpretation Lens:** Symbolic indicators of active archetypal forces (Jungian) and vibratory energy of consciousness (Spanda - Saivist).
*   **Integration Layer:** An abstraction layer (within Nara or a microservice via BPMCP) to handle communication with the astrological service(s).
*   **Data Needs:** Current astrological data for a given time/location (tropical/sidereal positions, planets, aspects, Moon phase, planetary hours).
*   **Philosophical Grounding:** Attunement to cosmic rhythms, synchronicity, cosmic Lila, supporting individuation and Svatantrya.

## 4. Constraints and Challenges

*   **Service Selection:** Choosing a reliable, accurate, and cost-effective astrological service that provides data suitable for psychological and energetic interpretations.
*   **API Complexity:** Dealing with potentially complex APIs from astrological services.
*   **Data Standardization:** Transforming varied data formats from different services into a consistent internal format for Nara.
*   **Real-time Reliability:** Ensuring consistent access to real-time data and handling service outages or errors gracefully.
*   **Cost Management:** Managing API call costs if using commercial services.
*   **Terms of Service:** Adhering to the terms of use for any third-party APIs.

## 5. Inputs for AI Builder (Illustrative)

1.  **User Story:** (This document)
2.  **List of Potential Astrological Services/APIs:** Research on services like Swiss Ephemeris, Astrodienst, or open-source libraries, including their capabilities, data formats, and access methods.
3.  **Specific Data Requirements from Dependent Features:** (e.g., from E2_F1_S2, E2_F2_S2) - what exact astrological data points are needed (e.g., planetary longitudes, house cusps, aspect orbs).
4.  **Nara's Internal Data Model for Astrological Data:** How Nara will store and represent astrological information.
5.  **Example Use Cases for Astrological Data:**
    *   *Oracle Reading:* User asks for guidance. Nara fetches current planetary aspects to inform the Oracle's interpretation.
    *   *Decanic Lifestyle Suggestion:* Nara determines the current solar decan and fetches associated planetary rulers/influences to suggest relevant activities or reflections.
    *   *Planetary Hour Guidance:* Nara identifies the current planetary hour to suggest opportune timing for specific inner work.

## 6. Expected Outputs from AI Builder (Integration Design & Implementation Plan)

1.  **Astrological Service Evaluation Matrix and Recommendation:**
    *   A comparative analysis of 2-3 potential astrological services/APIs based on accuracy, reliability, cost, data range, ease of integration, and suitability for Jungian/Saivist interpretations.
    *   A clear recommendation for the service(s) to integrate.
2.  **Service Integration Layer Architecture Design:**
    *   Diagram and description of the integration layer (whether part of Nara, a microservice, or using BPMCP).
    *   How it handles API authentication, request formatting, and response parsing for the chosen service(s).
3.  **API Client Implementation Details (for the chosen service):**
    *   Code structure for making requests (e.g., for current planetary positions for a given time/location).
    *   Data mapping logic to translate raw API responses into Nara's standardized internal astrological data format.
4.  **Data Request Specification:**
    *   Precise definition of the astrological data points Nara needs to request (e.g., specific planets, aspect types, coordinate systems, house systems).
5.  **Error Handling and Fallback Strategy:**
    *   Detailed plan for managing API errors (timeouts, unavailability, invalid data).
    *   Logic for fallback mechanisms (e.g., using cached data, default values, notifying Nara of data staleness).
6.  **Caching Mechanism Design:**
    *   Strategy for caching frequently requested astrological data (e.g., current planetary positions).
    *   Cache update frequency, invalidation rules, and storage mechanism.
7.  **Configuration Management Plan:**
    *   How API keys, service endpoints, and other parameters will be securely stored and accessed by Nara or the integration layer.
8.  **Testing Plan:** Test cases for verifying API communication, data accuracy, parsing, error handling, and caching.

## 7. Prompt for Generative AI

```
As a Senior AI Engineer with expertise in integrating external APIs, real-time data processing, and a nuanced understanding of astrology's symbolic application in psychological (Jungian) and spiritual (Saivist) contexts, you are tasked with designing the integration of real-time astrological calculation services with the Nara agent. This is based on User Story E4_F4_S2.

Nara requires access to current planetary positions, aspects, and other astrological data to incorporate these timely cosmic influences (seen as archetypal dynamics/Spanda) into its guidance for users on their individuation journey (Svatantrya, Lila). The integration should be robust, reliable, and provide data amenable to deep symbolic interpretation.

Based on the provided story, conceptual inputs (potential services, data needs from other features, Nara's data models), and example use cases, deliver a comprehensive integration design and implementation plan covering:

1.  **Astrological Service Evaluation and Recommendation:** Analyze 2-3 potential astrological services/APIs (considering accuracy, reliability, cost, data range, and interpretative suitability). Recommend the most appropriate service(s).
2.  **Service Integration Layer Architecture:** Design the abstraction layer (within Nara, as a microservice, or via BPMCP) that will manage communication with the chosen astrological service(s), including authentication, request formatting, and response parsing.
3.  **API Client Implementation Details:** Outline the code structure for making requests to the chosen service(s) and the logic for mapping raw API responses to Nara's standardized internal astrological data format.
4.  **Data Request Specification:** Define the precise astrological data points Nara will need to request (e.g., planets, aspects, coordinate systems) for its various functions.
5.  **Error Handling and Fallback Strategy:** Detail how API errors will be managed and define fallback mechanisms if real-time data is unavailable (e.g., using cached data, defaults).
6.  **Caching Mechanism Design:** Propose a strategy for caching astrological data to optimize performance and reduce API calls, including update frequency and invalidation.
7.  **Configuration Management Plan:** Describe how API keys and service parameters will be securely managed.
8.  **Testing Plan:** Outline test cases to validate the integration's functionality, data accuracy, and error handling.

Your design should ensure Nara can reliably access and utilize real-time astrological data, transforming raw celestial information into meaningful symbolic insights for the user.
```