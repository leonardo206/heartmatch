const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const router = express.Router();

// Configurazione multer per l'upload delle immagini
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Genera un nome file unico con timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accetta solo immagini
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload immagine profilo
router.post('/profile-image', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('🔍 Upload - Request received');
    console.log('🔍 Upload - Files:', req.files);
    console.log('🔍 Upload - File:', req.file);
    console.log('🔍 Upload - Body:', req.body);
    
    if (!req.file) {
      console.log('❌ Upload - No file received');
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Genera l'URL dell'immagine
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Aggiorna il profilo dell'utente con la nuova immagine
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Aggiungi la nuova immagine all'array photos
    if (!user.photos) {
      user.photos = [];
    }
    
    // Se è la prima immagine, rendila primaria
    const isPrimary = user.photos.length === 0;
    user.photos.push(imageUrl);
    
    await user.save();

    res.json({
      success: true,
      imageUrl: imageUrl,
      isPrimary: isPrimary,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// Servi le immagini statiche
router.use('/uploads', express.static('uploads'));

module.exports = router;
