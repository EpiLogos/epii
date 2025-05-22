import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  listDocuments,
  listDocumentsByCoordinate,
  uploadDocument,
  getDocument,
  updateDocumentCoordinate,
  updateDocumentContent,
  deleteDocument,
  startDocumentAnalysis
} from '../controllers/documents.controller.mjs';

const router = express.Router();

// Configure multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads/');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Debug route to test API connectivity
router.get('/debug', (req, res) => {
  res.status(200).json({
    message: 'Documents API is working',
    timestamp: new Date().toISOString()
  });
});

// Document routes
router.get('/', listDocuments);
router.get('/by-coordinate/:coordinate', listDocumentsByCoordinate);
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:id', getDocument);
router.patch('/:id/coordinate', updateDocumentCoordinate);
router.patch('/:id/content', updateDocumentContent);
router.delete('/:id', deleteDocument);
router.post('/:id/analyze', startDocumentAnalysis);

export default router;
