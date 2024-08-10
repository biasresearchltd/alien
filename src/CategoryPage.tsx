import React from 'react';
import { Category, Link } from './data/categories';
import './animations.css';

interface CategoryPageProps {
  category: Category;
  onNavigate: (category: Category) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  return (
	<div className="category-page">
	  {category.subcategories && (
		<div className="categories">
		  <ul>
			{category.subcategories.map((sub: Category, index: number) => (
			  <li key={index} onClick={() => onNavigate(sub)}>
				<a href="#">{sub.name}</a>
				<span className="count">({sub.count})</span>
				{sub.isNew && <img src="/new.gif" alt="New" className="new" />}
			  </li>
			))}
		  </ul>
		</div>
	  )}
	  {category.links && (
		<div className="categories">
		  <ul>
			{category.links.map((link: Link, index: number) => (
			  <li key={index}>
				<a href={link.url}>{link.name}</a>
			  </li>
			))}
		  </ul>
		</div>
	  )}
	</div>
  );
};

export default CategoryPage;
