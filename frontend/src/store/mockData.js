// Mock data for development
export const mockUser = {
  _id: '1',
  username: 'johndoe',
  fullName: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=ffffff',
  bio: 'Frontend Developer | React Enthusiast | Coffee Lover',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  followers: ['2', '3', '4'],
  following: ['2', '5'],
  isVerified: true,
  createdAt: '2023-01-15T10:30:00Z'
}

export const mockStories = [
  {
    id: '1',
    username: 'alice',
    avatar: 'https://ui-avatars.com/api/?name=Alice&background=10b981&color=ffffff'
  },
  {
    id: '2', 
    username: 'bob',
    avatar: 'https://ui-avatars.com/api/?name=Bob&background=8b5cf6&color=ffffff'
  },
  {
    id: '3',
    username: 'charlie',
    avatar: 'https://ui-avatars.com/api/?name=Charlie&background=f59e0b&color=ffffff'
  }
]

export const mockPosts = [
  {
    _id: '1',
    author: {
      _id: '1',
      username: 'johndoe',
      fullName: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=ffffff'
    },
    content: 'Just finished building an amazing React component! 🚀',
    media: [],
    likes: ['2', '3'],
    comments: [
      {
        _id: 'c1',
        author: {
          username: 'alice',
          avatar: 'https://ui-avatars.com/api/?name=Alice&background=10b981&color=ffffff'
        },
        content: 'Looks awesome!',
        createdAt: '2024-01-15T12:00:00Z'
      }
    ],
    tags: ['react', 'javascript'],
    location: 'San Francisco',
    isLiked: false,
    createdAt: '2024-01-15T10:30:00Z'
  }
]
