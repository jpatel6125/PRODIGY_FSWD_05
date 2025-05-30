import multer from 'multer'

// Configure multer for memory storage
const storage = multer.memoryStorage()

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
}).single('avatar')

// Wrapper to handle multer errors
export const handleUploadError = (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' })
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Unexpected field name. Use "avatar" field.' })
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` })
    }
    
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    
    next()
  })
}
