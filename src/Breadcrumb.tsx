import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategoryById, getCategoryPath, Category } from './data/categories';
import { getPostById } from './services/postService';

interface BreadcrumbProps {
  path: string[];
  onClick: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onClick }) => {
  const location = useLocation();
  
  // Check if we're viewing a post
  const isViewingPost = location.pathname.includes('/post/');
  let postTitle = '';
  let categoryPath: Category[] = [];
  
  if (isViewingPost) {
    const postIdMatch = location.pathname.match(/\/post\/([^/]+)/);
    if (postIdMatch && postIdMatch[1]) {
      const post = getPostById(postIdMatch[1]);
      if (post) {
        postTitle = post.title;
        
        // Always use getCategoryPath for consistent category resolution
        categoryPath = getCategoryPath(post.categoryId);
      }
    }
  } else if (path.length > 0) {
    // For normal category navigation, use the path ID to get the full category path
    const categoryId = path[path.length - 1];
    if (categoryId) {
      categoryPath = getCategoryPath(categoryId);
    }
  }
  
  return (
	<div className="breadcrumb">
	  {/* Show breadcrumb based on properly resolved category path */}
	  {categoryPath.length > 0 && categoryPath.map((category, index) => (
		<span key={category.id}>
		  <Link to={`/category/${category.id}`} onClick={() => onClick(index)}>
			{category.name}
		  </Link>
		  {index < categoryPath.length - 1 && ' > '}
		</span>
	  ))}
	  
	  {/* Add post title to breadcrumb if viewing a post */}
	  {isViewingPost && postTitle && (
		<span>
		  {categoryPath.length > 0 && ' > '}
		  <span className="current">{postTitle}</span>
		</span>
	  )}
	</div>
  );
};

export default Breadcrumb;