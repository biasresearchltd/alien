import React from 'react';
import { Post } from './data/posts';
import './animations.css';

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const renderPost = (post: Post) => {
	switch (post.type) {
	  case 'essay':
		return (
		  <div className="essay-post">
			<h3>{post.title}</h3>
			<p>{post.content.substring(0, 100)}...</p>
		  </div>
		);
	  case 'movie':
		return (
		  <div className="movie-post">
			<h3>{post.title}</h3>
			<iframe src={post.videoUrl} title={post.title} width="300" height="200" />
			<p>{post.description}</p>
		  </div>
		);
	  case 'image':
		return (
		  <div className="image-post">
			<h3>{post.title}</h3>
			<img src={post.imageUrl} alt={post.title} style={{ maxWidth: '300px' }} />
			<p>{post.description}</p>
		  </div>
		);
	  case 'carousel':
		return (
		  <div className="carousel-post">
			<h3>{post.title}</h3>
			<div className="carousel">
			  {post.images.map((image, index) => (
				<div key={index}>
				  <img src={image.url} alt={image.caption} style={{ maxWidth: '300px' }} />
				  <p>{image.caption}</p>
				</div>
			  ))}
			</div>
		  </div>
		);
	}
  };

  return (
	<ul className="post-list">
	  {posts.map((post, index) => (
		<li key={post.id} className={`category-item fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
		  {renderPost(post)}
		  <span className="count">{post.votes} votes</span>
		</li>
	  ))}
	</ul>
  );
};

export default PostList;