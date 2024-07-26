export interface Category {
  name: string;
  count: number;
  isNew: boolean;
}

export const categories: Category[] = [
  { name: 'Art', count: 466, isNew: true },
  { name: 'Business', count: 6426, isNew: true },
  { name: 'Computers', count: 2609, isNew: true },
  { name: 'Economy', count: 743, isNew: true },
  { name: 'Education', count: 1487, isNew: true },
  { name: 'Entertainment', count: 6199, isNew: true },
  { name: 'Environment and Nature', count: 193, isNew: true },
  { name: 'Events', count: 53, isNew: true },
  { name: 'Government', count: 1031, isNew: true },
  { name: 'Health', count: 367, isNew: true },
  { name: 'Humanities', count: 163, isNew: true },
  { name: 'Law', count: 163, isNew: true },
  { name: 'News', count: 185, isNew: true },
  { name: 'Politics', count: 148, isNew: true },
  { name: 'Reference', count: 474, isNew: true },
  { name: 'Regional Information', count: 2605, isNew: true },
  { name: 'Science', count: 2634, isNew: true },
  { name: 'Social Science', count: 93, isNew: true },
  { name: 'Society and Culture', count: 648, isNew: true },
];
