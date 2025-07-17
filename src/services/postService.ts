import { Post, examplePosts, EssayPost, MoviePost, ImagePost, CarouselPost } from '../data/posts';
// Removing unused import that's causing linter warning
// import { useAuth } from '../context/AuthContext';

// We'll use localStorage to persist post changes in this example
// In a real application, this would be replaced with API calls

const STORAGE_KEY = 'alien_posts';

// Helper to initialize posts from localStorage or use example posts
function getStoredPosts(): Post[] {
  const storedPosts = localStorage.getItem(STORAGE_KEY);
  if (storedPosts) {
    try {
      return JSON.parse(storedPosts);
    } catch (error) {
      console.error('Error parsing stored posts:', error);
      return [...examplePosts];
    }
  }
  return [...examplePosts]; // Return a copy to avoid modifying the original
}

// Helper to save posts to localStorage
function savePostsToStorage(posts: Post[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// Get all posts
export function getAllPosts(): Post[] {
  return getStoredPosts();
}

// Get post by ID
export function getPostById(id: string): Post | undefined {
  const posts = getStoredPosts();
  return posts.find(post => post.id === id);
}

// Get posts by category ID
export function getPostsByCategoryId(categoryId: string): Post[] {
  const posts = getStoredPosts();
  // Only return top-level posts (not responses) for categories
  return posts.filter(post => post.categoryId === categoryId && !post.responseToId);
}

// Get responses to a specific post
export function getPostResponses(postId: string): Post[] {
  const posts = getStoredPosts();
  return posts.filter(post => post.responseToId === postId);
}

// Get thread of posts (original post and all its responses, including nested ones)
export function getPostThread(postId: string): Post[] {
  const posts = getStoredPosts();
  const originalPost = posts.find(post => post.id === postId);
  
  if (!originalPost) {
    return [];
  }
  
  // Get all direct responses to this post
  const directResponses = posts.filter(post => post.responseToId === postId);
  
  // For each direct response, get its nested responses recursively
  const nestedResponses = directResponses.flatMap(response => 
    getPostThread(response.id).filter(post => post.id !== response.id)
  );
  
  return [originalPost, ...directResponses, ...nestedResponses];
}

// Create a new post
export function createPost(post: Omit<Post, 'id' | 'votes' | 'responses' | 'createdAt'>): Post {
  const posts = getStoredPosts();
  
  // Generate a new ID
  const newId = Date.now().toString();
  
  // Create the full post with default values
  const newPost: Post = {
    ...post as any, // TypeScript needs this, we'll ensure correct type below
    id: newId,
    votes: 0,
    responses: [],
    createdAt: Date.now()
  };
  
  // Ensure we have the correct type properties
  switch (post.type) {
    case 'essay':
      (newPost as EssayPost).content = (post as Omit<EssayPost, 'id' | 'votes' | 'responses' | 'createdAt'>).content;
      break;
    case 'movie':
      (newPost as MoviePost).videoUrl = (post as Omit<MoviePost, 'id' | 'votes' | 'responses' | 'createdAt'>).videoUrl;
      (newPost as MoviePost).description = (post as Omit<MoviePost, 'id' | 'votes' | 'responses' | 'createdAt'>).description;
      break;
    case 'image':
      (newPost as ImagePost).imageUrl = (post as Omit<ImagePost, 'id' | 'votes' | 'responses' | 'createdAt'>).imageUrl;
      (newPost as ImagePost).description = (post as Omit<ImagePost, 'id' | 'votes' | 'responses' | 'createdAt'>).description;
      break;
    case 'carousel':
      (newPost as CarouselPost).images = (post as Omit<CarouselPost, 'id' | 'votes' | 'responses' | 'createdAt'>).images;
      break;
  }
  
  // If this is a response to another post, update the parent post
  if (post.responseToId) {
    const parentIndex = posts.findIndex(p => p.id === post.responseToId);
    if (parentIndex !== -1) {
      // Add this post's ID to the parent's responses array
      posts[parentIndex].responses = posts[parentIndex].responses || [];
      posts[parentIndex].responses!.push(newId);
    }
  }
  
  // Save to storage
  posts.push(newPost);
  savePostsToStorage(posts);
  
  return newPost;
}

// Create a response to an existing post
export function createPostResponse(parentPostId: string, response: Omit<Post, 'id' | 'votes' | 'responses' | 'createdAt' | 'responseToId'>): Post | null {
  const posts = getStoredPosts();
  const parentPost = posts.find(post => post.id === parentPostId);
  
  if (!parentPost) {
    return null;
  }
  
  // Create the response, linking it to the parent
  return createPost({
    ...response,
    responseToId: parentPostId,
    // Use the same category as the parent
    categoryId: response.categoryId || parentPost.categoryId
  });
}

// Update an existing post
export function updatePost(updatedPost: Post): Post | null {
  const posts = getStoredPosts();
  const index = posts.findIndex(post => post.id === updatedPost.id);
  
  if (index === -1) {
    return null;
  }
  
  // Preserve responses array and other metadata that shouldn't be overwritten
  updatedPost.responses = posts[index].responses || [];
  updatedPost.createdAt = posts[index].createdAt;
  
  posts[index] = updatedPost;
  savePostsToStorage(posts);
  
  return updatedPost;
}

// Delete a post and all its responses
export function deletePost(id: string): boolean {
  const posts = getStoredPosts();
  
  // Find the post and its responses
  const postToDelete = posts.find(post => post.id === id);
  if (!postToDelete) {
    return false;
  }
  
  // Remove this post from its parent's responses array
  if (postToDelete.responseToId) {
    const parentIndex = posts.findIndex(p => p.id === postToDelete.responseToId);
    if (parentIndex !== -1 && posts[parentIndex].responses) {
      posts[parentIndex].responses = posts[parentIndex].responses!.filter(
        responseId => responseId !== id
      );
    }
  }
  
  // Get all response IDs (including nested ones) that need to be deleted
  const allResponseIds = new Set<string>();
  
  // Helper function to collect all response IDs recursively
  const collectResponseIds = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && post.responses) {
      post.responses.forEach(responseId => {
        allResponseIds.add(responseId);
        collectResponseIds(responseId);
      });
    }
  };
  
  collectResponseIds(id);
  
  // Filter out the post and all its responses
  const filteredPosts = posts.filter(post => 
    post.id !== id && !allResponseIds.has(post.id)
  );
  
  if (filteredPosts.length === posts.length) {
    return false; // Nothing was deleted
  }
  
  savePostsToStorage(filteredPosts);
  return true;
}

// Vote on a post
export function votePost(id: string, increment: boolean = true): Post | null {
  const posts = getStoredPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Increment or decrement votes
  posts[index].votes += increment ? 1 : -1;
  savePostsToStorage(posts);
  
  return posts[index];
} 