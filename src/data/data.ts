export interface Link {
  name: string;
  url: string;
}

export interface Category {
  name: string;
  count?: number;  // Optional, may not exist in all cases
  isNew?: boolean; // Optional, may not exist in all cases
  subcategories?: Category[]; // Optional, allows nesting categories
  links?: Link[]; // Optional, allows attaching links
}

export const categories: Category[] = [
  {
	name: 'Art',
	count: 466,
	isNew: true,
	subcategories: [
	  {
		name: 'Painting',
		links: [
		  { name: 'Impressionism', url: '/impressionism' },
		  { name: 'Surrealism', url: '/surrealism' },
		],
	  },
	  {
		name: 'Sculpture',
		links: [
		  { name: 'Modern Sculpture', url: '/modern-sculpture' },
		],
	  },
	],
  },
  // Add more categories and subcategories as needed
];
