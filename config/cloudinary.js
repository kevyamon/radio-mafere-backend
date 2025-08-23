// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// La connexion est automatique grâce à la variable CLOUDINARY_URL dans le .env
cloudinary.config(); 

// On configure le stockage pour qu'il utilise directement notre preset
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // On spécifie simplement le nom du preset. 
    // Cloudinary s'occupe du reste (dossier, transformations, etc.)
    upload_preset: 'radiomafere_annonces' 
  },
});

const upload = multer({ storage: storage });

module.exports = upload;