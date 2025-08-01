# file.service.mjs - BMAD Memory Documentation

## File Location
**Path**: `epii_app/friendly-file-backend/databases/shared/services/file.service.mjs`
**Bimba Coordinate**: `[TO BE ASSIGNED]`
**Last Updated**: `2025-01-30`

## Purpose & Role
File Service providing text extraction from various file types and file management operations. Handles PDF, DOCX, HTML, XML, RTF, and plain text files with graceful error handling and optional dependency loading. Supports document upload processing, text content extraction for analysis, and Notion integration for file attachments. Serves as the universal file processing layer for the backend system.

## System Integration
### Imports
- **fs**: File system operations for reading files
- **path**: File system path utilities
- **promisify**: Convert callback-based functions to promises
- **fileURLToPath**: ES module URL to file path conversion
- **pdf-parse**: PDF text extraction (optional dependency)
- **mammoth**: DOCX text extraction (optional dependency)
- **xml2js**: XML parsing (optional dependency)

### Exports
- **extractTextFromFile**: Extract text content from various file types
- **saveFileToNotion**: Save file to Notion as attachment (placeholder implementation)

### Dependencies
- **Node.js Built-ins**: fs, path, promisify for core file operations
- **Optional Dependencies**: pdf-parse, mammoth, xml2js with graceful fallback
- **File System**: File reading and processing operations

### Dependents
- **Documents Controller**: Primary consumer for file upload text extraction
- **Document Processing**: Text extraction for document analysis
- **File Upload Workflows**: Text content extraction from uploaded files

## Key Functions/Components
### extractTextFromFile(filePath, mimeType) (Lines 45-104)
**Purpose**: Extract text content from various file types with comprehensive format support
**Parameters**: filePath (string), mimeType (string)
**Returns**: Promise<string> - Extracted text content
**Notes**: 132 lines implementing comprehensive file type support with error handling

### Optional Dependency Loading (Lines 7-34)
**Purpose**: Load parsing libraries with graceful error handling for missing dependencies
**Parameters**: None (module-level imports)
**Returns**: Loaded modules or fallback functions
**Notes**: pdf-parse, mammoth, xml2js with fallback messages for missing packages

### Plain Text Processing (Lines 52-55)
**Purpose**: Handle plain text files (TXT, MD, JSON, CSV)
**Parameters**: File path
**Returns**: Raw file content as UTF-8 string
**Notes**: Direct file reading for text-based formats

### PDF Processing (Lines 56-65)
**Purpose**: Extract text from PDF files using pdf-parse library
**Parameters**: File path
**Returns**: Extracted text content from PDF
**Notes**: Binary file reading, pdf-parse integration, error handling

### DOCX Processing (Lines 66-74)
**Purpose**: Extract text from Word documents using mammoth library
**Parameters**: File path
**Returns**: Raw text content from DOCX
**Notes**: mammoth.extractRawText integration, error handling

### HTML Processing (Lines 78-81)
**Purpose**: Extract text from HTML files by stripping tags
**Parameters**: File path
**Returns**: Text content with HTML tags removed
**Notes**: Regex-based tag stripping, whitespace normalization

### XML Processing (Lines 82-91)
**Purpose**: Parse XML files and convert to JSON representation
**Parameters**: File path
**Returns**: JSON string representation of XML structure
**Notes**: xml2js integration, structured data extraction

### RTF Processing (Lines 92-95)
**Purpose**: Basic text extraction from RTF files
**Parameters**: File path
**Returns**: Text content with RTF formatting removed
**Notes**: Limited support, regex-based cleanup

### saveFileToNotion(filePath, notionPageId, propertyName) (Lines 114-131)
**Purpose**: Save file to Notion as attachment (placeholder implementation)
**Parameters**: filePath (string), notionPageId (string), propertyName (string, default: 'Seed Files')
**Returns**: Promise<object> - Operation result
**Notes**: Placeholder implementation for future Notion API integration

## Data Flow
1. **File Processing**: File path received → File type detection → Appropriate parser selection → Text extraction
2. **Dependency Handling**: Parser needed → Dependency check → Load library or fallback → Processing continues
3. **Text Extraction**: File read → Format-specific processing → Text content returned → Error handling
4. **Error Handling**: Processing error → Error logging → Fallback message → Graceful degradation
5. **Notion Integration**: File attachment → Notion API call → Result processing → Response

## Configuration
### Supported File Types
- **Plain Text**: .txt, .md, .json, .csv (direct UTF-8 reading)
- **PDF**: .pdf (pdf-parse library integration)
- **Word Documents**: .docx (mammoth library), .doc (limited support)
- **Web Formats**: .html, .htm (tag stripping)
- **Structured Data**: .xml (xml2js parsing)
- **Rich Text**: .rtf (basic text extraction)

### Optional Dependencies
- **pdf-parse**: PDF text extraction (graceful fallback if missing)
- **mammoth**: DOCX text extraction (graceful fallback if missing)
- **xml2js**: XML parsing (graceful fallback if missing)

### Error Handling
- **Missing Dependencies**: Graceful fallback with informative messages
- **File Processing Errors**: Comprehensive error logging and user-friendly messages
- **Unsupported Formats**: Clear messaging for unsupported file types

### Processing Options
- **Text Normalization**: Whitespace cleanup for HTML and RTF
- **Encoding**: UTF-8 encoding for text-based files
- **Binary Handling**: Proper binary file reading for PDF processing

## Testing
No explicit test files referenced, but includes comprehensive error handling and logging

## Related Files
### Core Dependencies
- **Documents Controller**: Primary consumer for file upload processing
- Node.js built-in modules for file system operations

### Integration Points
- **Document Upload**: Text extraction during file upload process
- **Document Analysis**: Text content preparation for analysis pipelines
- **File Management**: Universal file processing across the system

### Optional Libraries
- **pdf-parse**: PDF text extraction library
- **mammoth**: DOCX text extraction library
- **xml2js**: XML parsing library

## Development Notes
- **Graceful Degradation**: Optional dependencies with fallback messages for missing packages
- **Comprehensive Format Support**: Wide range of file types with appropriate processing
- **Error Resilience**: Comprehensive error handling for all processing stages
- **Performance Optimization**: Efficient file reading with appropriate encoding
- **Extensible Design**: Easy to add new file type support
- **Memory Management**: Proper handling of binary and text file reading
- **Encoding Handling**: UTF-8 encoding for text-based files
- **Placeholder Integration**: Notion integration placeholder for future implementation
- **Logging Strategy**: Comprehensive logging for debugging and monitoring
- **Modular Processing**: Clean separation of processing logic per file type
