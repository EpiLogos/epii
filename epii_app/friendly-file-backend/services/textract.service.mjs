import textract from 'textract';

// Service function to extract text from a buffer based on MIME type
const extractTextFromBuffer = (buffer, mimeType) => {
  return new Promise((resolve, reject) => {
    textract.fromBufferWithMime(
      mimeType,
      buffer,
      { preserveLineBreaks: true },
      (err, text) => {
        if (err) {
          console.error('Text extraction error:', err);
          if (mimeType.startsWith('text/')) {
            resolve(buffer.toString('utf-8')); // Fallback for plain text
          } else {
            reject(new Error('Unsupported file type for text extraction'));
          }
        } else {
          resolve(text.substring(0, 10000)); // Limit extracted text size
        }
      }
    );
  });
};

export default extractTextFromBuffer;
