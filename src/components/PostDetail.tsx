import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../data/posts';
import { getPostById, votePost, getPostThread } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import AnimatedText from './AnimatedText';
import AnimatedList from './AnimatedList';
import PostResponses from './PostResponses';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseCount, setResponseCount] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (postId) {
      const fetchedPost = getPostById(postId);
      
      if (fetchedPost) {
        setPost(fetchedPost);
        // Count responses (direct and nested)
        const thread = getPostThread(postId);
        // Subtract 1 for the original post
        setResponseCount(Math.max(0, thread.length - 1));
      } else {
        setError('Post not found');
      }
      
      setIsLoading(false);
    }
  }, [postId]);
  
  const handleVote = (increment: boolean = true) => {
    if (!postId || !post) return;
    
    const updatedPost = votePost(postId, increment);
    if (updatedPost) {
      setPost(updatedPost);
    }
  };
  
  const handleEdit = () => {
    if (postId) {
      navigate(`/post/edit/${postId}`);
    }
  };

  const handleResponseAdded = (newResponse: Post) => {
    // Update response count
    setResponseCount(prevCount => prevCount + 1);
  };
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!post) {
    return <div className="not-found">Post not found</div>;
  }
  
  const renderPostContent = () => {
    switch (post.type) {
      case 'essay':
        return (
          <div className="post-content essay-content">
            <AnimatedText text={post.content} element="p" preserveWhitespace={true} />
          </div>
        );
        
      case 'movie':
        return (
          <div className="post-content movie-content">
            <div className="video-container">
              <iframe 
                src={post.videoUrl} 
                title={post.title} 
                width="560" 
                height="315" 
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <AnimatedText text={post.description} element="p" preserveWhitespace={true} />
          </div>
        );
        
      case 'image':
        return (
          <div className="post-content image-content">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="post-image" 
            />
            <AnimatedText text={post.description} element="p" preserveWhitespace={true} />
          </div>
        );
        
      case 'carousel':
        return (
          <div className="post-content carousel-content">
            <AnimatedList staggerDelay={0.05} component="div" className="carousel-images">
              {post.images.map((image, index) => (
                <div key={index} className="carousel-item">
                  <img 
                    src={image.url} 
                    alt={image.caption} 
                    className="carousel-image"
                  />
                  <div className="caption">
                    <AnimatedText text={image.caption} preserveWhitespace={true} />
                  </div>
                </div>
              ))}
            </AnimatedList>
          </div>
        );
        
      default:
        return <div>Unknown post type</div>;
    }
  };
  
  return (
    <div className="post-detail">
      <AnimatedList staggerDelay={0.05}>
        <h2><AnimatedText text={post.title} preserveWhitespace={true} /></h2>
        
        <div className="post-meta">
          <div className="post-info">
            <span className="post-type">
              <AnimatedText text={`Type: ${post.type}`} preserveWhitespace={true} />
            </span>
            <span className="post-author">
              {post.authorName && (
                <AnimatedText text={` • Posted by: ${post.authorName}`} preserveWhitespace={true} />
              )}
            </span>
            <span className="post-date">
              <AnimatedText 
                text={` • ${new Date(post.createdAt).toLocaleDateString()}`} 
                preserveWhitespace={true} 
              />
            </span>
          </div>
          
          <span className="post-votes">
            <AnimatedText text={`Votes: ${post.votes}`} preserveWhitespace={true} />
          </span>
        </div>
        
        {renderPostContent()}
        
        <div className="post-actions">
          {isAuthenticated && (
            <>
              <button 
                onClick={() => handleVote(true)} 
                className="vote-button upvote"
              >
                Upvote
              </button>
              <button 
                onClick={() => handleVote(false)} 
                className="vote-button downvote"
              >
                Downvote
              </button>
              {post.authorId === null || post.authorId === undefined || (
                <button 
                  onClick={handleEdit} 
                  className="edit-button"
                >
                  Edit Post
                </button>
              )}
            </>
          )}
          <button 
            onClick={() => navigate(-1)} 
            className="back-button"
          >
            Back
          </button>
        </div>
        
        <div className="response-stats">
          <AnimatedText 
            text={`${responseCount} ${responseCount === 1 ? 'response' : 'responses'}`} 
            preserveWhitespace={true}
          />
        </div>
      </AnimatedList>
      
      {/* Responses section */}
      <div className="post-responses-section">
        <PostResponses 
          postId={postId || ''} 
          onResponseAdded={handleResponseAdded} 
        />
      </div>
    </div>
  );
};

export default PostDetail; 