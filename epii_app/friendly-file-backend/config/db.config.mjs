import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Load MongoDB URI and DB name from environment variables
const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'EpiiTest';

if (!mongoURI) {
  console.error('MongoDB connection status: Failure');
  console.error('MongoDB connection error: MONGODB_URI not found in environment variables.');
  process.exit(1); // Exit if URI is missing
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbName // Explicitly set the database name
    });
    console.log('MongoDB connection status: Success');
    console.log(`Connected to MongoDB Atlas database: ${dbName}`);
  } catch (error) {
    console.error('MongoDB connection status: Failure');
    console.error('MongoDB connection error details:', error);
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process on database connection failure
  }
};

export default connectDB;
