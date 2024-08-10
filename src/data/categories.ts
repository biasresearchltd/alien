export interface Link {
  name: string;
  url: string;
}

export interface Category {
  name: string;
  count?: number;
  isNew?: boolean;
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
  {
    name: 'Business',
    count: 6426,
    isNew: true,
    links: [
      { name: 'Stock Market', url: '/stock-market' },
      { name: 'Small Business', url: '/small-business' },
    ],
  },
  {
    name: 'Computers',
    count: 2609,
    isNew: true,
    subcategories: [
      {
        name: 'Programming',
        links: [
          { name: 'JavaScript', url: '/javascript' },
          { name: 'Python', url: '/python' },
        ],
      },
    ],
  },
  // Add more categories and subcategories as needed
  {
    name: 'Economy',
    count: 743,
    isNew: true,
  },
  {
    name: 'Education',
    count: 1487,
    isNew: true,
  },
  {
    name: 'Entertainment',
    count: 6199,
    isNew: true,
  },
  {
    name: 'Environment and Nature',
    count: 193,
    isNew: true,
  },
  {
    name: 'Events',
    count: 53,
    isNew: true,
  },
  {
    name: 'Government',
    count: 1031,
    isNew: true,
  },
  {
    name: 'Health',
    count: 367,
    isNew: true,
  },
  {
    name: 'Humanities',
    count: 163,
    isNew: true,
  },
  {
    name: 'Law',
    count: 163,
    isNew: true,
  },
  {
    name: 'News',
    count: 185,
    isNew: true,
  },
  {
    name: 'Politics',
    count: 148,
    isNew: true,
  },
  {
    name: 'Reference',
    count: 474,
    isNew: true,
  },
  {
    name: 'Regional Information',
    count: 2605,
    isNew: true,
  },
  {
    name: 'Science',
    count: 2634,
    isNew: true,
  },
  {
    name: 'Social Science',
    count: 93,
    isNew: true,
  },
  {
    name: 'Society and Culture',
    count: 648,
    isNew: true,
  },
];
