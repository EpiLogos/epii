// epii_app/friendly-file-front/src/services/bimbaApi.ts

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Fetches suggested relationship types for a given parent coordinate.
 *
 * @param parentCoordinate - The bimbaCoordinate of the parent node.
 * @returns A promise that resolves to an array of suggested relationship strings.
 */
export const fetchSuggestedRelationshipTypeAPI = async (parentCoordinate: string): Promise<string[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/graph/suggest-relationship/${encodeURIComponent(parentCoordinate)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to fetch relationship suggestions: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    // Assuming the backend returns { suggestions: ['TYPE1', 'TYPE2'] }
    return data.suggestions || []; 
  } catch (error) {
    console.error('Error in fetchSuggestedRelationshipTypeAPI:', error);
    // In case of error, or if backend doesn't provide suggestions,
    // we don't want to break the modal. It has its own fallback.
    // So, return empty array or rethrow if specific error handling is needed upstream.
    return []; 
  }
};

/**
 * Creates a new node in the graph.
 *
 * @param nodeProperties - The properties of the new node (from initializeQLProperties).
 * @param parentCoordinate - The bimbaCoordinate of the parent node (or null if no parent).
 * @param relationType - The type of relationship to create with the parent.
 * @returns A promise that resolves with the backend's response data on successful creation.
 */
export const createNodeInGraphAPI = async (
  nodeProperties: object,
  parentCoordinate: string | null,
  relationType: string
): Promise<any> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/graph/node`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodeProperties,
        parentCoordinate,
        suggestedRelationType: relationType, // Matches backend controller expectation
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to create node: ${errorData.message || response.statusText}`);
    }

    return await response.json(); // Returns the backend response (e.g., { message: '...', data: ... })
  } catch (error) {
    console.error('Error in createNodeInGraphAPI:', error);
    throw error; // Rethrow to be caught by the calling component (CreateNodeModal)
  }
};

// Optional: If you have a central API client setup (e.g., using Axios), 
// you might integrate these calls into that client.
// For this subtask, direct fetch is used as per the current pattern in CreateNodeModal.
