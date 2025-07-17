import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from './data/posts';
import { useAuth } from './context/AuthContext';
import AnimatedText from './components/AnimatedText';
import AnimatedList from './components/AnimatedList';

interface PostListProps {
  posts: Post[];
  categoryId?: string;
}

const PostList: React.FC<PostListProps> = ({ posts, categoryId }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const renderPost = (post: Post) => {
    switch (post.type) {
      case 'essay':
        return (
          <div className="essay-post">
            <h3><AnimatedText text={post.title} preserveWhitespace={true} /></h3>
            <p><AnimatedText text={`${post.content.substring(0, 100)}...`} preserveWhitespace={true} /></p>
          </div>
        );
      case 'movie':
        return (
          <div className="movie-post">
            <h3><AnimatedText text={post.title} preserveWhitespace={true} /></h3>
            <iframe src={post.videoUrl} title={post.title} width="300" height="200" />
            <p><AnimatedText text={post.description} preserveWhitespace={true} /></p>
          </div>
        );
      case 'image':
        return (
          <div className="image-post">
            <h3><AnimatedText text={post.title} preserveWhitespace={true} /></h3>
            <img src={post.imageUrl} alt={post.title} style={{ maxWidth: '300px' }} />
            <p><AnimatedText text={post.description} preserveWhitespace={true} /></p>
          </div>
        );
      case 'carousel':
        return (
          <div className="carousel-post">
            <h3><AnimatedText text={post.title} preserveWhitespace={true} /></h3>
            <div className="carousel">
              {post.images.map((image, index) => (
                <div key={index}>
                  <img src={image.url} alt={image.caption} style={{ maxWidth: '300px' }} />
                  <p><AnimatedText text={image.caption} preserveWhitespace={true} /></p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  const handleCreatePost = () => {
    navigate(categoryId 
      ? `/post/create?categoryId=${categoryId}` 
      : '/post/create'
    );
  };

  return (
    <div className="post-list-container">
      {isAuthenticated && (
        <div className="post-actions">
          <button 
            onClick={handleCreatePost} 
            className="create-post-button"
          >
            Create New Post
          </button>
        </div>
      )}
      
      <AnimatedList className="post-list" staggerDelay={0.05}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <li key={post.id} className="category-item post-item">
              <Link to={`/post/${post.id}`} className="post-link">
                {renderPost(post)}
              </Link>
              <div className="post-meta">
                <span className="count">
                  <AnimatedText text={`${post.votes} votes`} preserveWhitespace={true} />
                </span>
                <span className="post-type-badge">
                  <AnimatedText text={post.type} preserveWhitespace={true} />
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="no-posts">
            <AnimatedText text="No posts in this category yet" preserveWhitespace={true} />
          </li>
        )}
      </AnimatedList>
    </div>
  );
};

export default PostList;