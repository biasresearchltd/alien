import React from 'react';
import { categories } from './data/categories';

const StatsPage: React.FC = () => {
  const totalCategories = categories.length;
  const totalEntries = categories.reduce((sum, category) => sum + (category.count || 0), 0);

  return (
	<div>
	  <h2>Site Stats</h2>
	  <p>Total Categories: {totalCategories}</p>
	  <p>Total Entries: {totalEntries}</p>
	</div>
  );
};

export default StatsPage;
