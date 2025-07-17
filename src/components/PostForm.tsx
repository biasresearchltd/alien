import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Post, EssayPost, MoviePost, ImagePost, CarouselPost } from '../data/posts';
import { getPostById, createPost, updatePost } from '../services/postService';
import { getCategoryById, categories } from '../data/categories';
import AnimatedText from './AnimatedText';
import AnimatedList from './AnimatedList';

interface CarouselImage {
  url: string;
  caption: string;
}

const PostForm: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const isEditing = !!postId;
  
  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'essay' | 'movie' | 'image' | 'carousel'>('essay');
  const [categoryId, setCategoryId] = useState('');
  
  // Type-specific fields
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([{ url: '', caption: '' }]);
  
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // If editing, load the post data
    if (isEditing && postId) {
      const post = getPostById(postId);
      
      if (post) {
        setTitle(post.title);
        setType(post.type);
        setCategoryId(post.categoryId);
        
        // Set type-specific fields
        switch (post.type) {
          case 'essay':
            setContent((post as EssayPost).content);
            break;
          case 'movie':
            setVideoUrl((post as MoviePost).videoUrl);
            setDescription((post as MoviePost).description);
            break;
          case 'image':
            setImageUrl((post as ImagePost).imageUrl);
            setDescription((post as ImagePost).description);
            break;
          case 'carousel':
            setCarouselImages((post as CarouselPost).images);
            break;
        }
      } else {
        setError('Post not found');
      }
    }
  }, [isEditing, postId]);
  
  // Handle carousel image changes
  const handleCarouselImageChange = (index: number, field: 'url' | 'caption', value: string) => {
    const newImages = [...carouselImages];
    newImages[index][field] = value;
    setCarouselImages(newImages);
  };
  
  // Add new carousel image
  const addCarouselImage = () => {
    setCarouselImages([...carouselImages, { url: '', caption: '' }]);
  };
  
  // Remove carousel image
  const removeCarouselImage = (index: number) => {
    if (carouselImages.length > 1) {
      setCarouselImages(carouselImages.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form
      if (!title || !categoryId) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      // Validate type-specific fields
      switch (type) {
        case 'essay':
          if (!content) {
            setError('Please enter the post content');
            setIsLoading(false);
            return;
          }
          break;
        case 'movie':
          if (!videoUrl || !description) {
            setError('Please enter both video URL and description');
            setIsLoading(false);
            return;
          }
          break;
        case 'image':
          if (!imageUrl || !description) {
            setError('Please enter both image URL and description');
            setIsLoading(false);
            return;
          }
          break;
        case 'carousel':
          if (carouselImages.some(img => !img.url || !img.caption)) {
            setError('Please fill in all carousel image URLs and captions');
            setIsLoading(false);
            return;
          }
          break;
      }
      
      // Prepare the post data based on type
      let postData: Partial<Post>;
      
      switch (type) {
        case 'essay':
          postData = {
            title,
            type,
            categoryId,
            content
          };
          break;
        case 'movie':
          postData = {
            title,
            type,
            categoryId,
            videoUrl,
            description
          };
          break;
        case 'image':
          postData = {
            title,
            type,
            categoryId,
            imageUrl,
            description
          };
          break;
        case 'carousel':
          postData = {
            title,
            type,
            categoryId,
            images: carouselImages
          };
          break;
        default:
          setError('Invalid post type');
          setIsLoading(false);
          return;
      }
      
      // Save the post
      if (isEditing && postId) {
        const updatedPost = updatePost({
          ...postData,
          id: postId,
          votes: (getPostById(postId) as Post).votes
        } as Post);
        
        if (updatedPost) {
          navigate(`/post/${postId}`);
        } else {
          setError('Failed to update post');
        }
      } else {
        const newPost = createPost(postData as Omit<Post, 'id' | 'votes'>);
        navigate(`/post/${newPost.id}`);
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError('An error occurred while saving the post');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get all leaf categories for the dropdown
  const getLeafCategories = () => {
    const leafCategories: { id: string; name: string }[] = [];
    
    const traverseCategories = (cats: typeof categories, parentPath: string = '') => {
      cats.forEach(category => {
        const path = parentPath ? `${parentPath} > ${category.name}` : category.name;
        
        if (!category.subcategories || category.subcategories.length === 0) {
          leafCategories.push({ id: category.id, name: path });
        } else {
          traverseCategories(category.subcategories, path);
        }
      });
    };
    
    traverseCategories(categories);
    return leafCategories;
  };
  
  return (
    <div className="post-form-container">
      <AnimatedList staggerDelay={0.05}>
        <div className="form-header">
          <h2>
            <AnimatedText text={isEditing ? 'Edit Post' : 'Create New Post'} preserveWhitespace={true} />
          </h2>
        </div>
        
        {error && (
          <div className="error-message">
            <AnimatedText text={error} preserveWhitespace={true} />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">
              <AnimatedText text="Title:" preserveWhitespace={true} />
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">
              <AnimatedText text="Post Type:" preserveWhitespace={true} />
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              disabled={isLoading || isEditing}
              className="form-select"
            >
              <option value="essay">Essay</option>
              <option value="movie">Movie</option>
              <option value="image">Image</option>
              <option value="carousel">Image Carousel</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="category">
              <AnimatedText text="Category:" preserveWhitespace={true} />
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isLoading}
              required
              className="form-select"
            >
              <option value="">Select a category</option>
              {getLeafCategories().map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Type-specific fields */}
          {type === 'essay' && (
            <div className="form-group">
              <label htmlFor="content">
                <AnimatedText text="Content:" preserveWhitespace={true} />
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
                required
                rows={10}
                className="form-textarea"
              />
            </div>
          )}
          
          {type === 'movie' && (
            <>
              <div className="form-group">
                <label htmlFor="videoUrl">
                  <AnimatedText text="Video URL:" preserveWhitespace={true} />
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={isLoading}
                  required
                  className="form-input"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="movieDescription">
                  <AnimatedText text="Description:" preserveWhitespace={true} />
                </label>
                <textarea
                  id="movieDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  required
                  rows={5}
                  className="form-textarea"
                />
              </div>
            </>
          )}
          
          {type === 'image' && (
            <>
              <div className="form-group">
                <label htmlFor="imageUrl">
                  <AnimatedText text="Image URL:" preserveWhitespace={true} />
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isLoading}
                  required
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="imageDescription">
                  <AnimatedText text="Description:" preserveWhitespace={true} />
                </label>
                <textarea
                  id="imageDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  required
                  rows={5}
                  className="form-textarea"
                />
              </div>
            </>
          )}
          
          {type === 'carousel' && (
            <div className="carousel-form-fields">
              <div className="carousel-header">
                <h3>
                  <AnimatedText text="Carousel Images" preserveWhitespace={true} />
                </h3>
                <button
                  type="button"
                  onClick={addCarouselImage}
                  disabled={isLoading}
                  className="add-image-button"
                >
                  Add Image
                </button>
              </div>
              
              {carouselImages.map((image, index) => (
                <div key={index} className="carousel-image-form">
                  <div className="form-group">
                    <label>
                      <AnimatedText text={`Image ${index + 1} URL:`} preserveWhitespace={true} />
                    </label>
                    <input
                      type="url"
                      value={image.url}
                      onChange={(e) => handleCarouselImageChange(index, 'url', e.target.value)}
                      disabled={isLoading}
                      required
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <AnimatedText text={`Image ${index + 1} Caption:`} preserveWhitespace={true} />
                    </label>
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => handleCarouselImageChange(index, 'caption', e.target.value)}
                      disabled={isLoading}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  {carouselImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCarouselImage(index)}
                      disabled={isLoading}
                      className="remove-image-button"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </AnimatedList>
    </div>
  );
};

export default PostForm; 