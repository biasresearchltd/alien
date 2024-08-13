import React from 'react';
import { Link } from 'react-router-dom';
import { categories, Category } from './data/categories';

interface PopularPageProps {
  onNavigate: (categoryId: string) => void;
}

const PopularPage: React.FC<PopularPageProps> = ({ onNavigate }) => {
  // Assuming we have a way to determine popular categories
  const popularCategories = categories.filter(category => category.count > 1000);

  return (
	<div className="category-page">
	  <h2>What's Popular?</h2>
	  <div className="categories">
		<ul>
		  {popularCategories.map((category: Category) => (
			<li key={category.id}>
			  <Link to={`/category/${category.id}`} onClick={() => onNavigate(category.id)}>
				{category.name}
			  </Link>
			  <span className="count">({category.count})</span>
			  {category.isNew && <img src="/new.gif" alt="New" className="new" />}
			</li>
		  ))}
		</ul>
	  </div>
	</div>
  );
};

export default PopularPage;