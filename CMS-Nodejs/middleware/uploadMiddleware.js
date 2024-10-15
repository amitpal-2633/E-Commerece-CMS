// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Create the multer instance with the defined storage configuration
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Set limit to 10 MB
  });

// Export the upload middleware
module.exports = upload;
