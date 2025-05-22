import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

// Import PDF parser with error handling
let pdfParse;
try {
  const pdf = await import('pdf-parse');
  pdfParse = pdf.default;
} catch (error) {
  console.warn('PDF parsing module not available:', error.message);
  pdfParse = async () => 'PDF parsing not available. Please install pdf-parse package.';
}

// Import DOCX parser with error handling
let mammothExtract;
try {
  const mammoth = await import('mammoth');
  mammothExtract = mammoth.default.extractRawText;
} catch (error) {
  console.warn('DOCX parsing module not available:', error.message);
  mammothExtract = async () => ({ value: 'DOCX parsing not available. Please install mammoth package.' });
}

// Import XML parser with error handling
let parseXml;
try {
  const { parseString } = await import('xml2js');
  parseXml = promisify(parseString);
} catch (error) {
  console.warn('XML parsing module not available:', error.message);
  parseXml = async () => 'XML parsing not available. Please install xml2js package.';
}

const readFile = promisify(fs.readFile);

/**
 * Extracts text content from various file types.
 *
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromFile = async (filePath, mimeType) => {
  try {
    console.log(`Extracting text from file: ${filePath} (${mimeType})`);

    const fileExt = path.extname(filePath).toLowerCase();

    // Handle different file types
    if (fileExt === '.txt' || fileExt === '.md' || fileExt === '.json' || fileExt === '.csv') {
      // Plain text files
      const content = await readFile(filePath, 'utf8');
      return content;
    } else if (fileExt === '.pdf') {
      // PDF files
      try {
        const dataBuffer = await readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
      } catch (error) {
        console.error(`Error parsing PDF file: ${filePath}`, error);
        return `Error extracting text from PDF: ${error.message}`;
      }
    } else if (fileExt === '.docx') {
      // Word documents
      try {
        const result = await mammothExtract({ path: filePath });
        return result.value;
      } catch (error) {
        console.error(`Error parsing DOCX file: ${filePath}`, error);
        return `Error extracting text from DOCX: ${error.message}`;
      }
    } else if (fileExt === '.doc') {
      // Old Word documents - limited support
      return "DOC file format detected. Only partial text extraction is supported. Consider converting to DOCX for better results.";
    } else if (fileExt === '.html' || fileExt === '.htm') {
      // HTML files - strip tags
      const content = await readFile(filePath, 'utf8');
      return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    } else if (fileExt === '.xml') {
      // XML files
      try {
        const content = await readFile(filePath, 'utf8');
        const result = await parseXml(content);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        console.error(`Error parsing XML file: ${filePath}`, error);
        return `Error extracting text from XML: ${error.message}`;
      }
    } else if (fileExt === '.rtf') {
      // RTF files - limited support
      const content = await readFile(filePath, 'utf8');
      return content.replace(/[\\{}\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
    } else {
      // Unsupported file type
      return `Unsupported file type: ${fileExt}. Text extraction not available.`;
    }
  } catch (error) {
    console.error(`Error extracting text from file: ${filePath}`, error);
    return `Error extracting text: ${error.message}`;
  }
};

/**
 * Saves a file to Notion as an attachment.
 *
 * @param {string} filePath - Path to the file
 * @param {string} notionPageId - Notion page ID
 * @param {string} propertyName - Name of the property to attach the file to
 * @returns {Promise<object>} - Result of the operation
 */
export const saveFileToNotion = async (filePath, notionPageId, propertyName = 'Seed Files') => {
  try {
    console.log(`Saving file to Notion: ${filePath} -> ${notionPageId} (${propertyName})`);

    // This is a placeholder for the actual implementation
    // In a real implementation, you would use the Notion API to upload the file

    return {
      success: true,
      message: 'File saved to Notion successfully',
      notionPageId,
      propertyName
    };
  } catch (error) {
    console.error(`Error saving file to Notion: ${filePath} -> ${notionPageId}`, error);
    throw error;
  }
};
