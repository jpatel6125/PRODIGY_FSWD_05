import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// Upload media files
router.post('/upload', authenticateToken, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'social-media',
            transformation: file.mimetype.startsWith('image/') 
              ? [{ width: 1080, height: 1080, crop: 'limit', quality: 'auto' }]
              : [{ width: 1080, height: 1080, crop: 'limit', quality: 'auto', video_codec: 'auto' }]
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve({
                url: result.secure_url,
                type: file.mimetype.startsWith('image/') ? 'image' : 'video',
                publicId: result.public_id
              })
            }
          }
        )
        uploadStream.end(file.buffer)
      })
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Upload failed', error: error.message })
  }
})

export default router
