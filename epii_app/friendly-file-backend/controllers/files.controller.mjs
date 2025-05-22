import FileMetadata from '../models/FileMetadata.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromFile } from '../services/file.service.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads/');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Controller function for listing files
export const listFiles = async (req, res) => {
  console.log('Request received for listFiles controller');
  try {
    const filesMetadata = await FileMetadata.find({});
    console.log('Files metadata retrieved from DB:', filesMetadata);
    res.send({ files: filesMetadata });
  } catch (error) {
    console.error('Error in listFiles controller:', error);
    console.error('Error retrieving file metadata:', error.message);
    console.error('Error details:', error);
    return res.status(500).send({ message: 'Failed to list files', error: error.message });
  }
};

// Controller function for uploading a file
export const uploadFile = async (req, res) => {
  console.log('Request received for uploadFile controller');
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    const { originalname, filename, mimetype, size, path: filePath } = req.file;
    const { targetCoordinate, userId } = req.body;

    // Extract text content from the file
    const textContent = await extractTextFromFile(filePath, mimetype);

    // Create file metadata
    const fileMetadata = new FileMetadata({
      originalName: originalname,
      fileName: filename,
      mimeType: mimetype,
      size,
      path: filePath,
      uploadDate: new Date(),
      targetCoordinate: targetCoordinate || null,
      userId: userId || 'anonymous',
      textContent: textContent || null
    });

    // Save file metadata to database
    await fileMetadata.save();
    console.log('File metadata saved to DB:', fileMetadata);

    res.status(201).send({
      message: 'File uploaded successfully',
      file: {
        id: fileMetadata._id,
        originalName: fileMetadata.originalName,
        fileName: fileMetadata.fileName,
        mimeType: fileMetadata.mimeType,
        size: fileMetadata.size,
        uploadDate: fileMetadata.uploadDate,
        targetCoordinate: fileMetadata.targetCoordinate,
        contentLength: textContent ? textContent.length : 0
      }
    });
  } catch (error) {
    console.error('Error in uploadFile controller:', error);
    return res.status(500).send({ message: 'Failed to upload file', error: error.message });
  }
};

// Controller function for getting a file by ID
export const getFile = async (req, res) => {
  console.log('Request received for getFile controller');
  try {
    const fileId = req.params.id;
    const fileMetadata = await FileMetadata.findById(fileId);

    if (!fileMetadata) {
      return res.status(404).send({ message: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(fileMetadata.path)) {
      return res.status(404).send({ message: 'File not found on disk' });
    }

    // Return file metadata and content
    res.send({
      file: {
        id: fileMetadata._id,
        originalName: fileMetadata.originalName,
        fileName: fileMetadata.fileName,
        mimeType: fileMetadata.mimeType,
        size: fileMetadata.size,
        uploadDate: fileMetadata.uploadDate,
        targetCoordinate: fileMetadata.targetCoordinate,
        textContent: fileMetadata.textContent
      }
    });
  } catch (error) {
    console.error('Error in getFile controller:', error);
    return res.status(500).send({ message: 'Failed to get file', error: error.message });
  }
};

// Controller function for deleting a file by ID
export const deleteFile = async (req, res) => {
  console.log('Request received for deleteFile controller');
  try {
    const fileId = req.params.id;
    const fileMetadata = await FileMetadata.findById(fileId);

    if (!fileMetadata) {
      return res.status(404).send({ message: 'File not found' });
    }

    // Delete file from disk if it exists
    if (fs.existsSync(fileMetadata.path)) {
      fs.unlinkSync(fileMetadata.path);
    }

    // Delete file metadata from database
    await FileMetadata.findByIdAndDelete(fileId);

    res.send({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFile controller:', error);
    return res.status(500).send({ message: 'Failed to delete file', error: error.message });
  }
};
