import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCategoryById, Category } from './data/categories';
import { Post, getPostsByCategoryId } from './data/posts';
import PostList from './PostList';
import AnimatedText from './components/AnimatedText';
import { getPostsByCategoryId as getPostsService } from './services/postService';

interface CategoryPageProps {
  category: string;
  onNavigate: (categoryId: string) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Use ref instead of state to avoid re-renders
  const completedAnimationsRef = useRef<{[key: string]: boolean}>({});
  
  // Function to mark a subcategory name animation as complete
  const handleNameAnimationComplete = (subcategoryId: string) => {
    completedAnimationsRef.current[subcategoryId] = true;
  };

  useEffect(() => {
    const fetchedCategory = getCategoryById(category);
    setCurrentCategory(fetchedCategory || null);

    if (fetchedCategory && (!fetchedCategory.subcategories || fetchedCategory.subcategories.length === 0)) {
      // This is a leaf category, fetch posts
      // Use the service to get posts (which includes localStorage persistence)
      const fetchedPosts = getPostsService(category);
      setPosts(fetchedPosts);
    } else {
      setPosts([]);
    }
    
    // Reset completed animations when category changes
    completedAnimationsRef.current = {};
  }, [category]);

  if (!currentCategory) {
    return <div>Category not found</div>;
  }

  return (
    <div className="category-page">
      <h2><AnimatedText text={currentCategory.name} preserveWhitespace={true} /></h2>
      {currentCategory.subcategories && currentCategory.subcategories.length > 0 ? (
        <div className="subcategories">
          <ul>
            {currentCategory.subcategories.map((subCategory: Category, index: number) => (
              <li 
                key={subCategory.id} 
                className="category-item"
              >
                <Link to={`/category/${subCategory.id}`} onClick={() => onNavigate(subCategory.id)}>
                  <AnimatedText 
                    text={subCategory.name} 
                    preserveWhitespace={true}
                    onComplete={() => handleNameAnimationComplete(subCategory.id)}
                  />
                </Link>
                <span className="count">
                  <AnimatedText 
                    text={`(${subCategory.count})`} 
                    preserveWhitespace={true} 
                    delay={250} // Use fixed delay instead of conditional delay
                  />
                </span>
                {subCategory.isNew && <img src="/new.gif" alt="New" className="new-badge" />}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {currentCategory.links && currentCategory.links.length > 0 && (
            <div className="category-links">
              <ul>
                {currentCategory.links.map((link, index) => (
                  <li 
                    key={index}
                    className="category-item"
                  >
                    <a href={link.url}>
                      <AnimatedText text={link.name} preserveWhitespace={true} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {posts.length > 0 && <PostList posts={posts} categoryId={category} />}
        </>
      )}
    </div>
  );
};

export default CategoryPage;