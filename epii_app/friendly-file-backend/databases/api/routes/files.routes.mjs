import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { listFiles, uploadFile, getFile, deleteFile } from '../controllers/files.controller.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function(req, file, cb) {
        // Use original filename but add timestamp to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = path.extname(file.originalname);
        const fileName = path.basename(file.originalname, fileExt) + '-' + uniqueSuffix + fileExt;
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        // Accept text files, PDFs, and common document formats
        const allowedFileTypes = [
            '.txt', '.pdf', '.doc', '.docx', '.md', '.json', '.csv',
            '.html', '.htm', '.xml', '.rtf'
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only text files, PDFs, and common document formats are allowed.'));
        }
    }
});

const router = express.Router();

// Route for listing files
router.get('/', listFiles);

// Route for uploading a file
router.post('/upload', upload.single('file'), uploadFile);

// Route for getting a file by ID
router.get('/:id', getFile);

// Route for deleting a file by ID
router.delete('/:id', deleteFile);

export default router;
