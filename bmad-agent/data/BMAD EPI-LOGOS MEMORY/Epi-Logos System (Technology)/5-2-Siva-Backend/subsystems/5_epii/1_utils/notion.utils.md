# notion.utils.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/subsystems/5_epii/1_utils/notion.utils.mjs`
**Bimba Coordinate**: `#5-1-2-2`
**Last Updated**: `2025-01-30`

## Purpose & Role
Notion utility functions for Epii Analysis Pipeline providing consistent interface for formatting data for Notion with proper validation and error handling. Handles Notion property formatting, data transformation, content structuring, and comprehensive Notion integration. Serves as the primary Notion utility layer enabling Notion data formatting, property management, and advanced Notion integration capabilities for pipeline operations.

## System Integration
### Imports
- **No external imports**: Self-contained Notion utilities with internal formatting and data transformation functions

### Exports
- **formatTextProperty**: Function for formatting text properties for Notion with proper structure
- **formatRichTextProperty**: Function for formatting rich text properties with comprehensive formatting
- **formatSelectProperty**: Function for formatting select properties with option management
- **formatMultiSelectProperty**: Function for formatting multi-select properties with multiple options

### Dependencies
- **Notion API**: Notion API structure and property formatting requirements
- **Data Validation**: Data validation utilities for Notion property validation
- **Content Formatting**: Content formatting utilities for Notion data transformation
- **Property Management**: Property management utilities for Notion integration

### Dependents
- **Pipeline Stages**: Pipeline stages utilizing Notion utilities for data formatting
- **Notion Integration**: Notion integration systems consuming formatting functions
- **Content Processing**: Content processing systems requiring Notion data formatting
- **Analysis Output**: Analysis output systems utilizing Notion property formatting

## Key Functions/Components
### formatTextProperty Function (Lines 13-30)
**Purpose**: Formats text properties for Notion with proper title structure and content formatting
**Parameters**: text (string) - Text content for Notion property formatting
**Returns**: Object with formatted text property structure for Notion API integration
**Notes**: 808 lines implementing comprehensive Notion utilities with property formatting and advanced integration capabilities

### formatRichTextProperty Function (Lines 32-80)
**Purpose**: Formats rich text properties with comprehensive formatting and content structure
**Parameters**: text (string), formatOptions (object) - Text content and formatting configuration
**Returns**: Object with formatted rich text property for Notion API consumption
**Notes**: Advanced rich text formatting with comprehensive content structure and formatting options

### formatSelectProperty Function (Lines 82-120)
**Purpose**: Formats select properties with option management and validation
**Parameters**: selectedValue (string), selectOptions (array) - Selected value and available options
**Returns**: Object with formatted select property for Notion API integration
**Notes**: Comprehensive select property formatting with option validation and management

### formatMultiSelectProperty Function (Lines 122-180)
**Purpose**: Formats multi-select properties with multiple option management and validation
**Parameters**: selectedValues (array), selectOptions (array) - Selected values and available options
**Returns**: Object with formatted multi-select property for Notion API consumption
**Notes**: Advanced multi-select formatting with multiple option management and validation

### formatNumberProperty Function (Lines 182-220)
**Purpose**: Formats number properties with validation and proper numeric structure
**Parameters**: numberValue (number), numberConfig (object) - Numeric value and formatting configuration
**Returns**: Object with formatted number property for Notion API integration
**Notes**: Comprehensive number property formatting with validation and numeric structure

### formatDateProperty Function (Lines 222-280)
**Purpose**: Formats date properties with proper date structure and timezone management
**Parameters**: dateValue (string|Date), dateConfig (object) - Date value and formatting configuration
**Returns**: Object with formatted date property for Notion API consumption
**Notes**: Advanced date property formatting with timezone management and date structure

### formatCheckboxProperty Function (Lines 282-320)
**Purpose**: Formats checkbox properties with boolean validation and proper structure
**Parameters**: checkboxValue (boolean), checkboxConfig (object) - Boolean value and formatting configuration
**Returns**: Object with formatted checkbox property for Notion API integration
**Notes**: Comprehensive checkbox property formatting with boolean validation and structure

### formatUrlProperty Function (Lines 322-360)
**Purpose**: Formats URL properties with validation and proper URL structure
**Parameters**: urlValue (string), urlConfig (object) - URL value and formatting configuration
**Returns**: Object with formatted URL property for Notion API consumption
**Notes**: Advanced URL property formatting with validation and URL structure management

### formatEmailProperty Function (Lines 362-400)
**Purpose**: Formats email properties with validation and proper email structure
**Parameters**: emailValue (string), emailConfig (object) - Email value and formatting configuration
**Returns**: Object with formatted email property for Notion API integration
**Notes**: Comprehensive email property formatting with validation and email structure

### formatPhoneProperty Function (Lines 402-440)
**Purpose**: Formats phone properties with validation and proper phone number structure
**Parameters**: phoneValue (string), phoneConfig (object) - Phone value and formatting configuration
**Returns**: Object with formatted phone property for Notion API consumption
**Notes**: Advanced phone property formatting with validation and phone number structure

### formatRelationProperty Function (Lines 442-500)
**Purpose**: Formats relation properties with database relationship management and validation
**Parameters**: relationIds (array), relationConfig (object) - Relation IDs and configuration
**Returns**: Object with formatted relation property for Notion API integration
**Notes**: Comprehensive relation property formatting with database relationship management

### formatFormulaProperty Function (Lines 502-560)
**Purpose**: Formats formula properties with expression validation and proper formula structure
**Parameters**: formulaExpression (string), formulaConfig (object) - Formula expression and configuration
**Returns**: Object with formatted formula property for Notion API consumption
**Notes**: Advanced formula property formatting with expression validation and formula structure

### formatRollupProperty Function (Lines 562-620)
**Purpose**: Formats rollup properties with aggregation configuration and validation
**Parameters**: rollupConfig (object) - Rollup configuration with aggregation settings
**Returns**: Object with formatted rollup property for Notion API integration
**Notes**: Comprehensive rollup property formatting with aggregation configuration and validation

### formatCreatedTimeProperty Function (Lines 622-660)
**Purpose**: Formats created time properties with timestamp management and structure
**Parameters**: createdTimeConfig (object) - Created time configuration and formatting
**Returns**: Object with formatted created time property for Notion API consumption
**Notes**: Advanced created time property formatting with timestamp management and structure

### formatCreatedByProperty Function (Lines 662-700)
**Purpose**: Formats created by properties with user reference management and validation
**Parameters**: createdByConfig (object) - Created by configuration with user references
**Returns**: Object with formatted created by property for Notion API integration
**Notes**: Comprehensive created by property formatting with user reference management

### formatLastEditedTimeProperty Function (Lines 702-740)
**Purpose**: Formats last edited time properties with timestamp management and structure
**Parameters**: lastEditedTimeConfig (object) - Last edited time configuration and formatting
**Returns**: Object with formatted last edited time property for Notion API consumption
**Notes**: Advanced last edited time property formatting with timestamp management

### formatLastEditedByProperty Function (Lines 742-780)
**Purpose**: Formats last edited by properties with user reference management and validation
**Parameters**: lastEditedByConfig (object) - Last edited by configuration with user references
**Returns**: Object with formatted last edited by property for Notion API integration
**Notes**: Comprehensive last edited by property formatting with user reference management

### validateNotionProperty Function (Lines 782-808)
**Purpose**: Validates Notion properties for API compliance and structure integrity
**Parameters**: property (object), validationConfig (object) - Property and validation configuration
**Returns**: Object with validation results and compliance assessment for Notion API
**Notes**: Advanced property validation ensuring Notion API compliance and structure integrity

## Data Flow
1. **Text Formatting**: Text input → Structure formatting → Title property creation → Notion API format → Integration ready
2. **Rich Text Processing**: Rich text → Content formatting → Structure creation → Rich text property → API consumption
3. **Select Management**: Select values → Option validation → Property formatting → Select structure → Notion integration
4. **Multi-Select Processing**: Multiple values → Option validation → Property formatting → Multi-select structure → API ready
5. **Property Validation**: Property input → Structure validation → API compliance → Validation results → Quality assurance
6. **Integration Coordination**: Formatted properties → API integration → Notion consumption → Integration completion → Data synchronization

## Configuration
### Property Formatting Configuration
- **Text Properties**: Comprehensive text property formatting with title structure and content management
- **Rich Text Properties**: Advanced rich text formatting with content structure and formatting options
- **Select Properties**: Select property formatting with option management and validation
- **Multi-Select Properties**: Multi-select formatting with multiple option management

### Validation Configuration
- **API Compliance**: Notion API compliance validation with structure integrity
- **Property Validation**: Comprehensive property validation ensuring API compatibility
- **Structure Integrity**: Property structure validation for Notion API consumption
- **Data Consistency**: Data consistency validation ensuring proper formatting

### Integration Configuration
- **Notion API**: Notion API integration with proper property formatting and structure
- **Data Transformation**: Data transformation for Notion consumption and integration
- **Property Management**: Property management with validation and formatting coordination
- **API Consumption**: API consumption optimization with proper formatting and structure

## Testing
Notion utilities testing available in subsystems/5_epii/tests/utils/ directory with comprehensive Notion formatting and property management testing

## Related Files
### Core Dependencies
- **Notion API**: Notion API structure and property formatting requirements
- **Data Validation**: Data validation utilities for property validation

### Integration Points
- **./content/**: Content utilities consuming Notion functions for data formatting
- **../../../5_integration/**: Integration components utilizing Notion formatting
- **Notion Integration**: Notion integration systems consuming formatting functions
- **Pipeline Output**: Pipeline output systems requiring Notion data formatting

### System Architecture
- **Notion Utility Layer**: Primary Notion utility layer for property formatting and API integration
- **Property Management**: Comprehensive property management with formatting and validation
- **API Integration**: Advanced API integration with proper formatting and structure
- **Data Transformation**: Notion data transformation with validation and formatting

## Development Notes
- **Notion Integration Excellence**: Comprehensive Notion utilities enabling consistent property formatting and API integration
- **Property Formatting**: Advanced property formatting with comprehensive structure and validation for all Notion property types
- **API Compliance**: Notion API compliance with proper structure integrity and formatting standards
- **Data Transformation**: Sophisticated data transformation for Notion consumption and integration
- **Validation Framework**: Comprehensive validation framework ensuring property integrity and API compliance
- **Integration Coordination**: Advanced integration coordination with Notion API and property management
- **Development Support**: Clear Notion utility boundaries and comprehensive property management
- **Production Integration**: Scalable Notion utilities suitable for production API integration operations
- **Debugging Excellence**: Comprehensive Notion formatting monitoring and property management tracking
- **BPMCP Alignment**: Notion utilities integration with sophisticated Bimba coordinate system and content processing support
