import React from 'react';
import { Link } from 'react-router-dom';
import { getAllNewCategories } from './data/categories';

interface NewPageProps {
  onNavigate: (categoryId: string) => void;
}

const NewPage: React.FC<NewPageProps> = ({ onNavigate }) => {
  const newCategories = getAllNewCategories();

  return (
	<div className="category-page">
	  <h2>What's New?</h2>
	  <div className="categories">
		<ul>
		  {newCategories.map((category) => (
			<li key={category.id}>
			  <Link to={`/category/${category.id}`} onClick={() => onNavigate(category.id)}>
				{category.name}
			  </Link>
			  <span className="count">({category.count})</span>
			</li>
		  ))}
		</ul>
	  </div>
	</div>
  );
};

export default NewPage;