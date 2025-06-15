import express from 'express';
// import multer from 'multer'; // Removed unused import
import chatController from '../controllers/chat.controller.mjs'; // Import the default export

const router = express.Router();

// Configure multer for file uploads - Removed as uploadChatFile is not implemented/exported
// const storage = multer.memoryStorage();
// const uploadMiddleware = multer({ storage: storage }).single('file');

// Route for uploading files within the chat context - Removed
// router.post('/upload', uploadMiddleware, uploadChatFile);

// Route for processing chat messages
router.post('/', chatController.handleChatRequest); // Use the correct imported function

export default router;
