import express from 'express'
import Notification from '../models/Notification.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const notifications = await Notification.find({ recipient: req.userId })
      .populate('sender', 'username avatar fullName')
      .populate('postId', 'content media')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const unreadCount = await Notification.countDocuments({
      recipient: req.userId,
      read: false
    })

    res.json({ 
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: req.params.notificationId,
        recipient: req.userId 
      },
      { 
        read: true,
        readAt: new Date()
      },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json({ 
      message: 'Notification marked as read',
      notification 
    })
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark all notifications as read
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { 
        recipient: req.userId,
        read: false 
      },
      { 
        read: true,
        readAt: new Date()
      }
    )

    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      recipient: req.userId
    })

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json({ message: 'Notification deleted successfully' })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
