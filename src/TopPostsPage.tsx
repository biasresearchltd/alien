import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  votes: number;
  timestamp: number;
}

const TopPostsPage: React.FC = () => {
  const [topPosts, setTopPosts] = useState<Post[]>([]);

  useEffect(() => {
	// In a real application, this would be an API call
	fetchTopPosts().then(setTopPosts);
  }, []);

  // This is a mock function. In a real app, you'd call your backend API
  const fetchTopPosts = async (): Promise<Post[]> => {
	// Simulating an API call
	return new Promise((resolve) => {
	  setTimeout(() => {
		resolve([
		  { id: '1', title: 'Amazing New Technology', url: 'https://example.com/tech', categoryId: 'tech', votes: 120, timestamp: Date.now() },
		  { id: '2', title: 'Cute Cats Video', url: 'https://example.com/cats', categoryId: 'entertainment', votes: 95, timestamp: Date.now() },
		  // Add more mock posts here
		]);
	  }, 500);
	});
  };

  return (
	<div className="top-posts">
	  <h2>Top Posts of the Day</h2>
	  <ul>
		{topPosts.map((post) => (
		  <li key={post.id}>
			<Link to={post.url}>{post.title}</Link>
			<span className="votes">{post.votes} votes</span>
		  </li>
		))}
	  </ul>
	</div>
  );
};

export default TopPostsPage;