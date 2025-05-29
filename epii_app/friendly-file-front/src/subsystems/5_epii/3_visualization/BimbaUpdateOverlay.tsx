/**
 * Bimba Update Overlay Component
 * Bimba Coordinate: #5-3-4.5-3-2
 *
 * Full-screen overlay for updating Bimba nodes with:
 * - Coordinate tree navigation
 * - Node property editing
 * - Relationship management
 * - File upload and LLM suggestions
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Sparkles, Save, FileText, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added Input import
import { useBimbaCoordinates, BimbaCoordinate, Document } from '../2_hooks/useBimbaCoordinates';
import { useGraphData } from '../2_hooks/useGraphData';
import { useDocumentUpload } from '../2_hooks/useEpiiDocument';
import RecursiveFullBimbaTree from './RecursiveFullBimbaTree';
import CreateNodeModal from './CreateNodeModal';

interface BimbaNode {
  coordinate: string;
  properties: Record<string, any>;
  labels: string[];
  relationships: Array<{
    type: string;
    properties: Record<string, any>;
    direction: 'incoming' | 'outgoing';
    relatedNode: {
      coordinate: string;
      title?: string;
      labels: string[];
    };
  }>;
}

interface LLMSuggestion {
  propertyUpdates: Record<string, any>;
  relationshipSuggestions: Array<{
    action: 'create' | 'update' | 'delete';
    type: string;
    targetCoordinate: string;
    properties: Record<string, any>;
    reasoning: string;
  }>;
  reasoning: string;
  qlAlignment: string;
}

interface SelectedFile {
  name: string;
  isExistingDoc: boolean;
  docId?: string;
  documentType?: 'bimba' | 'pratibimba';
  file?: File;
}

interface BimbaUpdateOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const BimbaUpdateOverlay: React.FC<BimbaUpdateOverlayProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCoordinate, setSelectedCoordinate] = useState<string | null>(null);
  const [nodeData, setNodeData] = useState<BimbaNode | null>(null);
  const [isLoadingNode, setIsLoadingNode] = useState(false);
  const [nodeError, setNodeError] = useState<string | null>(null);

  // Form state
  const [editedProperties, setEditedProperties] = useState<Record<string, any>>({});
  const [editedRelationships, setEditedRelationships] = useState<Array<any>>([]);

  // Change tracking state
  const [originalProperties, setOriginalProperties] = useState<Record<string, any>>({});
  const [originalRelationships, setOriginalRelationships] = useState<Array<any>>([]);
  const [pendingChanges, setPendingChanges] = useState<Map<string, any>>(new Map());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [allCoordinateChanges, setAllCoordinateChanges] = useState<Map<string, any>>(new Map());
  const [globalChangeCount, setGlobalChangeCount] = useState(0);

  // LLM suggestion state
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [llmSuggestions, setLLMSuggestions] = useState<LLMSuggestion | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [coordinateDocuments, setCoordinateDocuments] = useState<any[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  // Update state
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Create node modal state
  const [showCreateNodeModal, setShowCreateNodeModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get coordinates for the tree
  const { coordinates, isLoading: isLoadingCoordinates, error: coordinatesError } = useBimbaCoordinates();

  // Get full graph data using the existing hook
  const { nodes, edges, isLoading: isLoadingGraph, error: graphError } = useGraphData();

  // Expanded nodes state for the tree
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Change tracking utilities
  const saveChangesToCache = (coordinate: string, changes: Map<string, any>) => {
    const cacheKey = `bimba-changes-${coordinate}`;
    const changesObj = Object.fromEntries(changes);
    localStorage.setItem(cacheKey, JSON.stringify(changesObj));
  };

  const loadChangesFromCache = (coordinate: string): Map<string, any> => {
    const cacheKey = `bimba-changes-${coordinate}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const changesObj = JSON.parse(cached);
        return new Map(Object.entries(changesObj));
      } catch (e) {
        console.warn('Failed to parse cached changes:', e);
      }
    }
    return new Map();
  };

  const clearChangesFromCache = (coordinate: string) => {
    const cacheKey = `bimba-changes-${coordinate}`;
    localStorage.removeItem(cacheKey);
  };

  const isPropertyChanged = (key: string, value: any): boolean => {
    const original = originalProperties[key];
    return JSON.stringify(original) !== JSON.stringify(value);
  };

  const isRelationshipChanged = (index: number, relationship: any): boolean => {
    const original = originalRelationships[index];
    return JSON.stringify(original) !== JSON.stringify(relationship);
  };

  // Collect all changes across all coordinates for review
  const collectAllChanges = (): Map<string, any> => {
    const allChanges = new Map();

    // Get all cached changes from localStorage
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('bimba-changes-')) {
        const coordinate = key.replace('bimba-changes-', '');
        try {
          const changes = JSON.parse(localStorage.getItem(key) || '{}');
          if (Object.keys(changes).length > 0) {
            allChanges.set(coordinate, changes);
          }
        } catch (e) {
          console.warn(`Failed to parse changes for ${coordinate}:`, e);
        }
      }
    }

    return allChanges;
  };

  const openReviewModal = () => {
    const allChanges = collectAllChanges();
    setAllCoordinateChanges(allChanges);
    setShowReviewModal(true);
  };

  // Create graph data structure for the tree component
  const fullGraphData = React.useMemo(() => {
    if (!nodes || !edges) return null;
    return {
      nodes: nodes,
      links: edges  // RecursiveFullBimbaTree expects 'links' property
    };
  }, [nodes, edges]);

  // Fetch node data and documents when coordinate is selected
  useEffect(() => {
    if (selectedCoordinate) {
      fetchNodeData(selectedCoordinate);
      loadCoordinateDocuments(selectedCoordinate);
    }
  }, [selectedCoordinate]);

  // Update global change count on mount and when localStorage changes
  useEffect(() => {
    const updateGlobalCount = () => {
      const globalChanges = collectAllChanges();
      const totalChanges = Array.from(globalChanges.values()).reduce((total, changes) => total + Object.keys(changes).length, 0);
      setGlobalChangeCount(totalChanges);
    };

    updateGlobalCount();

    // Listen for localStorage changes (from other tabs/windows)
    window.addEventListener('storage', updateGlobalCount);

    return () => {
      window.removeEventListener('storage', updateGlobalCount);
    };
  }, []);

  // Load documents for the selected coordinate from cache
  const loadCoordinateDocuments = async (coordinate: string) => {
    // Skip loading for non-coordinate nodes
    if (coordinate.startsWith('node-')) {
      setCoordinateDocuments([]);
      return;
    }

    setIsLoadingDocuments(true);
    try {
      // Import document cache service
      const documentCacheService = (await import('../1_services/documentCacheService')).default;

      // Get documents from cache ONLY - no MongoDB fallback
      const cachedBimbaDocuments = documentCacheService.getDocumentsByCoordinate(coordinate, 'Documents');
      const cachedPratibimbaDocuments = documentCacheService.getDocumentsByCoordinate(coordinate, 'pratibimbaDocuments');

      // Combine both document types
      const documents = [
        ...cachedBimbaDocuments.map(doc => ({ ...doc, documentType: 'bimba' })),
        ...cachedPratibimbaDocuments.map(doc => ({ ...doc, documentType: 'pratibimba' }))
      ];

      // Standardize document format
      const formattedDocs = documents.map(doc => ({
        id: doc._id || doc.id,
        name: doc.name || doc.originalName || doc.fileName || 'Unnamed Document',
        lastModified: new Date(doc.uploadDate || doc.lastModified),
        bimbaCoordinate: doc.targetCoordinate || doc.bimbaCoordinate,
        documentType: doc.documentType,
        hasContent: !!(doc.content || doc.textContent)
      }));

      setCoordinateDocuments(formattedDocs);
      console.log(`Loaded ${formattedDocs.length} documents for coordinate ${coordinate} from cache`);

    } catch (error) {
      console.error('Error loading coordinate documents:', error);
      setCoordinateDocuments([]);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const fetchNodeData = async (coordinate: string) => {
    if (!fullGraphData) {
      setNodeError('Graph data not loaded');
      return;
    }
    setIsLoadingNode(true);
    setNodeError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

      // Check if this is a node without bimba coordinate (starts with 'node-')
      const isNonCoordinateNode = coordinate.startsWith('node-');
      const nodeId = isNonCoordinateNode ? coordinate.replace('node-', '') : null;

      let query: string;
      let params: any;

      if (isNonCoordinateNode) {
        // Query by node ID for nodes without coordinates
        query = `
          MATCH (n) WHERE toString(id(n)) = $nodeId
          WITH n
          OPTIONAL MATCH (n)-[r]-(related)
          WITH n, collect(DISTINCT {
            source: toString(id(startNode(r))),
            target: toString(id(endNode(r))),
            type: type(r),
            properties: properties(r)
          }) as links
          RETURN {
            nodes: [n { .*, id: toString(id(n)), labels: labels(n) }],
            links: links
          } AS graphData
        `;
        params = { nodeId };
      } else {
        // Query by bimba coordinate for coordinate nodes
        query = `
          MATCH (n) WHERE n.bimbaCoordinate = $coordinate
          WITH n
          OPTIONAL MATCH (n)-[r]-(related)
          WITH n, collect(DISTINCT {
            source: toString(id(startNode(r))),
            target: toString(id(endNode(r))),
            type: type(r),
            properties: properties(r)
          }) as links
          RETURN {
            nodes: [n { .*, id: toString(id(n)), labels: labels(n) }],
            links: links
          } AS graphData
        `;
        params = { coordinate };
      }

      const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: 'queryBimbaGraph',
          args: { query, params }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch node data: ${response.statusText}`);
      }

      const result = await response.json();

      // queryBimbaGraph returns the data directly in the expected format
      if (!result || !result.nodes || result.nodes.length === 0) {
        throw new Error('Bimba node not found');
      }

      const targetNode = result.nodes[0];
      const relationships = result.links || [];

      // Format relationships for our UI using the already-loaded graph data
      const formattedRelationships = relationships.map((link: any) => {
        const isOutgoing = link.source === targetNode.id;
        const relatedNodeId = isOutgoing ? link.target : link.source;

        // Look up the related node from the already-loaded graph data
        const relatedNode = fullGraphData?.nodes.find(n => n.id === relatedNodeId);

        let relatedNodeInfo = {
          coordinate: 'unknown',
          title: 'Unknown',
          labels: []
        };

        if (relatedNode) {
          relatedNodeInfo = {
            coordinate: relatedNode.bimbaCoordinate || `node-${relatedNode.id}`,
            title: relatedNode.name || relatedNode.title || relatedNode.label || `Node ${relatedNode.id}`,
            labels: relatedNode.labels || []
          };
        }

        return {
          type: link.type,
          properties: link.properties || {},
          direction: isOutgoing ? 'outgoing' : 'incoming',
          relatedNode: relatedNodeInfo
        };
      });

      // Format the data to match our expected structure
      const nodeData = {
        coordinate: targetNode.bimbaCoordinate || coordinate,
        properties: targetNode,
        labels: targetNode.labels,
        relationships: formattedRelationships
      };

      setNodeData(nodeData);

      // Store original values for change tracking
      setOriginalProperties({ ...nodeData.properties });
      setOriginalRelationships([...nodeData.relationships]);

      // Load any cached changes for this coordinate
      const cachedChanges = loadChangesFromCache(coordinate);

      // Apply cached changes to properties
      const propertiesWithChanges = { ...nodeData.properties };
      for (const [key, value] of cachedChanges) {
        if (key.startsWith('prop_')) {
          const propKey = key.replace('prop_', '');
          propertiesWithChanges[propKey] = value;
        }
      }

      setEditedProperties(propertiesWithChanges);
      setEditedRelationships([...nodeData.relationships]);
      setPendingChanges(cachedChanges);
      setHasUnsavedChanges(cachedChanges.size > 0);

    } catch (error) {
      console.error('Error fetching node data:', error);
      setNodeError(error instanceof Error ? error.message : 'Failed to fetch node data');
    } finally {
      setIsLoadingNode(false);
    }
  };

  const handleNodeSelect = (node: any) => {
    // Allow selection of any node, but handle differently based on whether it has a coordinate
    if (node.bimbaCoordinate) {
      setSelectedCoordinate(node.bimbaCoordinate);
    } else {
      // For nodes without coordinates, use their ID as a pseudo-coordinate
      setSelectedCoordinate(`node-${node.id}`);
    }

    // Clear previous state
    setSelectedFile(null);
    setLLMSuggestions(null);
    setSuggestionError(null);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  // Handle node creation completion
  const handleNodeCreated = async (newCoordinate: string) => {
    console.log('Node created:', newCoordinate);

    // Refresh the graph data to include the new node
    // The useGraphData hook should automatically refresh, but we can trigger a manual refresh if needed

    // Wait a moment for the graph to update
    setTimeout(() => {
      // Select the newly created node
      setSelectedCoordinate(newCoordinate);

      // The useEffect for selectedCoordinate will automatically fetch the node data
      // and open the property/relationship editor
    }, 500);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        isExistingDoc: false,
        file: file
      });
    }
  };

  // Handle uploading new file with automatic coordinate assignment
  const handleFileUpload = async (file: File) => {
    if (!selectedCoordinate) {
      setSuggestionError('No coordinate selected for upload');
      return null;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetCoordinate', selectedCoordinate); // Automatically assign coordinate
      formData.append('userId', 'default-user');

      const response = await fetch(`${backendUrl}/files/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result);

      // Refresh the documents list for this coordinate
      await loadCoordinateDocuments(selectedCoordinate);

      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      setSuggestionError(error instanceof Error ? error.message : 'Failed to upload file');
      return null;
    }
  };

  const generateLLMSuggestions = async () => {
    if (!selectedCoordinate || !selectedFile || !nodeData) {
      setSuggestionError('Please select a coordinate and file');
      return;
    }

    setIsGeneratingSuggestions(true);
    setSuggestionError(null);

    try {
      let fileContent: string;

      if (selectedFile.isExistingDoc) {
        // Load content from existing document
        fileContent = await loadExistingDocumentContent(selectedFile.docId);
      } else {
        // Handle new file upload
        if (selectedFile.file) {
          // Upload the file first
          const uploadResult = await handleFileUpload(selectedFile.file);
          if (!uploadResult) {
            return; // Error already set in handleFileUpload
          }

          // Read the uploaded file content
          fileContent = await readFileContent(selectedFile.file);
        } else {
          throw new Error('No file selected');
        }
      }

      // Get QL context using bimbaKnowing
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const qlContextResponse = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: 'bimbaKnowing',
          args: {
            query: `Retrieve Quaternal Logic operators (structural, processual, contextual) relevant to ${selectedCoordinate}`,
            contextDepth: 2,
            focusCoordinate: selectedCoordinate,
            limit: 10
          }
        })
      });

      let qlContext = {};
      if (qlContextResponse.ok) {
        const qlResult = await qlContextResponse.json();
        if (qlResult.content && qlResult.content[0]) {
          try {
            qlContext = JSON.parse(qlResult.content[0].text);
          } catch (e) {
            console.warn('Failed to parse QL context');
          }
        }
      }

      // Prepare the LLM prompt for suggestions
      const prompt = `You are an expert in Quaternal Logic (QL) and Bimba knowledge graph management.

Current Bimba Node:
- Coordinate: ${selectedCoordinate}
- Properties: ${JSON.stringify(nodeData.properties, null, 2)}
- Current Relationships: ${JSON.stringify(nodeData.relationships, null, 2)}

QL Context:
${JSON.stringify(qlContext, null, 2)}

Document Content to Analyze:
${fileContent.substring(0, 4000)}${fileContent.length > 4000 ? '...' : ''}

QL RELATIONSHIP SCHEMA REFERENCE:
QL Relationship Types:
- 0_POTENTIAL_RELATION: Position #0 (Implicit Theme or Field of Potential)
- 1_MATERIAL_RELATION: Position #1 (Material Cause or "What")
- 2_PROCESSUAL_RELATION: Position #2 (Efficient Cause or "How")
- 3_MEDIATING_RELATION: Position #3 (Formal Mediation)
- 4_CONTEXTUAL_RELATION: Position #4 (Contextual Arena)
- 5_QUINTESSENTIAL_RELATION: Position #5 (Quintessence)

QL Dynamics:
- foundational_emergence: 0→1 (From potential to material definition)
- processual_activation: 1→2 (From definition to process)
- formal_mediation: 2→3 (From process to integration)
- contextual_embedding: 3→4 (From integration to context)
- quintessential_synthesis: 4→5 (From context to synthesis)
- recursive_renewal: 5→0 (From synthesis back to potential)

QL Context Frames: 0000, 0/1, 0/1/2, 0/1/2/3, 4.0-4/5, 5/0

Based on the document content and the current node structure, suggest specific updates to:

1. Node Properties: Suggest new or updated properties that would better reflect the document content
2. Relationships: Suggest new QL-aware relationships to create or existing ones to modify/delete
3. QL Alignment: Ensure suggestions align with Quaternal Logic principles and use proper QL relationship properties

Provide your response as a JSON object with the following structure:
{
  "propertyUpdates": {
    "property_name": "new_value",
    ...
  },
  "relationshipSuggestions": [
    {
      "action": "create|update|delete",
      "type": "RELATIONSHIP_TYPE",
      "targetCoordinate": "#X-Y-Z",
      "properties": {
        "qlType": "1_MATERIAL_RELATION",
        "qlDynamics": "foundational_emergence",
        "qlContextFrame": "0/1",
        "strength": 0.8,
        "description": "Detailed description"
      },
      "reasoning": "Why this relationship is suggested"
    }
  ],
  "reasoning": "Overall reasoning for the suggestions",
  "qlAlignment": "How these suggestions align with QL principles"
}`;

      // Call the LLM through BPMCP service
      const llmResponse = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: 'callLLM',
          args: {
            messages: [
              {
                role: 'system',
                content: 'You are an expert in Quaternal Logic and Bimba knowledge graph management. Provide precise, structured suggestions for node updates.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            model: 'claude-3-5-sonnet-20241022',
            temperature: 0.3
          }
        })
      });

      if (!llmResponse.ok) {
        throw new Error(`Failed to generate suggestions: ${llmResponse.statusText}`);
      }

      const llmResult = await llmResponse.json();

      let suggestions;
      try {
        // Parse the LLM response
        const responseText = llmResult.content?.[0]?.text || llmResult.response || '';
        suggestions = JSON.parse(responseText);
      } catch (parseError) {
        console.warn('Could not parse LLM response as JSON, returning raw response');
        suggestions = {
          rawResponse: llmResult.content?.[0]?.text || llmResult.response || '',
          error: 'Could not parse as structured JSON'
        };
      }

      setLLMSuggestions(suggestions);

    } catch (error) {
      console.error('Error generating LLM suggestions:', error);
      setSuggestionError(error instanceof Error ? error.message : 'Failed to generate suggestions');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Load content from existing document using cache/MongoDB
  const loadExistingDocumentContent = async (docId: string): Promise<string> => {
    try {
      // First try to get from cache
      const documentCacheService = (await import('../1_services/documentCacheService')).default;
      const cachedDoc = documentCacheService.getDocumentById(docId);

      if (cachedDoc && (cachedDoc.content || cachedDoc.textContent)) {
        return cachedDoc.textContent || cachedDoc.content || '';
      }

      // If not in cache or no content, fetch from MongoDB
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName: 'getDocumentById',
          args: { documentId: docId }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to load document: ${response.statusText}`);
      }

      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        return result[0].textContent || result[0].content || '';
      } else if (result && (result.textContent || result.content)) {
        return result.textContent || result.content || '';
      }

      throw new Error('Document content not found');
    } catch (error) {
      console.error('Error loading document content:', error);
      throw new Error(`Failed to load document content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const applyLLMSuggestions = () => {
    if (!llmSuggestions) return;

    // Apply property updates
    setEditedProperties(prev => ({
      ...prev,
      ...llmSuggestions.propertyUpdates
    }));

    // Apply relationship suggestions (for now, just add create actions)
    const newRelationships = llmSuggestions.relationshipSuggestions
      .filter(rel => rel.action === 'create')
      .map(rel => ({
        action: 'create',
        type: rel.type,
        targetCoordinate: rel.targetCoordinate,
        properties: rel.properties
      }));

    setEditedRelationships(prev => [...prev, ...newRelationships]);
  };

  const handlePropertyChange = (key: string, value: any) => {
    setEditedProperties(prev => ({
      ...prev,
      [key]: value
    }));

    // Track the change
    const newChanges = new Map(pendingChanges);
    const changeKey = `prop_${key}`;

    if (isPropertyChanged(key, value)) {
      newChanges.set(changeKey, value);
    } else {
      newChanges.delete(changeKey);
    }

    setPendingChanges(newChanges);
    setHasUnsavedChanges(newChanges.size > 0);

    // Save to cache and update global count
    if (selectedCoordinate) {
      saveChangesToCache(selectedCoordinate, newChanges);
      // Trigger global change count update
      const globalChanges = collectAllChanges();
      const totalChanges = Array.from(globalChanges.values()).reduce((total, changes) => total + Object.keys(changes).length, 0);
      setGlobalChangeCount(totalChanges);
    }
  };

  const revertPropertyChange = (key: string) => {
    const originalValue = originalProperties[key];
    setEditedProperties(prev => ({
      ...prev,
      [key]: originalValue
    }));

    // Remove from pending changes
    const newChanges = new Map(pendingChanges);
    newChanges.delete(`prop_${key}`);
    setPendingChanges(newChanges);
    setHasUnsavedChanges(newChanges.size > 0);

    // Update cache and global count
    if (selectedCoordinate) {
      saveChangesToCache(selectedCoordinate, newChanges);
      // Trigger global change count update
      const globalChanges = collectAllChanges();
      const totalChanges = Array.from(globalChanges.values()).reduce((total, changes) => total + Object.keys(changes).length, 0);
      setGlobalChangeCount(totalChanges);
    }
  };

  // Sanitize property values for Neo4j compatibility
  const sanitizePropertyValue = (value: any): any => {
    // Handle Neo4j DateTime objects - convert to ISO string
    if (value && typeof value === 'object' && value.year && value.month && value.day) {
      try {
        const date = new Date(value.year, value.month - 1, value.day,
                             value.hour || 0, value.minute || 0, value.second || 0);
        return date.toISOString();
      } catch (error) {
        console.warn('Failed to convert DateTime object:', value);
        return new Date().toISOString(); // Fallback to current time
      }
    }

    // Handle arrays - ensure all elements are primitives
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return JSON.stringify(item);
        }
        return item;
      });
    }

    // Handle objects - convert to JSON string
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }

    // Return primitives as-is
    return value;
  };

  const applyUpdates = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

      // Get all changes across all coordinates
      const allChanges = collectAllChanges();

      // Process each coordinate with changes
      for (const [coordinate, changes] of allChanges.entries()) {
        console.log(`Processing changes for coordinate: ${coordinate}`, changes);

        // Separate property changes from relationship changes
        const propertyChanges: Record<string, any> = {};
        const relationshipChanges: Record<string, any> = {};

        for (const [key, value] of Object.entries(changes)) {
          if (key.startsWith('rel_')) {
            relationshipChanges[key] = value;
          } else if (key.startsWith('prop_')) {
            // Remove 'prop_' prefix and sanitize the value
            const propKey = key.replace('prop_', '');
            propertyChanges[propKey] = sanitizePropertyValue(value);
          } else {
            // Direct property (no prefix)
            propertyChanges[key] = sanitizePropertyValue(value);
          }
        }

        // Update properties if any exist
        if (Object.keys(propertyChanges).length > 0) {
          const setClause = Object.keys(propertyChanges)
            .map(key => `n.${key} = $${key}`)
            .join(', ');

          // Check if this is a node without bimba coordinate
          const isNonCoordinateNode = coordinate.startsWith('node-');
          const nodeId = isNonCoordinateNode ? coordinate.replace('node-', '') : null;

          let updateQuery: string;
          let params: any;

          if (isNonCoordinateNode) {
            updateQuery = `
              MATCH (n)
              WHERE toString(id(n)) = $nodeId
              SET ${setClause}
              RETURN n
            `;
            params = { nodeId, ...propertyChanges };
          } else {
            updateQuery = `
              MATCH (n)
              WHERE n.bimbaCoordinate = $coordinate
              SET ${setClause}
              RETURN n
            `;
            params = { coordinate, ...propertyChanges };
          }

          console.log(`Updating properties for ${coordinate}:`, propertyChanges);

          const updateResponse = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              toolName: 'updateBimbaGraph',
              args: {
                query: updateQuery,
                params: params
              }
            })
          });

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Failed to update properties for ${coordinate}: ${errorText}`);
          }
        }

        // Handle relationship changes (if any)
        // TODO: Implement relationship change processing from cache
      }

      // Handle relationship updates (only if we have a selected coordinate)
      if (selectedCoordinate) {
        const relationshipActions = editedRelationships.filter(rel => rel.action);
        // Handle both coordinate and non-coordinate nodes
        const isSourceNonCoord = selectedCoordinate.startsWith('node-');
        const sourceNodeId = isSourceNonCoord ? selectedCoordinate.replace('node-', '') : null;

      for (const rel of relationshipActions) {
        if (rel.action === 'create' && rel.targetCoordinate && rel.type) {
          const createRelQuery = isSourceNonCoord ? `
            MATCH (source), (target)
            WHERE toString(id(source)) = $sourceNodeId
            AND target.bimbaCoordinate = $targetCoordinate
            CREATE (source)-[r:${rel.type}]->(target)
            SET r += $relProperties
            RETURN r
          ` : `
            MATCH (source), (target)
            WHERE source.bimbaCoordinate = $sourceCoordinate
            AND target.bimbaCoordinate = $targetCoordinate
            CREATE (source)-[r:${rel.type}]->(target)
            SET r += $relProperties
            RETURN r
          `;

          const relParams = isSourceNonCoord ? {
            sourceNodeId,
            targetCoordinate: rel.targetCoordinate,
            relProperties: rel.properties || {}
          } : {
            sourceCoordinate: selectedCoordinate,
            targetCoordinate: rel.targetCoordinate,
            relProperties: rel.properties || {}
          };

          const relResponse = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              toolName: 'queryBimbaGraph',
              args: {
                query: createRelQuery,
                params: relParams
              }
            })
          });

          if (!relResponse.ok) {
            console.warn(`Failed to create relationship: ${relResponse.statusText}`);
          }
        }

        if (rel.action === 'delete' && rel.targetCoordinate && rel.type) {
          const deleteRelQuery = isSourceNonCoord ? `
            MATCH (source)-[r:${rel.type}]-(target)
            WHERE toString(id(source)) = $sourceNodeId
            AND target.bimbaCoordinate = $targetCoordinate
            DELETE r
            RETURN count(r) as deletedCount
          ` : `
            MATCH (source)-[r:${rel.type}]-(target)
            WHERE source.bimbaCoordinate = $sourceCoordinate
            AND target.bimbaCoordinate = $targetCoordinate
            DELETE r
            RETURN count(r) as deletedCount
          `;

          const relParams = isSourceNonCoord ? {
            sourceNodeId,
            targetCoordinate: rel.targetCoordinate
          } : {
            sourceCoordinate: selectedCoordinate,
            targetCoordinate: rel.targetCoordinate
          };

          const relResponse = await fetch(`${backendUrl}/api/bpmcp/call-tool`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              toolName: 'queryBimbaGraph',
              args: {
                query: deleteRelQuery,
                params: relParams
              }
            })
          });

          if (!relResponse.ok) {
            console.warn(`Failed to delete relationship: ${relResponse.statusText}`);
          }
        }
      }
      } // Close selectedCoordinate check

      setUpdateSuccess(true);

      // Clear ALL pending changes and cache across all coordinates
      setPendingChanges(new Map());
      setHasUnsavedChanges(false);
      setGlobalChangeCount(0);

      // Clear all cached changes for all coordinates
      const allCachedChanges = collectAllChanges();
      for (const coordinate of allCachedChanges.keys()) {
        clearChangesFromCache(coordinate);
      }

      // Force refresh the global change count immediately
      setTimeout(() => {
        const refreshedChanges = collectAllChanges();
        const refreshedTotal = Array.from(refreshedChanges.values()).reduce((total, changes) => total + Object.keys(changes).length, 0);
        setGlobalChangeCount(refreshedTotal);
      }, 100);

      // Refresh the node data if we have a selected coordinate
      if (selectedCoordinate) {
        setTimeout(() => {
          fetchNodeData(selectedCoordinate);
        }, 1000);
      }

    } catch (error) {
      console.error('Error updating node:', error);
      setUpdateError(error instanceof Error ? error.message : 'Failed to update node');
    } finally {
      setIsUpdating(false);
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] bg-epii-dark border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-epii-neon text-xl">Bimba Node Update Manager</DialogTitle>
              <DialogDescription className="text-gray-400">
                Select a Bimba coordinate from the tree to edit its properties and relationships.
                Upload documents for LLM-assisted suggestions.
              </DialogDescription>
            </div>

            {/* Global Apply Updates Button - Outside editing panel */}
            <div className="flex items-center gap-2">
              {(() => {
                const globalChanges = collectAllChanges();
                const hasGlobalChanges = globalChanges.size > 0;
                const totalChanges = Array.from(globalChanges.values()).reduce((total, changes) => total + Object.keys(changes).length, 0);

                return hasGlobalChanges ? (
                  <Button
                    onClick={openReviewModal}
                    className="bg-epii-neon text-epii-darker hover:bg-epii-neon/90 text-sm px-3 py-2"
                    size="sm"
                  >
                    <Save size={14} className="mr-1" />
                    Apply Updates ({totalChanges})
                  </Button>
                ) : null;
              })()}
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-[80vh] gap-4">
          {/* Left Panel - Coordinate Tree */}
          {/* Added flex flex-col to allow button to be pushed to the bottom */}
          <div className="w-1/3 bg-epii-darker rounded-lg p-4 overflow-y-auto flex flex-col">
            {/* Wrapped existing content to allow flex-grow and push button down */}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-epii-neon mb-4">Select Coordinate</h3>

              {isLoadingGraph && (
              <div className="text-gray-400 text-sm">Loading graph data...</div>
            )}

            {graphError && (
              <div className="text-red-400 text-sm">Failed to load graph data: {graphError.message}</div>
            )}

            {!isLoadingGraph && !graphError && fullGraphData && (
              <RecursiveFullBimbaTree
                graphData={fullGraphData}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                onNodeSelect={handleNodeSelect}
                selectedNodeId={fullGraphData.nodes.find(n => n.bimbaCoordinate === selectedCoordinate)?.id}
                coordinateChanges={collectAllChanges()}
              />
            )}

            {!isLoadingGraph && !graphError && !fullGraphData && (
              <div className="text-gray-400 text-sm">No graph data available</div>
            )}
            </div> {/* End of flex-grow wrapper */}

            {/* Button to open CreateNodeModal, pushed to the bottom */}
            <div className="mt-auto pt-4"> 
              <Button 
                onClick={() => setShowCreateNodeModal(true)} 
                variant="outline" 
                className="w-full text-epii-neon border-epii-neon hover:bg-epii-neon/10 hover:text-epii-neon"
              >
                <Plus size={16} className="mr-2" />
                Create New Bimba Node
              </Button>
            </div>
          </div>

          {/* Right Panel - Node Editor */}
          <div className="flex-1 bg-epii-darker rounded-lg p-4 overflow-y-auto">
            {!selectedCoordinate ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a coordinate from the tree to begin editing</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-epii-neon">
                    Editing: {selectedCoordinate}
                  </h3>

                  <div className="flex items-center gap-3">
                    {updateSuccess && (
                      <div className="flex items-center text-green-400 text-sm">
                        <CheckCircle size={16} className="mr-1" />
                        Updated successfully
                      </div>
                    )}
                  </div>
                </div>

                {isLoadingNode && (
                  <div className="text-gray-400 text-sm">Loading node data...</div>
                )}

                {nodeError && (
                  <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md">
                    <AlertTriangle size={16} className="inline mr-2" />
                    {nodeError}
                  </div>
                )}

                {nodeData && (
                  <>
                    {/* Node Properties Editor */}
                    <div className="bg-epii-dark p-4 rounded-lg">
                      <h4 className="text-md font-semibold text-epii-neon mb-3">Node Properties</h4>

                      <div className="space-y-3">
                        {Object.entries(editedProperties).map(([key, value]) => {
                          const isChanged = isPropertyChanged(key, value);
                          return (
                            <div key={key} className="flex flex-col">
                              <div className="flex items-center justify-between mb-1">
                                <label className={`text-sm font-medium mb-1 ${isChanged ? 'text-epii-neon' : 'text-gray-300'}`}>
                                  {key}
                                  {isChanged && (
                                    <span className="ml-2 text-xs bg-epii-neon/20 text-epii-neon px-1 py-0.5 rounded">
                                      ✓ Changed
                                    </span>
                                  )}
                                </label>
                                {isChanged && (
                                  <Button
                                    onClick={() => revertPropertyChange(key)}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6 px-2 text-gray-400 hover:text-gray-200"
                                  >
                                    ↶ Revert
                                  </Button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={value === null || value === undefined ? '' : (typeof value === 'object' ? JSON.stringify(value) : String(value))}
                                onChange={(e) => {
                                  let newValue: any = e.target.value;
                                  // Try to parse as JSON if it looks like an object/array
                                  if (newValue.startsWith('{') || newValue.startsWith('[')) {
                                    try {
                                      newValue = JSON.parse(newValue);
                                    } catch {
                                      // Keep as string if JSON parsing fails
                                    }
                                  }
                                  handlePropertyChange(key, newValue);
                                }}
                                className={`p-2 bg-epii-darker border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-epii-neon ${
                                  isChanged ? 'border-epii-neon/50' : 'border-gray-600'
                                }`}
                              />
                            </div>
                          );
                        })}

                        {/* Add new property */}
                        <div className="pt-2 border-t border-gray-600">
                          <Button
                            onClick={() => {
                              const key = prompt('Enter property name:');
                              if (key && !editedProperties[key]) {
                                handlePropertyChange(key, '');
                              }
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Add Property
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Current Relationships */}
                    <div className="bg-epii-dark p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-semibold text-epii-neon">Relationships</h4>
                        <Button
                          onClick={() => {
                            const newRel = {
                              type: '',
                              targetCoordinate: '',
                              properties: {},
                              direction: 'outgoing',
                              action: 'create',
                              relatedNode: { coordinate: '', title: '', labels: [] }
                            };
                            setEditedRelationships([...editedRelationships, newRel]);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Add Relationship
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {editedRelationships.map((rel, index) => (
                          <div key={index} className="bg-epii-darker p-3 rounded-md border border-gray-600">
                            <div className="space-y-2">
                              {/* Relationship Type and Target */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs font-medium text-gray-300 mb-1 block">
                                    Relationship Type
                                  </label>
                                  <input
                                    type="text"
                                    value={rel.type || ''}
                                    onChange={(e) => {
                                      const updated = [...editedRelationships];
                                      updated[index] = { ...updated[index], type: e.target.value };
                                      setEditedRelationships(updated);
                                    }}
                                    className="w-full p-1 bg-epii-dark border border-gray-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-epii-neon"
                                    placeholder="e.g., HAS_LENS, CONTAINS"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-gray-300 mb-1 block">
                                    Target Node {rel.action === 'create' ? '(Coordinate)' : ''}
                                  </label>
                                  {rel.action === 'create' ? (
                                    <Input
                                      type="text"
                                      value={rel.targetCoordinate || ''}
                                      onChange={(e) => {
                                        const updated = [...editedRelationships];
                                        updated[index] = { 
                                            ...updated[index], 
                                            targetCoordinate: e.target.value,
                                            relatedNode: { 
                                                ...(updated[index].relatedNode || { title: '', labels: [] }), 
                                                coordinate: e.target.value 
                                            }
                                        };
                                        setEditedRelationships(updated);
                                      }}
                                      placeholder="Enter target coordinate (e.g., #X-Y-Z)"
                                      className="w-full p-1 bg-epii-dark border border-gray-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-epii-neon"
                                    />
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-400 text-xs">
                                        {rel.direction === 'outgoing' ? '→' : '←'}
                                      </span>
                                      <span className="text-gray-300 text-xs flex-1">
                                        {rel.relatedNode.coordinate}
                                      </span>
                                      {rel.relatedNode.title && (
                                        <span className="text-gray-400 text-xs">({rel.relatedNode.title})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Relationship Properties - Enhanced Editing */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-xs font-medium text-gray-300">
                                    Relationship Properties
                                  </label>
                                  <Button
                                    onClick={() => {
                                      const updated = [...editedRelationships];
                                      updated[index] = {
                                        ...updated[index],
                                        showPropertiesEditor: !updated[index].showPropertiesEditor
                                      };
                                      setEditedRelationships(updated);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                  >
                                    {rel.showPropertiesEditor ? 'Hide' : 'Edit'} Properties
                                  </Button>
                                </div>

                                {rel.showPropertiesEditor ? (
                                  <div className="space-y-2 bg-epii-dark p-3 rounded border border-gray-600">
                                    {/* QL Type */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-xs text-gray-300 block mb-1">QL Type</label>
                                        <select
                                          value={rel.properties.qlType || ''}
                                          onChange={(e) => {
                                            const updated = [...editedRelationships];
                                            updated[index] = {
                                              ...updated[index],
                                              properties: { ...updated[index].properties, qlType: e.target.value }
                                            };
                                            setEditedRelationships(updated);
                                          }}
                                          className="w-full p-1 bg-epii-darker border border-gray-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-epii-neon"
                                        >
                                          {/* Ensured default empty option */}
                                          <option value="">Select QL Type</option> 
                                          <option value="0_POTENTIAL_RELATION">0_POTENTIAL_RELATION</option>
                                          <option value="1_MATERIAL_RELATION">1_MATERIAL_RELATION</option>
                                          <option value="2_PROCESSUAL_RELATION">2_PROCESSUAL_RELATION</option>
                                          <option value="3_MEDIATING_RELATION">3_MEDIATING_RELATION</option>
                                          <option value="4_CONTEXTUAL_RELATION">4_CONTEXTUAL_RELATION</option>
                                          <option value="5_QUINTESSENTIAL_RELATION">5_QUINTESSENTIAL_RELATION</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-300 block mb-1">QL Dynamics</label>
                                        <select
                                          value={rel.properties.qlDynamics || ''}
                                          onChange={(e) => {
                                            const updated = [...editedRelationships];
                                            updated[index] = {
                                              ...updated[index],
                                              properties: { ...updated[index].properties, qlDynamics: e.target.value }
                                            };
                                            setEditedRelationships(updated);
                                          }}
                                          className="w-full p-1 bg-epii-darker border border-gray-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-epii-neon"
                                        >
                                          {/* Ensured default empty option */}
                                          <option value="">Select QL Dynamics</option>
                                          <option value="foundational_emergence">foundational_emergence</option>
                                          <option value="processual_activation">processual_activation</option>
                                          <option value="formal_mediation">formal_mediation</option>
                                          <option value="contextual_embedding">contextual_embedding</option>
                                          <option value="quintessential_synthesis">quintessential_synthesis</option>
                                          <option value="recursive_renewal">recursive_renewal</option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* QL Context Frame and Strength */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-xs text-gray-300 block mb-1">QL Context Frame</label>
                                        <select
                                          value={rel.properties.qlContextFrame || ''}
                                          onChange={(e) => {
                                            const updated = [...editedRelationships];
                                            updated[index] = {
                                              ...updated[index],
                                              properties: { ...updated[index].properties, qlContextFrame: e.target.value }
                                            };
                                            setEditedRelationships(updated);
                                          }}
                                          className="w-full p-1 bg-epii-darker border border-gray-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-epii-neon"
                                        >
                                          {/* Ensured default empty option */}
                                          <option value="">Select Context Frame</option>
                                          <option value="0000">0000 - Transcendental</option>
                                          <option value="0/1">0/1 - Foundation & Definition</option>
                                          <option value="0/1/2">0/1/2 - Activation & Process</option>
                                          <option value="0/1/2/3">0/1/2/3 - Integration & Mediation</option>
                                          <option value="4.0-4/5">4.0-4/5 - Application & Personalization</option>
                                          <option value="5/0">5/0 - Synthesis & Renewal</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-300 block mb-1">Strength (0-1)</label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="1"
                                          step="0.1"
                                          value={rel.properties.strength || 0.5}
                                          onChange={(e) => {
                                            const updated = [...editedRelationships];
                                            updated[index] = {
                                              ...updated[index],
                                              properties: { ...updated[index].properties, strength: parseFloat(e.target.value) }
                                            };
                                            setEditedRelationships(updated);
                                          }}
                                          className="w-full p-1 bg-epii-darker border border-gray-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-epii-neon"
                                        />
                                      </div>
                                    </div>

                                    {/* Description and Bidirectional */}
                                    <div>
                                      <label className="text-xs text-gray-300 block mb-1">Description</label>
                                      <textarea
                                        value={(rel.properties.description === null || rel.properties.description === undefined) ? '' : rel.properties.description}
                                        onChange={(e) => {
                                          const updated = [...editedRelationships];
                                          updated[index] = {
                                            ...updated[index],
                                            properties: { ...updated[index].properties, description: e.target.value }
                                          };
                                          setEditedRelationships(updated);
                                        }}
                                        className="w-full p-2 bg-epii-darker border border-gray-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-epii-neon"
                                        rows={2}
                                        placeholder="Describe the nature and purpose of this relationship..."
                                      />
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <label className="flex items-center text-xs text-gray-300">
                                        <input
                                          type="checkbox"
                                          checked={rel.properties.bidirectional || false}
                                          onChange={(e) => {
                                            const updated = [...editedRelationships];
                                            updated[index] = {
                                              ...updated[index],
                                              properties: { ...updated[index].properties, bidirectional: e.target.checked }
                                            };
                                            setEditedRelationships(updated);
                                          }}
                                          className="mr-1"
                                        />
                                        Bidirectional
                                      </label>
                                      <div className="text-xs text-gray-400">
                                        Confidence:
                                        <input
                                          type="number"
                                          min="0"
                                          max="1"
                                          step="0.05"
                                          value={rel.properties.confidence || 0.8}
                                          onChange={(e) => {
                                            const updated = [...editedRelationships];
                                            updated[index] = {
                                              ...updated[index],
                                              properties: { ...updated[index].properties, confidence: parseFloat(e.target.value) }
                                            };
                                            setEditedRelationships(updated);
                                          }}
                                          className="ml-1 w-16 p-1 bg-epii-darker border border-gray-600 rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  // Collapsed view showing key properties
                                  <div className="text-xs text-gray-400 bg-epii-dark p-2 rounded">
                                    {Object.keys(rel.properties).length > 0 ? (
                                      <div className="space-y-1">
                                        {rel.properties.qlType && (
                                          <div><strong>QL Type:</strong> {rel.properties.qlType}</div>
                                        )}
                                        {rel.properties.strength && (
                                          <div><strong>Strength:</strong> {rel.properties.strength}</div>
                                        )}
                                        {rel.properties.description && (
                                          <div><strong>Description:</strong> {rel.properties.description}</div>
                                        )}
                                        {Object.keys(rel.properties).length > 3 && (
                                          <div className="text-gray-500">+ {Object.keys(rel.properties).length - 3} more properties</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-gray-500 italic">No properties set</div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons - Simplified */}
                              <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                                <div className="text-xs text-gray-400">
                                  {rel.action && (
                                    <span className="bg-epii-neon/20 text-epii-neon px-2 py-1 rounded">
                                      {rel.action.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  {rel.action === 'create' ? (
                                    <Button
                                      onClick={() => {
                                        const updated = editedRelationships.filter((_, i) => i !== index);
                                        setEditedRelationships(updated);
                                      }}
                                      variant="outline"
                                      size="sm"
                                    >
                                      Remove
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() => {
                                        const updated = [...editedRelationships];
                                        updated[index] = { ...updated[index], action: 'delete' };
                                        setEditedRelationships(updated);
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {editedRelationships.length === 0 && (
                          <div className="text-gray-400 text-sm italic">No relationships found</div>
                        )}
                      </div>
                    </div>

                    {/* Notion Property Integration Panel */}
                    <div className="bg-epii-dark p-4 rounded-lg">
                      <h4 className="text-md font-semibold text-epii-neon mb-3">Notion Property Integration Guide</h4>
                      <div className="text-xs text-gray-300 space-y-3">
                        <div>
                          <strong className="text-epii-neon">Pipeline → Notion Property Mapping:</strong>
                          <div className="ml-2 space-y-2 mt-2">
                            <div className="bg-epii-darker p-2 rounded">
                              <div className="font-medium text-gray-200">Relational Properties (from Analysis Pipeline):</div>
                              <div className="ml-2 mt-1 space-y-1">
                                <div><code className="bg-epii-dark px-1 rounded">qlOperators</code> → Notion Rich Text (formatted structure)</div>
                                <div><code className="bg-epii-dark px-1 rounded">epistemicEssence</code> → Notion Rich Text (detailed insights)</div>
                                <div><code className="bg-epii-dark px-1 rounded">archetypalAnchors</code> → Notion Rich Text (formatted structure for manual page creation)</div>
                                <div><code className="bg-epii-dark px-1 rounded">semanticFramework</code> → Notion Rich Text (framework structure)</div>
                              </div>
                            </div>

                            <div className="bg-epii-darker p-2 rounded">
                              <div className="font-medium text-gray-200">QL Properties → Notion Types:</div>
                              <div className="ml-2 mt-1 space-y-1">
                                <div><code className="bg-epii-dark px-1 rounded">qlPosition</code> → Select (0,1,2,3,4,5)</div>
                                <div><code className="bg-epii-dark px-1 rounded">qlCategory</code> → Select (implicate, explicate)</div>
                                <div><code className="bg-epii-dark px-1 rounded">qlOperatorTypes</code> → Multi-select (structural, processual, contextual)</div>
                                <div><code className="bg-epii-dark px-1 rounded">relationshipStrength</code> → Number (percentage)</div>
                                <div><code className="bg-epii-dark px-1 rounded">qlDynamics</code> → Select (emergence, activation, mediation, etc.)</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <strong className="text-epii-neon">Pipeline-QL Inversion Structure:</strong>
                          <div className="ml-2 mt-1 text-gray-400 space-y-1">
                            <div className="text-xs font-medium text-gray-300 mb-2">
                              Pipeline (-5 to -0) ↔ QL Frames (+0 to +5)
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-red-600/20 text-red-300 px-1 py-0.5 rounded text-xs">-5</span>
                                  <span>↔</span>
                                  <span className="bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded text-xs">+0</span>
                                  <span className="text-xs">Potential</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="bg-red-600/20 text-red-300 px-1 py-0.5 rounded text-xs">-4</span>
                                  <span>↔</span>
                                  <span className="bg-blue-600/20 text-blue-300 px-1 py-0.5 rounded text-xs">+1</span>
                                  <span className="text-xs">Material</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="bg-red-600/20 text-red-300 px-1 py-0.5 rounded text-xs">-3</span>
                                  <span>↔</span>
                                  <span className="bg-green-600/20 text-green-300 px-1 py-0.5 rounded text-xs">+2</span>
                                  <span className="text-xs">Processual</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="bg-red-600/20 text-red-300 px-1 py-0.5 rounded text-xs">-2</span>
                                  <span>↔</span>
                                  <span className="bg-yellow-600/20 text-yellow-300 px-1 py-0.5 rounded text-xs">+3</span>
                                  <span className="text-xs">Mediating</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="bg-red-600/20 text-red-300 px-1 py-0.5 rounded text-xs">-1</span>
                                  <span>↔</span>
                                  <span className="bg-orange-600/20 text-orange-300 px-1 py-0.5 rounded text-xs">+4</span>
                                  <span className="text-xs">Contextual</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="bg-red-600/20 text-red-300 px-1 py-0.5 rounded text-xs">-0</span>
                                  <span>↔</span>
                                  <span className="bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded text-xs">+5</span>
                                  <span className="text-xs">Synthesis</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-epii-neon mt-2 font-medium">
                              Key: Position -0 IS position +5 (inverted mathematical mirror)
                            </div>
                            <div className="text-xs text-gray-500 mt-1 italic">
                              Pipeline culmination (-0) = QL quintessence (+5) → Notion renewal (+0)
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-600">
                          <strong className="text-epii-neon">Property Update Template:</strong>
                          <pre className="bg-epii-darker p-2 rounded mt-1 text-xs overflow-x-auto">
{`// Node properties aligned with Notion structure
{
  "qlPosition": 3,
  "qlCategory": "explicate",
  "qlOperatorTypes": ["structural", "processual"],
  "relationshipStrength": 0.85,
  "lastAnalyzed": "2024-01-15T10:30:00Z",
  "analysisConfidence": 0.92,

  // Relational properties (formatted for Notion)
  "qlOperators": "QL-STRUCT-3: Mediating operator...",
  "epistemicEssence": "Epistemic Topology: Framework for...",
  "semanticFramework": "Contextual embedding within..."
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* QL Relationship Schema Reference */}
                    <div className="bg-epii-dark p-4 rounded-lg">
                      <h4 className="text-md font-semibold text-epii-neon mb-3">QL Relationship Schema Reference</h4>
                      <div className="text-xs text-gray-300 space-y-2">
                        <div>
                          <strong className="text-epii-neon">QL Relationship Types:</strong>
                          <div className="ml-2 space-y-1 mt-1">
                            <div><code className="bg-epii-darker px-1 rounded">0_POTENTIAL_RELATION</code> - Position #0: Implicit Theme or Field of Potential</div>
                            <div><code className="bg-epii-darker px-1 rounded">1_MATERIAL_RELATION</code> - Position #1: Material Cause or "What"</div>
                            <div><code className="bg-epii-darker px-1 rounded">2_PROCESSUAL_RELATION</code> - Position #2: Efficient Cause or "How"</div>
                            <div><code className="bg-epii-darker px-1 rounded">3_MEDIATING_RELATION</code> - Position #3: Formal Mediation</div>
                            <div><code className="bg-epii-darker px-1 rounded">4_CONTEXTUAL_RELATION</code> - Position #4: Contextual Arena</div>
                            <div><code className="bg-epii-darker px-1 rounded">5_QUINTESSENTIAL_RELATION</code> - Position #5: Quintessence</div>
                          </div>
                        </div>

                        <div>
                          <strong className="text-epii-neon">QL Dynamics:</strong>
                          <div className="ml-2 space-y-1 mt-1">
                            <div><code className="bg-epii-darker px-1 rounded">foundational_emergence</code> - 0→1: From potential to material definition</div>
                            <div><code className="bg-epii-darker px-1 rounded">processual_activation</code> - 1→2: From definition to process</div>
                            <div><code className="bg-epii-darker px-1 rounded">formal_mediation</code> - 2→3: From process to integration</div>
                            <div><code className="bg-epii-darker px-1 rounded">contextual_embedding</code> - 3→4: From integration to context</div>
                            <div><code className="bg-epii-darker px-1 rounded">quintessential_synthesis</code> - 4→5: From context to synthesis</div>
                            <div><code className="bg-epii-darker px-1 rounded">recursive_renewal</code> - 5→0: From synthesis back to potential</div>
                          </div>
                        </div>

                        <div>
                          <strong className="text-epii-neon">QL Context Frames:</strong>
                          <div className="ml-2 space-y-1 mt-1">
                            <div><code className="bg-epii-darker px-1 rounded">0000</code> - The transcendental frame</div>
                            <div><code className="bg-epii-darker px-1 rounded">0/1</code> - The foundation and definition frame</div>
                            <div><code className="bg-epii-darker px-1 rounded">0/1/2</code> - The activation and process frame</div>
                            <div><code className="bg-epii-darker px-1 rounded">0/1/2/3</code> - The integration and mediation frame</div>
                            <div><code className="bg-epii-darker px-1 rounded">4.0-4/5</code> - The application and personalization frame</div>
                            <div><code className="bg-epii-darker px-1 rounded">5/0</code> - The synthesis and renewal frame</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-600">
                          <strong className="text-epii-neon">Example QL Properties:</strong>
                          <pre className="bg-epii-darker p-2 rounded mt-1 text-xs overflow-x-auto">
{`{
  "qlType": "1_MATERIAL_RELATION",
  "qlDynamics": "foundational_emergence",
  "qlContextFrame": "0/1",
  "strength": 0.8,
  "bidirectional": false,
  "description": "Defines the material foundation"
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Document Selection and LLM Suggestions */}
                    <div className="bg-epii-dark p-4 rounded-lg">
                      <h4 className="text-md font-semibold text-epii-neon mb-3">LLM-Assisted Updates</h4>

                      <div className="space-y-4">
                        {/* Existing Documents Section */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Existing Documents for {selectedCoordinate}</h5>

                          {isLoadingDocuments ? (
                            <div className="text-gray-400 text-sm">Loading documents...</div>
                          ) : coordinateDocuments.length > 0 ? (
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {coordinateDocuments.map((doc) => (
                                <div
                                  key={doc.id}
                                  onClick={() => setSelectedFile({ name: doc.name, isExistingDoc: true, docId: doc.id, documentType: doc.documentType })}
                                  className={`p-2 rounded border cursor-pointer transition-colors ${
                                    selectedFile?.docId === doc.id
                                      ? 'border-epii-neon bg-epii-neon/10'
                                      : 'border-gray-600 hover:border-gray-500'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-200">{doc.name}</div>
                                      <div className="text-xs text-gray-400">
                                        {doc.documentType === 'bimba' ? '📄 Bimba' : '🔮 Pratibimba'} •
                                        {doc.lastModified.toLocaleDateString()}
                                      </div>
                                    </div>
                                    {doc.hasContent && (
                                      <div className="text-xs text-green-400">✓ Content</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm italic">No documents found for this coordinate</div>
                          )}
                        </div>

                        {/* Upload New Document Section */}
                        <div className="pt-3 border-t border-gray-600">
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Upload New Document</h5>

                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept=".txt,.md,.pdf,.docx,.doc,.html,.htm,.json,.csv,.xml,.rtf"
                          />

                          <div className="flex gap-2">
                            <Button
                              onClick={() => fileInputRef.current?.click()}
                              variant="outline"
                              className="flex-1"
                            >
                              <Upload size={16} className="mr-2" />
                              Upload File
                            </Button>

                            <Button
                              onClick={generateLLMSuggestions}
                              disabled={!selectedFile || isGeneratingSuggestions}
                              className="bg-epii-neon text-epii-darker hover:bg-epii-neon/90"
                            >
                              {isGeneratingSuggestions ? (
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-epii-darker border-t-transparent rounded-full" />
                              ) : (
                                <Sparkles size={16} className="mr-2" />
                              )}
                              Generate Suggestions
                            </Button>
                          </div>

                          {selectedFile && !selectedFile.isExistingDoc && (
                            <div className="mt-2 text-sm text-gray-400">
                              Selected: {selectedFile.name}
                            </div>
                          )}
                        </div>

                        {suggestionError && (
                          <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md">
                            <AlertTriangle size={16} className="inline mr-2" />
                            {suggestionError}
                          </div>
                        )}

                        {llmSuggestions && (
                          <div className="bg-epii-darker p-3 rounded-md">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-epii-neon">LLM Suggestions</h5>
                              <Button
                                onClick={applyLLMSuggestions}
                                size="sm"
                                className="bg-epii-neon text-epii-darker hover:bg-epii-neon/90"
                              >
                                Apply Suggestions
                              </Button>
                            </div>

                            <div className="text-sm text-gray-300 space-y-2">
                              <div>
                                <strong>Reasoning:</strong> {llmSuggestions.reasoning}
                              </div>
                              <div>
                                <strong>QL Alignment:</strong> {llmSuggestions.qlAlignment}
                              </div>

                              {Object.keys(llmSuggestions.propertyUpdates).length > 0 && (
                                <div>
                                  <strong>Property Updates:</strong>
                                  <pre className="text-xs bg-epii-dark p-2 rounded mt-1 overflow-x-auto">
                                    {JSON.stringify(llmSuggestions.propertyUpdates, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {llmSuggestions.relationshipSuggestions.length > 0 && (
                                <div>
                                  <strong>Relationship Suggestions:</strong>
                                  <div className="space-y-1 mt-1">
                                    {llmSuggestions.relationshipSuggestions.map((rel, index) => (
                                      <div key={index} className="text-xs bg-epii-dark p-2 rounded">
                                        <div><strong>{rel.action.toUpperCase()}</strong> {rel.type} → {rel.targetCoordinate}</div>
                                        <div className="text-gray-400">{rel.reasoning}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {selectedCoordinate && nodeData && (
              <div className="flex items-center gap-4">
                <span>Node: {selectedCoordinate} | Labels: {nodeData.labels.join(', ')}</span>
                {hasUnsavedChanges && (
                  <span className="text-epii-neon text-xs bg-epii-neon/20 px-2 py-1 rounded">
                    ● {pendingChanges.size} unsaved change{pendingChanges.size !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>

        {updateError && (
          <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md mt-2">
            <AlertTriangle size={16} className="inline mr-2" />
            {updateError}
          </div>
        )}
      </DialogContent>

      {/* Sacred Review Modal */}
      {showReviewModal && (
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-epii-darker border-epii-neon/30">
            <DialogHeader>
              <DialogTitle className="text-epii-neon text-xl">
                🔮 Sacred Bimba Review - Final Confirmation
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                The Bimba map is sacred. Please review all changes carefully before applying them to the knowledge graph.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {allCoordinateChanges.size === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No changes found across any coordinates.</p>
                </div>
              ) : (
                <>
                  <div className="bg-epii-dark p-4 rounded-lg border border-epii-neon/20">
                    <h3 className="text-lg font-semibold text-epii-neon mb-2">
                      Summary: {allCoordinateChanges.size} coordinate{allCoordinateChanges.size !== 1 ? 's' : ''} with changes
                    </h3>
                    <div className="text-sm text-gray-300">
                      Total changes: {Array.from(allCoordinateChanges.values()).reduce((total, changes) => total + Object.keys(changes).length, 0)}
                    </div>
                  </div>

                  {Array.from(allCoordinateChanges.entries()).map(([coordinate, changes]) => (
                    <div key={coordinate} className="bg-epii-dark p-4 rounded-lg border border-gray-600">
                      <h4 className="text-md font-semibold text-epii-neon mb-3">
                        Coordinate: {coordinate}
                      </h4>

                      <div className="space-y-3">
                        {Object.entries(changes).map(([changeKey, value]) => {
                          const isProperty = changeKey.startsWith('prop_');
                          const displayKey = isProperty ? changeKey.replace('prop_', '') : changeKey;

                          return (
                            <div key={changeKey} className="bg-epii-darker p-3 rounded border border-gray-600">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    isProperty
                                      ? 'bg-blue-600/20 text-blue-300'
                                      : 'bg-purple-600/20 text-purple-300'
                                  }`}>
                                    {isProperty ? 'PROPERTY' : 'RELATIONSHIP'}
                                  </span>
                                  <span className="font-medium text-gray-200">{displayKey}</span>
                                </div>
                                <span className="text-xs bg-epii-neon/20 text-epii-neon px-2 py-1 rounded">
                                  CHANGED
                                </span>
                              </div>

                              <div className="text-sm">
                                <div className="text-gray-300">
                                  <strong>New Value:</strong>
                                </div>
                                <div className="bg-epii-dark p-2 rounded mt-1 text-xs font-mono">
                                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-600 mt-6">
              <div className="text-sm text-gray-400">
                ⚠️ These changes will permanently modify the sacred Bimba knowledge graph
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowReviewModal(false)}
                  variant="outline"
                >
                  Cancel Review
                </Button>

                {allCoordinateChanges.size > 0 && (
                  <Button
                    onClick={async () => {
                      setShowReviewModal(false);
                      await applyUpdates();
                    }}
                    disabled={isUpdating}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Applying Sacred Changes...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        🔮 Apply Sacred Changes
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Render the CreateNodeModal */}
      <CreateNodeModal
        isOpen={showCreateNodeModal}
        onClose={() => setShowCreateNodeModal(false)}
        onNodeCreated={handleNodeCreated}
        fullGraphData={fullGraphData}
      />
    </Dialog>
  );
};

export default BimbaUpdateOverlay;
