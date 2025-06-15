import bpMCPService from '../../../databases/bpmcp/bpMCP.service.mjs';

/**
 * Service for retrieving and working with MEF (Metalogikon Epistemic Framework) templates
 * from the Bimba graph.
 */
class MEFTemplatesService {
  constructor() {
    this.cachedTemplates = null;
    this.lastCacheTime = null;
    this.cacheExpiryMs = 3600000; // Cache expires after 1 hour
  }

  /**
   * Retrieve MEF templates from the Bimba graph
   * @param {boolean} forceRefresh - Whether to force a refresh of the cache
   * @returns {Promise<Array>} - Array of MEF templates
   */
  async getMEFTemplates(forceRefresh = false) {
    // Check if we have a valid cache
    const now = Date.now();
    if (
      !forceRefresh &&
      this.cachedTemplates &&
      this.lastCacheTime &&
      (now - this.lastCacheTime < this.cacheExpiryMs)
    ) {
      console.log("Using cached MEF templates");
      return this.cachedTemplates;
    }

    console.log("Retrieving MEF templates from Bimba graph");

    try {
      // Query to get MEF templates from coordinate #2-1 and its children
      const query = `
        MATCH (n)-[:HAS_CHILD*0..2]->(m)
        WHERE n.bimbaCoordinate = "#2-1"
        RETURN m.bimbaCoordinate as coordinate, m.title as title, m.description as content
        ORDER BY m.bimbaCoordinate
      `;

      const result = await bpMCPService.queryBimbaGraph(query);

      if (!result || !Array.isArray(result)) {
        throw new Error("Failed to retrieve MEF templates from Bimba graph");
      }

      // Process the results into a structured format
      const templates = result.map(record => ({
        coordinate: record.coordinate,
        title: record.title,
        content: record.content
      }));

      // Update cache
      this.cachedTemplates = templates;
      this.lastCacheTime = now;

      console.log(`Retrieved ${templates.length} MEF templates`);
      return templates;
    } catch (error) {
      console.error("Error retrieving MEF templates:", error);

      // If we have a cache, return it even if it's expired
      if (this.cachedTemplates) {
        console.log("Returning expired cache due to error");
        return this.cachedTemplates;
      }

      // Otherwise, return an empty array
      return [];
    }
  }

  /**
   * Format MEF templates for use in LLM prompts
   * @param {Array} templates - Array of MEF templates
   * @returns {string} - Formatted templates for LLM prompt
   */
  formatTemplatesForPrompt(templates) {
    if (!templates || templates.length === 0) {
      return "No MEF templates available.";
    }

    // Create a structured representation of the templates
    const formattedTemplates = templates.map(template => {
      return `
Coordinate: ${template.coordinate}
Title: ${template.title}
${template.content ? `Content: ${template.content.substring(0, 500)}${template.content.length > 500 ? '...' : ''}` : 'No content available.'}
      `.trim();
    }).join('\n\n');

    return `
MEF (Metalogikon Epistemic Framework) Templates:
${formattedTemplates}
    `.trim();
  }

  /**
   * Get MEF templates formatted for use in LLM prompts
   * @param {boolean} forceRefresh - Whether to force a refresh of the cache
   * @returns {Promise<string>} - Formatted templates for LLM prompt
   */
  async getFormattedMEFTemplates(forceRefresh = false) {
    const templates = await this.getMEFTemplates(forceRefresh);
    return this.formatTemplatesForPrompt(templates);
  }
}

// Create and export a singleton instance
const mefTemplatesService = new MEFTemplatesService();
export default mefTemplatesService;
