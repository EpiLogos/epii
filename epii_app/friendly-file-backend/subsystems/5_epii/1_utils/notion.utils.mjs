/**
 * Utility functions for working with Notion in the Epii Analysis Pipeline.
 * These functions provide a consistent interface for formatting data for Notion,
 * with proper validation and error handling.
 */

/**
 * Formats a text property for Notion.
 *
 * @param {string} text - The text to format
 * @returns {object} - The formatted text property
 */
export function formatTextProperty(text) {
    return {
        title: [
            {
                type: "text",
                text: {
                    content: text || ""
                }
            }
        ]
    };
}

/**
 * Formats a rich text property for Notion.
 *
 * @param {string} text - The text to format
 * @returns {object} - The formatted rich text property
 */
export function formatRichTextProperty(text) {
    return {
        rich_text: [
            {
                type: "text",
                text: {
                    content: text || ""
                }
            }
        ]
    };
}

/**
 * Formats a select property for Notion.
 *
 * @param {string} value - The value to select
 * @returns {object} - The formatted select property
 */
export function formatSelectProperty(value) {
    return {
        select: {
            name: value || ""
        }
    };
}

/**
 * Formats a multi-select property for Notion.
 *
 * @param {Array<string>} values - The values to select
 * @returns {object} - The formatted multi-select property
 */
export function formatMultiSelectProperty(values) {
    if (!values || !Array.isArray(values)) {
        return { multi_select: [] };
    }

    return {
        multi_select: values.map(value => ({
            name: value
        }))
    };
}

/**
 * Formats a number property for Notion.
 *
 * @param {number} value - The number value
 * @returns {object} - The formatted number property
 */
export function formatNumberProperty(value) {
    return {
        number: value !== undefined && value !== null ? Number(value) : null
    };
}

/**
 * Formats a date property for Notion.
 *
 * @param {string|Date} date - The date value
 * @returns {object} - The formatted date property
 */
export function formatDateProperty(date) {
    if (!date) {
        return { date: null };
    }

    const dateString = date instanceof Date ? date.toISOString() : date;

    return {
        date: {
            start: dateString
        }
    };
}

/**
 * Formats a checkbox property for Notion.
 *
 * @param {boolean} checked - The checkbox value
 * @returns {object} - The formatted checkbox property
 */
export function formatCheckboxProperty(checked) {
    return {
        checkbox: Boolean(checked)
    };
}

/**
 * Formats a relation property for Notion.
 *
 * @param {Array<string>} pageIds - The page IDs to relate to
 * @returns {object} - The formatted relation property
 */
export function formatRelationProperty(pageIds) {
    if (!pageIds || !Array.isArray(pageIds)) {
        return { relation: [] };
    }

    return {
        relation: pageIds.map(id => ({
            id: id.replace(/-/g, '')
        }))
    };
}

/**
 * Formats a status property for Notion.
 *
 * @param {string} value - The status value
 * @returns {object} - The formatted status property
 */
export function formatStatusProperty(value) {
    return {
        status: {
            name: value || ""
        }
    };
}

/**
 * Formats a content type property for Notion.
 *
 * @param {string} contentType - The content type value
 * @returns {object} - The formatted content type property
 */
export function formatContentTypeProperty(contentType) {
    return formatSelectProperty(contentType);
}

/**
 * Formats a paragraph block for Notion.
 *
 * @param {string} text - The text content
 * @returns {object} - The formatted paragraph block
 */
export function formatParagraphBlock(text) {
    return {
        object: "block",
        type: "paragraph",
        paragraph: {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content: text || ""
                    }
                }
            ]
        }
    };
}

/**
 * Formats a heading block for Notion.
 *
 * @param {string} text - The heading text
 * @param {number} level - The heading level (1-3)
 * @returns {object} - The formatted heading block
 */
export function formatHeadingBlock(text, level = 1) {
    const headingType = `heading_${Math.min(Math.max(level, 1), 3)}`;

    return {
        object: "block",
        type: headingType,
        [headingType]: {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content: text || ""
                    }
                }
            ]
        }
    };
}

/**
 * Formats a bulleted list item block for Notion.
 *
 * @param {string} text - The list item text
 * @returns {object} - The formatted bulleted list item block
 */
export function formatBulletedListItemBlock(text) {
    return {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content: text || ""
                    }
                }
            ]
        }
    };
}

/**
 * Formats a numbered list item block for Notion.
 *
 * @param {string} text - The list item text
 * @returns {object} - The formatted numbered list item block
 */
export function formatNumberedListItemBlock(text) {
    return {
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content: text || ""
                    }
                }
            ]
        }
    };
}

/**
 * Formats a code block for Notion.
 *
 * @param {string} code - The code content
 * @param {string} language - The code language
 * @returns {object} - The formatted code block
 */
export function formatCodeBlock(code, language = "javascript") {
    return {
        object: "block",
        type: "code",
        code: {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content: code || ""
                    }
                }
            ],
            language: language
        }
    };
}

/**
 * Formats a callout block for Notion.
 *
 * @param {string} text - The callout text
 * @param {string} emoji - The callout emoji
 * @returns {object} - The formatted callout block
 */
export function formatCalloutBlock(text, emoji = "📝") {
    return {
        object: "block",
        type: "callout",
        callout: {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content: text || ""
                    }
                }
            ],
            icon: {
                type: "emoji",
                emoji: emoji
            }
        }
    };
}

/**
 * Formats a divider block for Notion.
 *
 * @returns {object} - The formatted divider block
 */
export function formatDividerBlock() {
    return {
        object: "block",
        type: "divider",
        divider: {}
    };
}

/**
 * Formats a toggle block for Notion.
 *
 * @param {string} text - The toggle text
 * @param {Array<object>} children - The toggle children blocks
 * @returns {object} - The formatted toggle block
 */
export function formatToggleBlock(text, children = []) {
    return {
        object: "block",
        type: "toggle",
        toggle: {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content: text || ""
                    }
                }
            ],
            children: children
        }
    };
}

/**
 * Converts markdown content to Notion blocks.
 * This is a simplified version that handles basic markdown elements.
 *
 * @param {string} markdown - The markdown content
 * @returns {Array<object>} - The Notion blocks
 */
export function markdownToNotionBlocks(markdown) {
    if (!markdown) return [];

    const blocks = [];
    const lines = markdown.split('\n');

    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) {
            i++;
            continue;
        }

        // Heading
        if (line.startsWith('#')) {
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s+/, '');
            blocks.push(formatHeadingBlock(text, level));
        }
        // Bulleted list
        else if (line.startsWith('- ') || line.startsWith('* ')) {
            const text = line.replace(/^[-*]\s+/, '');
            blocks.push(formatBulletedListItemBlock(text));
        }
        // Numbered list
        else if (/^\d+\.\s+/.test(line)) {
            const text = line.replace(/^\d+\.\s+/, '');
            blocks.push(formatNumberedListItemBlock(text));
        }
        // Code block
        else if (line.startsWith('```')) {
            const language = line.replace('```', '').trim() || 'plain text';
            let code = '';
            i++;

            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                code += lines[i] + '\n';
                i++;
            }

            blocks.push(formatCodeBlock(code, language));
        }
        // Paragraph
        else {
            blocks.push(formatParagraphBlock(line));
        }

        i++;
    }

    return blocks;
}

/**
 * Finds a callout block containing the specified text in the page content.
 *
 * @param {Array} blocks - The page blocks
 * @param {string} searchText - The text to search for
 * @returns {object|null} - The callout block or null if not found
 */
export function findCalloutBlock(blocks, searchText) {
    if (!blocks || !Array.isArray(blocks)) return null;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (block.type === 'callout') {
            const richText = block.callout.rich_text;
            if (richText && richText.length > 0) {
                const text = richText.map(rt => rt.plain_text || rt.text?.content || '').join('');
                if (text.includes(searchText)) {
                    return {
                        block,
                        index: i
                    };
                }
            }
        }

        // Check children if they exist
        if (block.has_children && block.children) {
            const foundInChildren = findCalloutBlock(block.children, searchText);
            if (foundInChildren) return foundInChildren;
        }
    }

    return null;
}

/**
 * Generates a Notion update payload for the analysis results.
 * This is the enhanced version that matches the parameters passed in stage_minus0.mjs.
 *
 * @param {string} synthesis - The synthesis text
 * @param {Array} coreElements - The core elements
 * @param {Array} allMappings - All mappings
 * @param {Array} allVariations - All variations
 * @param {Array} allTags - All tags
 * @param {object} sourceMetadata - The source metadata
 * @param {string} [documentContent] - The document content (optional)
 * @param {object} epiiLLMService - The Epii LLM service
 * @param {object} [tracingRun] - Optional tracing run for LangSmith
 * @param {object} [relationalProperties] - Optional relational properties extracted from the document
 * @returns {Promise<object>} - A promise resolving to the Notion update payload
 */
/**
 * Generates a Notion update payload for a document analysis.
 *
 * @param {string} synthesis - The synthesized analysis of the document
 * @param {Array} coreElements - The core elements extracted from the document
 * @param {Array} allMappings - The mappings extracted from the document
 * @param {Array} allVariations - The variations identified in the document
 * @param {Array} allTags - The tags generated from the document
 * @param {object} sourceMetadata - Metadata about the source document
 * @param {string} [documentContent] - The content of the document (optional)
 * @param {object} epiiLLMService - The Epii LLM service
 * @param {object} [tracingRun] - Optional tracing run for LangSmith
 * @param {object} [relationalProperties] - Relational properties including QL Operators, Epistemic Essence, Archetypal Anchors, and Semantic Framework
 * @param {object} [state] - Additional state information (optional)
 * @returns {Promise<object>} - A promise resolving to the Notion update payload
 * @throws {Error} - If any required parameter is missing or invalid
 */
export async function generateNotionUpdatePayload(
    synthesis,
    coreElements,
    allMappings,
    allVariations,
    allTags,
    sourceMetadata,
    documentContent,
    epiiLLMService,
    tracingRun,
    relationalProperties = {},
    state = null
) {
    try {
        // Validate required parameters
        if (!synthesis || typeof synthesis !== 'string') {
            throw new Error("Invalid synthesis: must be a non-empty string");
        }
        if (!coreElements || !Array.isArray(coreElements)) {
            throw new Error("Invalid coreElements: must be an array");
        }
        if (!allMappings || !Array.isArray(allMappings)) {
            throw new Error("Invalid allMappings: must be an array");
        }
        if (!allVariations || !Array.isArray(allVariations)) {
            throw new Error("Invalid allVariations: must be an array");
        }
        if (!allTags || !Array.isArray(allTags)) {
            throw new Error("Invalid allTags: must be an array");
        }
        if (!sourceMetadata || !sourceMetadata.targetCoordinate) {
            throw new Error("Invalid sourceMetadata: targetCoordinate is required");
        }

        // Ensure relationalProperties has the expected structure
        if (!relationalProperties || typeof relationalProperties !== 'object') {
            relationalProperties = {
                qlOperators: [],
                epistemicEssence: [],
                archetypalAnchors: [],
                semanticFramework: []
            };
        } else {
            // Ensure all required properties exist
            relationalProperties.qlOperators = Array.isArray(relationalProperties.qlOperators) ? relationalProperties.qlOperators : [];
            relationalProperties.epistemicEssence = Array.isArray(relationalProperties.epistemicEssence) ? relationalProperties.epistemicEssence : [];
            relationalProperties.archetypalAnchors = Array.isArray(relationalProperties.archetypalAnchors) ? relationalProperties.archetypalAnchors : [];
            relationalProperties.semanticFramework = Array.isArray(relationalProperties.semanticFramework) ? relationalProperties.semanticFramework : [];
        }

        console.log(`Generating Notion update payload for ${sourceMetadata.targetCoordinate}...`);

        // Create properties update
        const properties = {};

        // Update Status property to "Analyzed" (only if it exists on the page)
        properties["Status"] = formatStatusProperty("Analyzed");

        // REMOVED: Non-existent properties that were causing validation errors
        // These properties don't exist on Notion pages and should be in content blocks instead:
        // - "Analysis Status" - redundant with Status
        // - "Analysis Date" - can be inferred from page update time
        // - "Mappings Count" - redundant, count is in content blocks
        // - "Variations Count" - redundant, count is in content blocks
        // - "Tags" - will be handled separately if the property exists

        // REMOVED: Tags property - doesn't exist on Notion pages
        // Tags information is included in the content blocks instead
        // if (allTags && allTags.length > 0) {
        //     properties["Tags"] = formatMultiSelectProperty(allTags);
        // }

        // Create content blocks for the analysis
        const contentBlocks = [];

        // Add summary section
        contentBlocks.push(formatHeadingBlock("Analysis Summary", 2));
        contentBlocks.push(formatParagraphBlock(synthesis));

        // Add core elements section
        if (coreElements.length > 0) {
            contentBlocks.push(formatHeadingBlock("Core Elements", 2));

            coreElements.forEach(element => {
                const elementType = element.elementType || 'Element';
                const elementContent = element.content || element.text || element.description || '';

                if (elementContent) {
                    contentBlocks.push(formatHeadingBlock(elementType, 3));
                    contentBlocks.push(formatParagraphBlock(elementContent));
                }
            });
        }

        // Add mappings section
        if (allMappings.length > 0) {
            contentBlocks.push(formatHeadingBlock("Extracted Mappings", 2));

            allMappings.forEach(mapping => {
                const mappingType = mapping.mappingType || mapping.type || 'Mapping';
                const mappingValue = mapping.mappingValue || mapping.value || 'Not specified';

                contentBlocks.push(formatHeadingBlock(mappingType, 3));
                contentBlocks.push(formatBulletedListItemBlock(`Value: ${mappingValue}`));

                if (mapping.reasoning || mapping.rationale) {
                    contentBlocks.push(formatBulletedListItemBlock(`Reasoning: ${mapping.reasoning || mapping.rationale}`));
                }

                if (mapping.confidenceScore) {
                    contentBlocks.push(formatBulletedListItemBlock(`Confidence: ${mapping.confidenceScore.toFixed(2)}`));
                }

                // Add target coordinate if available
                if (mapping.targetCoordinate && mapping.targetCoordinate !== sourceMetadata.targetCoordinate) {
                    contentBlocks.push(formatBulletedListItemBlock(`Target Coordinate: ${mapping.targetCoordinate}`));
                }
            });
        }

        // Add variations section
        if (allVariations.length > 0) {
            contentBlocks.push(formatHeadingBlock("Identified Variations", 2));

            allVariations.forEach(variation => {
                const variationType = variation.variationType || variation.type || 'Variation';
                const status = variation.status || 'Unresolved';

                contentBlocks.push(formatHeadingBlock(variationType, 3));
                contentBlocks.push(formatBulletedListItemBlock(`Status: ${status}`));

                const variationText = variation.variationText || variation.text || variation.description;
                if (variationText) {
                    contentBlocks.push(formatBulletedListItemBlock(`Text: ${variationText}`));
                }

                const resolution = variation.proposedResolution || variation.resolution;
                if (resolution) {
                    contentBlocks.push(formatBulletedListItemBlock(`Proposed Resolution: ${resolution}`));
                }
            });
        }

        // Add relational properties section
        const hasRelationalProperties =
            relationalProperties.qlOperators.length > 0 ||
            relationalProperties.epistemicEssence.length > 0 ||
            relationalProperties.archetypalAnchors.length > 0 ||
            relationalProperties.semanticFramework.length > 0;

        if (hasRelationalProperties) {
            contentBlocks.push(formatHeadingBlock("Relational Properties", 2));

            // Add QL Operators
            if (relationalProperties.qlOperators.length > 0) {
                contentBlocks.push(formatHeadingBlock("💠 QL Operators", 3));
                relationalProperties.qlOperators.forEach(operator => {
                    contentBlocks.push(formatBulletedListItemBlock(operator));
                });
            }

            // Add Epistemic Essence
            if (relationalProperties.epistemicEssence.length > 0) {
                contentBlocks.push(formatHeadingBlock("📚 Epistemic Essence", 3));
                relationalProperties.epistemicEssence.forEach(concept => {
                    contentBlocks.push(formatBulletedListItemBlock(concept));
                });
            }

            // Add Archetypal Anchors
            if (relationalProperties.archetypalAnchors.length > 0) {
                contentBlocks.push(formatHeadingBlock("⚕️ Archetypal Anchors", 3));
                relationalProperties.archetypalAnchors.forEach(symbol => {
                    contentBlocks.push(formatBulletedListItemBlock(symbol));
                });
            }

            // Add Semantic Framework
            if (relationalProperties.semanticFramework.length > 0) {
                contentBlocks.push(formatHeadingBlock("🕸️ Semantic Framework", 3));
                relationalProperties.semanticFramework.forEach(relation => {
                    contentBlocks.push(formatBulletedListItemBlock(relation));
                });
            }
        }

        // Add context window content if available
        if (state && state.contextWindow && state.contextWindow.contextText) {
            // Add a divider
            contentBlocks.push(formatDividerBlock());

            // Add context window section
            contentBlocks.push(formatHeadingBlock("Analysis Context Window", 2));

            // Add context window as a toggle block
            contentBlocks.push({
                object: "block",
                type: "toggle",
                toggle: {
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: "Click to view the full context window used for analysis"
                            }
                        }
                    ],
                    children: [
                        {
                            object: "block",
                            type: "paragraph",
                            paragraph: {
                                rich_text: [
                                    {
                                        type: "text",
                                        text: {
                                            content: state.contextWindow.contextText || ""
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            });
        }

        // Create the final payload with enhanced data
        const notionUpdatePayload = {
            targetCoordinate: sourceMetadata.targetCoordinate,
            title: `Analysis of ${sourceMetadata.sourceFileName || 'Document'}`,
            properties,
            contentBlocks,
            // Include context window reference
            contextWindow: state?.contextWindow ? {
                contextText: state.contextWindow.contextText,
                bimbaContext: state.contextWindow.bimbaContext,
                qlContext: state.contextWindow.qlContext
            } : null,
            // Include timestamp
            timestamp: new Date().toISOString()
        };

        // Validate the payload before returning
        if (!notionUpdatePayload.targetCoordinate) {
            throw new Error("Generated payload is missing targetCoordinate");
        }

        if (!notionUpdatePayload.title) {
            throw new Error("Generated payload is missing title");
        }

        if (!notionUpdatePayload.properties || Object.keys(notionUpdatePayload.properties).length === 0) {
            throw new Error("Generated payload has no properties");
        }

        if (!notionUpdatePayload.contentBlocks || notionUpdatePayload.contentBlocks.length === 0) {
            throw new Error("Generated payload has no content blocks");
        }

        // Log success with payload size
        const payloadSize = JSON.stringify(notionUpdatePayload).length;
        console.log(`Successfully generated Notion update payload for ${sourceMetadata.targetCoordinate} (${payloadSize} bytes)`);
        console.log(`Payload contains ${notionUpdatePayload.contentBlocks.length} content blocks`);

        if (hasRelationalProperties) {
            console.log(`Included relational properties: QL Operators (${relationalProperties.qlOperators.length}), Epistemic Essence (${relationalProperties.epistemicEssence.length}), Archetypal Anchors (${relationalProperties.archetypalAnchors.length}), Semantic Framework (${relationalProperties.semanticFramework.length})`);
        }

        // Update tracing run if available
        if (tracingRun && typeof tracingRun.end === 'function') {
            try {
                tracingRun.end({
                    output: {
                        targetCoordinate: sourceMetadata.targetCoordinate,
                        payloadSize,
                        numContentBlocks: contentBlocks.length,
                        numMappings: allMappings.length,
                        numVariations: allVariations.length,
                        numTags: allTags.length,
                        hasRelationalProperties,
                        numQLOperators: relationalProperties.qlOperators.length,
                        numEpistemicEssence: relationalProperties.epistemicEssence.length,
                        numArchetypalAnchors: relationalProperties.archetypalAnchors.length,
                        numSemanticFramework: relationalProperties.semanticFramework.length
                    }
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
        }

        return notionUpdatePayload;
    } catch (error) {
        // Log error with details
        console.error(`Error generating Notion update payload for ${sourceMetadata?.targetCoordinate || 'unknown coordinate'}:`, error);

        // Categorize the error for better debugging
        let errorType = 'GENERAL_ERROR';
        let errorMessage = error.message;

        if (errorMessage.includes('targetCoordinate')) {
            errorType = 'COORDINATE_ERROR';
        } else if (errorMessage.includes('properties')) {
            errorType = 'PROPERTIES_ERROR';
        } else if (errorMessage.includes('content')) {
            errorType = 'CONTENT_ERROR';
        }

        // Update tracing run if available
        if (tracingRun && typeof tracingRun.end === 'function') {
            try {
                tracingRun.end({
                    error: {
                        message: errorMessage,
                        type: errorType
                    }
                });
            } catch (tracingError) {
                console.warn(`LangSmith tracing error: ${tracingError.message}`);
            }
        }

        // Throw a more descriptive error
        throw new Error(`Failed to generate Notion update payload [${errorType}]: ${errorMessage}`);
    }
}
