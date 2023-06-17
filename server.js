const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const multer = require("multer");
const admin = require('firebase-admin');
const { Firestore } = require("@google-cloud/firestore");



const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'capstone-389205.appspot.com' // Firebase Storage bucket URL
});

app.use(express.json()); // Parse JSON bodies

// Set up multer storage configuration
const storage = multer.memoryStorage(); // Store file in memory

//storage configuration
const upload = multer({ storage: storage });

//  route to handle image uploads
app.post('/upload', upload.single('image'), async (req, res) => {
  const file = req.file; // Get the uploaded file

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const bucket = admin.storage().bucket();
    const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileUpload = bucket.file(uniqueFilename);

    // Create a write stream to write the file data to Firebase Storage
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });



    // Handle stream errors
    stream.on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload image' });
    });

    // Handle stream finish event
    stream.on('finish', () => {
      // File upload is complete
      res.json({ success: 'image berhasil diupload' });
    });

    // Pipe the file data into the write stream
    stream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.listen(8000, () => {
  console.log(`Server running on port 8000`);
});
