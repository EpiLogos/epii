# epii-agent-enhanced-prompt.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/5_integration/prompts/epii-agent-enhanced-prompt.mjs`
**Bimba Coordinate**: `#5-5-1-2`
**Last Updated**: `2025-01-30`

## Purpose & Role
Enhanced Epii Agent Prompts providing user context awareness and document editing capabilities with comprehensive identity integration and personalized interaction. Handles user context integration, identity structure formatting, personalized prompt generation, and comprehensive user-aware agent context. Serves as the primary enhanced prompt system enabling personalized agent interactions, user context awareness, and advanced identity-based agent customization.

## System Integration
### Imports
- **Base Prompts**: epiiAgentBasePrompt from ./epii-agent-prompts.mjs for foundational agent identity

### Exports
- **generateEnhancedEpiiPrompt**: Function for generating enhanced prompts with user context integration
- **formatIdentitySection**: Function for formatting user identity sections with comprehensive structure
- **generateUserAwarePrompt**: Function for generating user-aware prompts with personalized context
- **enhancePromptWithPreferences**: Function for enhancing prompts with user preferences and customization

### Dependencies
- **Base Agent Prompts**: Foundational agent prompts for identity and operational context
- **User Context Data**: User identity structure, profile data, and preferences for personalization
- **Identity Framework**: Comprehensive identity framework for user context integration
- **Personalization System**: Personalization utilities for user-aware agent customization

### Dependents
- **Personalized Agent Interactions**: Agent interactions requiring user context awareness
- **User-Aware Analysis**: Analysis operations with user context integration
- **Customized Conversations**: Conversation systems utilizing personalized prompts
- **Identity-Based Processing**: Processing systems requiring user identity awareness

## Key Functions/Components
### generateEnhancedEpiiPrompt Function (Lines 13-100)
**Purpose**: Generates enhanced Epii agent prompt with comprehensive user context integration
**Parameters**: userContext (object) - User context data with identity structure, profile, and preferences
**Returns**: String with enhanced agent prompt including user context awareness and personalization
**Notes**: 244 lines implementing comprehensive enhanced prompts with user context integration and advanced personalization

### User Context Extraction (Lines 14-19)
**Purpose**: Extracts user identity data from context object with comprehensive structure parsing
**Parameters**: userContext object with identityStructure, profileData, and preferences
**Returns**: Extracted user context components for prompt enhancement and personalization
**Notes**: Advanced context extraction with comprehensive user data parsing and structure validation

### User Identity Section Formatting (Lines 22-50)
**Purpose**: Formats user identity section with comprehensive #5-0 coordinate system integration
**Parameters**: Identity structure components with transcendent foundation through integral identity
**Returns**: Formatted user identity section for agent prompt integration and context awareness
**Notes**: Sophisticated identity formatting with coordinate system integration and comprehensive structure

### formatIdentitySection Function (Lines 102-150)
**Purpose**: Formats individual identity sections with proper structure and comprehensive presentation
**Parameters**: identityData (object), sectionType (string) - Identity data and section type for formatting
**Returns**: String with formatted identity section for prompt integration and user context awareness
**Notes**: Advanced identity section formatting with proper structure and comprehensive presentation

### generateUserAwarePrompt Function (Lines 152-200)
**Purpose**: Generates user-aware prompts with personalized context and identity integration
**Parameters**: basePrompt (string), userContext (object) - Base prompt and user context for personalization
**Returns**: String with user-aware prompt including personalized context and identity awareness
**Notes**: Comprehensive user-aware prompt generation with personalization and identity integration

### enhancePromptWithPreferences Function (Lines 202-244)
**Purpose**: Enhances prompts with user preferences and customization for personalized interactions
**Parameters**: prompt (string), preferences (object) - Prompt and user preferences for enhancement
**Returns**: String with enhanced prompt including user preferences and customization
**Notes**: Advanced prompt enhancement with user preferences integration and personalized customization

## Data Flow
1. **Context Integration**: User context → Data extraction → Identity parsing → Structure validation → Context preparation
2. **Prompt Enhancement**: Base prompt → User context integration → Identity formatting → Personalization → Enhanced prompt
3. **Identity Processing**: Identity structure → Coordinate mapping → Section formatting → Integration → User awareness
4. **Preference Integration**: User preferences → Customization processing → Prompt enhancement → Personalization → User-aware output
5. **Personalization Flow**: User data → Context analysis → Preference extraction → Customization → Personalized interaction
6. **Agent Customization**: Enhanced prompt → Agent activation → User-aware operations → Personalized responses → Context maintenance

## Configuration
### Enhanced Prompt Configuration
- **User Context Integration**: Comprehensive user context awareness with identity structure integration
- **Identity Formatting**: Advanced identity section formatting with coordinate system integration
- **Personalization System**: User preference integration with customized prompt generation
- **Context Awareness**: User-aware agent operations with personalized interaction capabilities

### User Identity Configuration
- **Transcendent Foundation**: #5-0-0 coordinate integration with transcendent identity awareness
- **Individual Identity**: #5-0-1 coordinate integration with individual identity context
- **Collective Identity**: #5-0-2 coordinate integration with collective identity resonance
- **Soul Identity**: #5-0-3 coordinate integration with soul identity and empathic attunement

### Personalization Configuration
- **Preference Integration**: User preference parsing and integration for customized interactions
- **Context Customization**: Context-aware customization with user-specific adaptations
- **Identity Awareness**: Identity-based agent awareness with personalized context integration
- **Interaction Personalization**: Personalized interaction capabilities with user context awareness

## Testing
Enhanced prompts testing available in subsystems/5_epii/tests/integration/ directory with comprehensive user context integration and personalization testing

## Related Files
### Core Dependencies
- **./epii-agent-prompts.mjs**: Base agent prompts for foundational identity and operational context
- **User Context Data**: User identity structure, profile data, and preferences

### Integration Points
- **../pipelines/epii_analysis_pipeline.mjs**: Analysis pipeline utilizing enhanced prompts
- **User Management Systems**: User management systems providing context data
- **Personalization Services**: Personalization services consuming enhanced prompts
- **Agent Interaction Systems**: Agent systems requiring user-aware prompts

### System Architecture
- **Enhanced Prompt System**: Primary enhanced prompt system for user context integration
- **User Context Awareness**: Comprehensive user context awareness with identity integration
- **Personalization Framework**: Advanced personalization framework with user preference integration
- **Identity-Based Customization**: Identity-based agent customization with user-aware operations

## Development Notes
- **Enhanced Prompt Excellence**: Comprehensive enhanced prompts enabling user context awareness and personalized agent interactions
- **User Context Integration**: Advanced user context integration with identity structure parsing and comprehensive awareness
- **Identity Framework Integration**: Sophisticated identity framework integration with #5-0 coordinate system and transcendent foundation
- **Personalization Sophistication**: Advanced personalization capabilities with user preference integration and customized interactions
- **Context Awareness**: Comprehensive context awareness enabling user-specific agent adaptations and personalized responses
- **Identity-Based Customization**: Identity-based agent customization with user identity awareness and empathic attunement
- **Development Support**: Clear enhanced prompt boundaries and comprehensive user context management
- **Production Enhancement**: Scalable enhanced prompts suitable for production user-aware agent operations
- **Debugging Excellence**: Comprehensive enhanced prompt monitoring and user context integration tracking
- **BPMCP Alignment**: Enhanced prompts integration with sophisticated Bimba coordinate system and user identity framework support
