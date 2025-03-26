const multer = require('multer');
const express = require('express');
const cors = require('cors');

const corsOptions = {
  origin: '*', // Allow all origins for testing
  credentials: true,
};
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../friendly-file-front/.env') }); // Load environment variables from .env file, specifying path

console.log('Starting Friendly File Backend Server...'); // Startup log
console.log('Backend API Key from .env:', process.env.VITE_API_KEY_1); // Check if API key is loaded
console.log('Environment Variables:', process.env); // Log all environment variables
const app = express();
const port = 3001; // Choose a different port than the frontend

console.log('Applying CORS middleware with options:', corsOptions); // CORS log
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const mongoURI = "mongodb://frankgtaylor97:lDPggZVcybd2JOPe@epiitest-shard-00-00.ijqgh.mongodb.net:27017,epiitest-shard-00-01.ijqgh.mongodb.net:27017,epiitest-shard-00-02.ijqgh.mongodb.net:27017/?replicaSet=atlas-t7t6t9-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=EpiiTest";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connection status: Success'); // Explicit success log
    console.log('Connected to MongoDB Atlas');
  })
  .catch(error => {
    console.error('MongoDB connection status: Failure'); // Explicit failure log
    console.error('MongoDB connection error details:', error); // Verbose error logging
    console.error('MongoDB connection error:', error.message);
  });

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// Define FileMetadata schema
const FileMetadataSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  contentType: { type: String },
  gridfsId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const FileMetadata = mongoose.model('FileMetadata', FileMetadataSchema, 'file_metadata'); // Specify collection name

const uploadMiddleware = multer().single('file');

app.get('/', (req, res) => {
  res.send('Hello from Friendly File Backend!');
});

app.post('/upload', uploadMiddleware, (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const uploadStream = gfs.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
    metadata: {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
    }
  });

  uploadStream.on('error', (error) => {
    console.error('GridFS upload error:', error);
    return res.status(500).send({ message: 'File upload failed to GridFS', error: error.message });
  });

  uploadStream.on('finish', async () => {
    const fileMetadata = new FileMetadata({
      filename: req.file.originalname,
      size: req.file.size,
      contentType: req.file.mimetype,
      gridfsId: uploadStream.id
    });

    try {
      await fileMetadata.save();
      res.send({ message: 'File uploaded successfully to GridFS and metadata saved', fileMetadata: fileMetadata });
    } catch (error) {
      console.error('Error saving file metadata:', error);
      return res.status(500).send({ message: 'File metadata save failed', error: error.message });
    }
  });

  uploadStream.write(req.file.buffer);
  uploadStream.end();
});

app.get('/files', async (req, res) => {
  console.log('Request received for /files'); // Add log at the start of the route
  try {
    const filesMetadata = await FileMetadata.find({});
    console.log('Files metadata retrieved from DB:', filesMetadata); // Log the metadata
    res.send({ files: filesMetadata });
  } catch (error) {
    console.error('Error in /files route:', error); // General error log
    console.error('Error retrieving file metadata:', error.message); // Specific error message
    console.error('Error details:', error); // Log full error object for details
    return res.status(500).send({ message: 'Failed to list files', error: error.message });
  }
});

const axios = require('axios');

app.post('/api/chat', async (req, res) => {
  console.log("Entering /api/chat endpoint handler - Gemini Hardcoded");
  // Expect message from the frontend
  const { message } = req.body;
  console.log('Chat request received:', { message });

  // Hardcoded API key and model for Gemini - NOT reading from .env anymore
  const apiKey = "AIzaSyD3b-F7isiGysNOwUM5yo-pLESWvbfGQYg";
  const model = 'gemini-2.0-flash'; // Corrected model name to gemini-2.0-flash
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
  console.log('Gemini API URL (Hardcoded):', apiUrl); // Log the Gemini API URL

  try {
    const response = await axios.post(apiUrl, {
      contents: [{
        parts: [{
          text: message // Use the message from the chat input here
        }]
      }],
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    console.log('Gemini AI Response:', aiResponse);
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Gemini API call failed:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});


app.listen(port, () => {
console.log('Server listening on port ' + port); // More explicit port log
console.log('Server URL: http://localhost:' + port); // Log the full URL
console.log('Backend server started successfully'); // Success confirmation
});
