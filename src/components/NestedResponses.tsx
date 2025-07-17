import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, EssayPost, ImagePost } from '../data/posts';
import { getPostResponses, createPostResponse } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import AnimatedText from './AnimatedText';
import AnimatedList from './AnimatedList';

interface NestedResponsesProps {
  parentId: string;
  depth?: number;
  maxDepth?: number;
  onResponseAdded?: (post: Post) => void;
}

/**
 * Component to display nested responses in a threaded view
 * Will recursively render child responses up to maxDepth
 */
const NestedResponses: React.FC<NestedResponsesProps> = ({ 
  parentId, 
  depth = 0, 
  maxDepth = 5,
  onResponseAdded
}) => {
  const [responses, setResponses] = useState<Post[]>([]);
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyType, setReplyType] = useState<'essay' | 'image'>('essay');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load post responses for this parent
    const fetchResponses = () => {
      try {
        const fetchedResponses = getPostResponses(parentId);
        // Sort by created date, newest first
        fetchedResponses.sort((a, b) => b.createdAt - a.createdAt);
        setResponses(fetchedResponses);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('Failed to load responses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, [parentId]);

  const toggleResponseExpansion = (responseId: string) => {
    setExpandedResponses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(responseId)) {
        newSet.delete(responseId);
      } else {
        newSet.add(responseId);
      }
      return newSet;
    });
  };

  const handleShowReplyForm = (responseId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowReplyForm(responseId);
  };

  const handleCancelReply = () => {
    setShowReplyForm(null);
    setReplyContent('');
    setImageUrl('');
    setReplyType('essay');
  };

  const handleSubmitReply = async (e: React.FormEvent, responseId: string) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (replyType === 'essay' && !replyContent.trim()) {
        setError('Please enter your response content');
        setIsSubmitting(false);
        return;
      }

      if (replyType === 'image' && (!imageUrl.trim() || !replyContent.trim())) {
        setError('Please enter both an image URL and description');
        setIsSubmitting(false);
        return;
      }

      let newResponse: Post | null;

      if (replyType === 'essay') {
        // Create an essay post response
        newResponse = createPostResponse(responseId, {
          title: `Reply to comment #${responseId.substring(0, 6)}`,
          type: 'essay',
          categoryId: '', // This will be set by the service
          content: replyContent,
          authorName: user?.username || 'Anonymous',
          authorId: user?.id
        } as Omit<EssayPost, 'id' | 'votes' | 'responses' | 'createdAt' | 'responseToId'>);
      } else { // image
        // Create an image post response
        newResponse = createPostResponse(responseId, {
          title: `Image reply to comment #${responseId.substring(0, 6)}`,
          type: 'image',
          categoryId: '', // This will be set by the service
          imageUrl: imageUrl,
          description: replyContent,
          authorName: user?.username || 'Anonymous',
          authorId: user?.id
        } as Omit<ImagePost, 'id' | 'votes' | 'responses' | 'createdAt' | 'responseToId'>);
      }

      if (newResponse) {
        // Add the new response to the list
        setResponses(prev => [newResponse!, ...prev]);
        // Expand the response that was replied to
        setExpandedResponses(prev => {
          // Create a new Set from the existing one to avoid mutation
          const newSet = new Set(Array.from(prev));
          newSet.add(responseId);
          return newSet;
        });
        // Clear the form
        handleCancelReply();
        // Notify parent of new response
        if (onResponseAdded) {
          onResponseAdded(newResponse);
        }
      } else {
        setError('Failed to create response');
      }
    } catch (err) {
      console.error('Error creating response:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to render individual response
  const renderResponse = (response: Post, depth: number) => {
    const isEssay = response.type === 'essay';
    const isImage = response.type === 'image';
    const hasResponses = response.responses && response.responses.length > 0;
    const isExpanded = expandedResponses.has(response.id);
    const showNestedResponses = depth < maxDepth && isExpanded && hasResponses;
    const isReplyFormActive = showReplyForm === response.id;

    return (
      <div 
        className={`post-response response-depth-${depth}`} 
        key={response.id}
      >
        <div className="response-header">
          <div className="response-meta">
            <span className="response-author">
              <AnimatedText text={response.authorName || 'Anonymous'} preserveWhitespace={true} />
            </span>
            <span className="response-date">
              <AnimatedText 
                text={` • ${new Date(response.createdAt).toLocaleDateString()}`} 
                preserveWhitespace={true}
              />
            </span>
          </div>
          <div className="response-votes">
            <AnimatedText text={`${response.votes} votes`} preserveWhitespace={true} />
          </div>
        </div>

        <div className="response-content">
          {isEssay && (
            <AnimatedText text={(response as EssayPost).content} element="p" preserveWhitespace={true} />
          )}
          
          {isImage && (
            <>
              <img 
                src={(response as ImagePost).imageUrl} 
                alt={(response as ImagePost).description} 
                className="response-image" 
              />
              <p>
                <AnimatedText text={(response as ImagePost).description} preserveWhitespace={true} />
              </p>
            </>
          )}
        </div>

        <div className="response-actions">
          <button 
            onClick={() => navigate(`/post/${response.id}`)} 
            className="view-responses-button"
          >
            View Thread
          </button>
          
          <button 
            onClick={() => handleShowReplyForm(response.id)} 
            className="reply-button"
          >
            Reply
          </button>
          
          {hasResponses && (
            <button 
              onClick={() => toggleResponseExpansion(response.id)} 
              className="toggle-responses-button"
            >
              {isExpanded ? 'Hide Replies' : `Show Replies (${response.responses!.length})`}
            </button>
          )}
        </div>

        {/* Reply form */}
        {isReplyFormActive && (
          <AnimatedList staggerDelay={0.03} className="response-form-container">
            <div className="form-header">
              <h4>
                <AnimatedText text={`Reply to ${response.authorName || 'Anonymous'}`} preserveWhitespace={true} />
              </h4>
            </div>
            
            <form onSubmit={(e) => handleSubmitReply(e, response.id)} className="response-form">
              <div className="form-group">
                <label>
                  <AnimatedText text="Response Type:" preserveWhitespace={true} />
                </label>
                <select
                  value={replyType}
                  onChange={(e) => setReplyType(e.target.value as 'essay' | 'image')}
                  disabled={isSubmitting}
                  className="form-select"
                >
                  <option value="essay">Text</option>
                  <option value="image">Image</option>
                </select>
              </div>
              
              {replyType === 'image' && (
                <div className="form-group">
                  <label>
                    <AnimatedText text="Image URL:" preserveWhitespace={true} />
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="https://example.com/image.jpg"
                    className="form-input"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>
                  <AnimatedText text={replyType === 'image' ? "Description:" : "Your Reply:"} preserveWhitespace={true} />
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  className="form-textarea"
                  placeholder={replyType === 'image' 
                    ? "Describe your image..." 
                    : "Write your reply..."
                  }
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? 'Submitting...' : 'Post Reply'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancelReply}
                  disabled={isSubmitting}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </AnimatedList>
        )}

        {/* Nested responses */}
        {showNestedResponses && (
          <div className="nested-responses">
            <NestedResponses 
              parentId={response.id} 
              depth={depth + 1} 
              maxDepth={maxDepth}
              onResponseAdded={onResponseAdded}
            />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="loading">Loading responses...</div>;
  }

  if (responses.length === 0) {
    return null; // No responses to display
  }

  return (
    <div className="nested-responses-container">
      {error && (
        <div className="error-message">
          <AnimatedText text={error} preserveWhitespace={true} />
        </div>
      )}
      
      <AnimatedList staggerDelay={0.05} className="responses-list">
        {responses.map(response => renderResponse(response, depth))}
      </AnimatedList>
    </div>
  );
};

export default NestedResponses; 