import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryById } from './data/categories';

interface BreadcrumbProps {
  path: string[];
  onClick: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onClick }) => {
  return (
	<div className="breadcrumb">
	  {path.map((categoryId, index) => {
		const category = getCategoryById(categoryId);
		return (
		  <span key={categoryId}>
			<Link to={`/category/${categoryId}`} onClick={() => onClick(index)}>
			  {category ? category.name : 'Unknown'}
			</Link>
			{index < path.length - 1 && ' > '}
		  </span>
		);
	  })}
	</div>
  );
};

export default Breadcrumb;