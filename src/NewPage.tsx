import React from 'react';
import { categories } from './data/categories';

const NewPage: React.FC = () => {
  const newCategories = categories.filter(category => category.isNew);

  return (
	<div className="category-page">
	  <h2>What's New?</h2>
	  <div className="categories">
		<ul>
		  {newCategories.map((category, index) => (
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

export default NewPage;
