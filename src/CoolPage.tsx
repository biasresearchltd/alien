import React from 'react';
import { categories } from './data/categories';

const CoolPage: React.FC = () => {
  const coolCategories = categories.filter(category => (category.count || 0) > 1000);

  return (
	<div className="category-page">
	  <h2>What's Cool?</h2>
	  <div className="categories">
		<ul>
		  {coolCategories.map((category, index) => (
			<li key={index}>
			  <a href="#">{category.name}</a>
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
