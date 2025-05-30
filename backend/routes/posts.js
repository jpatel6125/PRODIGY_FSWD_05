import express from 'express'
import { body, validationResult } from 'express-validator'
import Post from '../models/Post.js'
import User from '../models/User.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

// Get posts feed
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Get current user's following list
    const currentUser = await User.findById(req.userId).select('following')
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Create feed query - if no following, show all public posts
    let feedQuery = { visibility: 'public' }
    
    if (currentUser.following && currentUser.following.length > 0) {
      feedQuery = {
        $or: [
          { author: req.userId },
          { 
            author: { $in: currentUser.following },
            visibility: { $in: ['public', 'followers'] }
          },
          { visibility: 'public' } // Include some public posts
        ]
      }
    }

    const posts = await Post.find(feedQuery)
      .populate('author', 'username fullName avatar isVerified')
      .populate('comments.author', 'username fullName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Add isLiked field
    const postsWithLiked = posts.map(post => ({
      ...post.toObject(),
      isLiked: post.likes.includes(req.userId)
    }))

    console.log(`Found ${postsWithLiked.length} posts for user ${req.userId}`)

    res.json({ posts: postsWithLiked })
  } catch (error) {
    console.error('Fetch posts error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create post
router.post('/', authenticateToken, [
  body('content').isLength({ min: 1, max: 2000 }).trim(),
  body('tags').optional().isArray(),
  body('location').optional().trim().escape(),
  body('media').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const { content, media, tags, location, visibility } = req.body

    const post = new Post({
      author: req.userId,
      content,
      media: media || [],
      tags: tags || [],
      location: location || '',
      visibility: visibility || 'public'
    })

    await post.save()
    await post.populate('author', 'username avatar fullName')

    res.status(201).json({
      message: 'Post created successfully',
      post: post.toObject()
    })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Like/Unlike post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const isLiked = post.likes.includes(req.userId)
    
    if (isLiked) {
      post.likes = post.likes.filter(id => !id.equals(req.userId))
    } else {
      post.likes.push(req.userId)
    }

    await post.save()

    res.json({
      likes: post.likes,
      isLiked: !isLiked
    })
  } catch (error) {
    console.error('Like post error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add comment
router.post('/:postId/comments', authenticateToken, [
  body('content').isLength({ min: 1, max: 500 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = {
      author: req.userId,
      content: req.body.content,
      createdAt: new Date()
    }

    post.comments.push(comment)
    await post.save()
    await post.populate('comments.author', 'username avatar')

    const newComment = post.comments[post.comments.length - 1]

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete post
router.delete('/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (!post.author.equals(req.userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this post' })
    }

    await Post.findByIdAndDelete(req.params.postId)
    
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get trending posts
router.get('/trending', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $size: '$likes' },
              { $multiply: [{ $size: '$comments' }, 2] },
              { $multiply: [{ $size: '$shares' }, 3] }
            ]
          }
        }
      },
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
          visibility: 'public'
        }
      },
      { $sort: { engagementScore: -1 } },
      { $limit: 20 }
    ])

    await Post.populate(posts, { path: 'author', select: 'username avatar fullName' })
    await Post.populate(posts, { path: 'comments.author', select: 'username avatar' })

    res.json({ posts })
  } catch (error) {
    console.error('Trending posts error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
