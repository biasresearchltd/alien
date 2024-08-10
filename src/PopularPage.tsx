import React from 'react';
import { categories } from './data/categories';

const PopularPage: React.FC = () => {
  const popularCategories = categories
	.filter(category => category.count !== undefined)
	.sort((a, b) => (b.count || 0) - (a.count || 0))
	.slice(0, 10);

  return (
	<div className="category-page">
	  <h2>What's Popular?</h2>
	  <div className="categories">
		<ul>
		  {popularCategories.map((category, index) => (
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

export default PopularPage;
