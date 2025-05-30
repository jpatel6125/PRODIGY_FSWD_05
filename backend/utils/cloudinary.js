import axios from 'axios'

export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData()
    formData.append('files', file)

    const response = await axios.post('/api/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data.files[0]
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await axios.delete('/api/media/delete', {
      data: { publicId }
    })
    
    return response.status === 200
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error)
    return false
  }
}
