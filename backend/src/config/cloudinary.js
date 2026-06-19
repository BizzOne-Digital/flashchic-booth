const cloudinary = require('cloudinary').v2
const multer = require('multer')
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Use memoryStorage — no disk needed, stream directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Invalid file type'), false)
  },
})

// Helper: upload buffer to Cloudinary and return result
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith('video') ? 'video' : 'image'
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'flashchic',
        resource_type: resourceType,
        transformation: resourceType === 'image'
          ? [{ quality: 'auto', fetch_format: 'auto' }]
          : [],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })
}

module.exports = { cloudinary, upload, uploadToCloudinary }
