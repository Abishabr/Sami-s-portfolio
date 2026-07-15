const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for images (project covers, banners, gallery, profile picture, logo, favicon)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    resource_type: 'image',
  },
});

// Storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/videos',
    resource_type: 'video',
  },
});

// Storage for documents (resume PDF)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/documents',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});

module.exports = { cloudinary, imageStorage, videoStorage, documentStorage };
