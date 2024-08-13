import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategoryById, Category } from './data/categories';
import { Post, getPostsByCategoryId } from './data/posts';
import PostList from './PostList';
import './animations.css';

interface CategoryPageProps {
  category: string;
  onNavigate: (categoryId: string) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
	const fetchedCategory = getCategoryById(category);
	setCurrentCategory(fetchedCategory || null);

	if (fetchedCategory && (!fetchedCategory.subcategories || fetchedCategory.subcategories.length === 0)) {
	  // This is a leaf category, fetch posts
	  const fetchedPosts = getPostsByCategoryId(category);
	  setPosts(fetchedPosts);
	} else {
	  setPosts([]);
	}
  }, [category]);

  if (!currentCategory) {
	return <div>Category not found</div>;
  }

  return (
	<div className="category-page fade-in">
	  <h2>{currentCategory.name}</h2>
	  {currentCategory.subcategories && currentCategory.subcategories.length > 0 ? (
		<div className="subcategories">
		  <ul>
			{currentCategory.subcategories.map((subCategory: Category, index: number) => (
			  <li 
				key={subCategory.id} 
				className="category-item fade-in"
				style={{ animationDelay: `${index * 0.05}s` }}
			  >
				<Link to={`/category/${subCategory.id}`} onClick={() => onNavigate(subCategory.id)}>
				  {subCategory.name}
				</Link>
				<span className="count">({subCategory.count})</span>
				{subCategory.isNew && <img src="/new.gif" alt="New" className="new-badge" />}
			  </li>
			))}
		  </ul>
		</div>
	  ) : (
		<>
		  {currentCategory.links && currentCategory.links.length > 0 && (
			<div className="category-links fade-in">
			  <ul>
				{currentCategory.links.map((link, index) => (
				  <li 
					key={index}
					className="fade-in"
					style={{ animationDelay: `${index * 0.05}s` }}
				  >
					<a href={link.url}>{link.name}</a>
				  </li>
				))}
			  </ul>
			</div>
		  )}
		  {posts.length > 0 && <PostList posts={posts} />}
		</>
	  )}
	</div>
  );
};

export default CategoryPage;