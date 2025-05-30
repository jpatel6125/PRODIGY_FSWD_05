import express from 'express'
import User from '../models/User.js'
import Post from '../models/Post.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

// Follow/Unfollow user
router.post('/:id/follow', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.userId

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' })
    }

    const targetUser = await User.findById(targetUserId)
    const currentUser = await User.findById(currentUserId)

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isFollowing = currentUser.following.includes(targetUserId)

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId)
      targetUser.followers.pull(currentUserId)
    } else {
      // Follow
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)
    }

    await currentUser.save()
    await targetUser.save()

    res.json({
      message: isFollowing ? 'User unfollowed' : 'User followed',
      user: currentUser,
      isFollowing: !isFollowing
    })
  } catch (error) {
    console.error('Follow/unfollow error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username fullName avatar')
      .populate('following', 'username fullName avatar')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'username avatar fullName')
      .populate('comments.author', 'username avatar')
      .sort({ createdAt: -1 })

    const isFollowing = user.followers.some(follower => 
      follower._id.toString() === req.userId
    )

    res.json({
      user: {
        ...user.toJSON(),
        isFollowing,
        postsCount: posts.length,
        followersCount: user.followers.length,
        followingCount: user.following.length
      },
      posts
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Search users
router.get('/search/:query', authenticateToken, async (req, res) => {
  try {
    const query = req.params.query.trim()
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters long' })
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: req.userId } // Exclude current user from results
    })
    .select('username fullName avatar isVerified bio')
    .limit(20)

    res.json({ users })
  } catch (error) {
    console.error('Search users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user suggestions
router.get('/suggestions/for-you', authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId)
    
    // Get users not followed by current user
    const suggestions = await User.find({
      _id: { 
        $ne: req.userId,
        $nin: currentUser.following 
      }
    })
    .select('username fullName avatar isVerified')
    .limit(10)
    .sort({ followers: -1 })

    res.json({ suggestions })
  } catch (error) {
    console.error('Get suggestions error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
