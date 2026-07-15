const multer = require('multer');
const { imageStorage, videoStorage, documentStorage } = require('../config/cloudinary');

const uploadImage = multer({ storage: imageStorage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB
const uploadDocument = multer({ storage: documentStorage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

module.exports = { uploadImage, uploadVideo, uploadDocument };
