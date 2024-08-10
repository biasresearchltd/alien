import React from 'react';
import { Category } from './data/categories';

interface BreadcrumbProps {
  path: Category[];
  onClick: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onClick }) => {
  return (
	<div className="breadcrumb">
	  {path.map((category, index) => (
		<span key={index} onClick={() => onClick(index)}>
		  {category.name} {index < path.length - 1 && '>'}
		</span>
	  ))}
	</div>
  );
};

export default Breadcrumb;
