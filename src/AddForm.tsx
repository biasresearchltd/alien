import React, { useState } from 'react';
import { categories, Category } from './data/categories';

const AddForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault();
	// Implement submission logic here
	console.log('Submitted:', { title, url, category });
  };

  return (
	<form onSubmit={handleSubmit}>
	  <h2>Add a New Link</h2>
	  <div>
		<label htmlFor="title">Title:</label>
		<input
		  type="text"
		  id="title"
		  value={title}
		  onChange={(e) => setTitle(e.target.value)}
		  required
		/>
	  </div>
	  <div>
		<label htmlFor="url">URL:</label>
		<input
		  type="url"
		  id="url"
		  value={url}
		  onChange={(e) => setUrl(e.target.value)}
		  required
		/>
	  </div>
	  <div>
		<label htmlFor="category">Category:</label>
		<select
		  id="category"
		  value={category}
		  onChange={(e) => setCategory(e.target.value)}
		  required
		>
		  <option value="">Select a category</option>
		  {categories.map((cat: Category) => (
			<option key={cat.id} value={cat.id}>
			  {cat.name}
			</option>
		  ))}
		</select>
	  </div>
	  <button type="submit">Submit</button>
	</form>
  );
};

export default AddForm;