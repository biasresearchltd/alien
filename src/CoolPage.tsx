import React from 'react';
import { Link } from 'react-router-dom';
import { getAllCoolCategories, Category } from './data/categories';

interface CoolPageProps {
  onNavigate: (categoryId: string) => void;
}

const CoolPage: React.FC<CoolPageProps> = ({ onNavigate }) => {
  const coolCategories = getAllCoolCategories();

  return (
	<div className="category-page">
	  <h2>What's Cool?</h2>
	  <div className="categories">
		<ul>
		  {coolCategories.map((category: Category) => (
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

export default CoolPage;