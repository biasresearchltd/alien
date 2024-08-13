// File: src/data/categories.ts

export interface Link {
  name: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  isNew?: boolean;
  isCool?: boolean;
  subcategories?: Category[];
  links?: Link[];
}

export const categories: Category[] = [
  {
    id: 'art',
    name: 'Art',
    count: 466,
    isNew: true,
    isCool: true,
    subcategories: [
      {
        id: 'art-painting',
        name: 'Painting',
        count: 150,
        links: [
          { name: 'Impressionism', url: '/art/painting/impressionism' },
          { name: 'Surrealism', url: '/art/painting/surrealism' },
          { name: 'Abstract', url: '/art/painting/abstract' },
        ],
      },
      {
        id: 'art-sculpture',
        name: 'Sculpture',
        count: 100,
        links: [
          { name: 'Modern Sculpture', url: '/art/sculpture/modern' },
          { name: 'Classical Sculpture', url: '/art/sculpture/classical' },
        ],
      },
      {
        id: 'art-photography',
        name: 'Photography',
        count: 216,
        links: [
          { name: 'Digital Photography', url: '/art/photography/digital' },
          { name: 'Film Photography', url: '/art/photography/film' },
        ],
      },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    count: 6426,
    isNew: true,
    isCool: false,
    subcategories: [
      {
        id: 'business-finance',
        name: 'Finance',
        count: 2500,
        links: [
          { name: 'Stock Market', url: '/business/finance/stock-market' },
          { name: 'Personal Finance', url: '/business/finance/personal' },
        ],
      },
      {
        id: 'business-marketing',
        name: 'Marketing',
        count: 1800,
        links: [
          { name: 'Digital Marketing', url: '/business/marketing/digital' },
          { name: 'Content Marketing', url: '/business/marketing/content' },
        ],
      },
      {
        id: 'business-entrepreneurship',
        name: 'Entrepreneurship',
        count: 2126,
        links: [
          { name: 'Startups', url: '/business/entrepreneurship/startups' },
          { name: 'Small Business', url: '/business/entrepreneurship/small-business' },
        ],
      },
    ],
  },
  {
    id: 'computers',
    name: 'Computers',
    count: 2609,
    isNew: true,
    isCool: true,
    subcategories: [
      {
        id: 'computers-programming',
        name: 'Programming',
        count: 1200,
        links: [
          { name: 'JavaScript', url: '/computers/programming/javascript' },
          { name: 'Python', url: '/computers/programming/python' },
          { name: 'Java', url: '/computers/programming/java' },
        ],
      },
      {
        id: 'computers-hardware',
        name: 'Hardware',
        count: 800,
        links: [
          { name: 'CPUs', url: '/computers/hardware/cpus' },
          { name: 'GPUs', url: '/computers/hardware/gpus' },
        ],
      },
      {
        id: 'computers-networking',
        name: 'Networking',
        count: 609,
        links: [
          { name: 'Protocols', url: '/computers/networking/protocols' },
          { name: 'Security', url: '/computers/networking/security' },
        ],
      },
    ],
  },
  {
    id: 'economy',
    name: 'Economy',
    count: 743,
    isNew: true,
  },
  {
    id: 'education',
    name: 'Education',
    count: 1487,
    isNew: true,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    count: 6199,
    isNew: true,
    isCool: true,
    subcategories: [
      {
        id: 'entertainment-movies',
        name: 'Movies',
        count: 2500,
        links: [
          { name: 'Action', url: '/entertainment/movies/action' },
          { name: 'Comedy', url: '/entertainment/movies/comedy' },
        ],
      },
      {
        id: 'entertainment-music',
        name: 'Music',
        count: 2000,
        links: [
          { name: 'Rock', url: '/entertainment/music/rock' },
          { name: 'Hip Hop', url: '/entertainment/music/hip-hop' },
        ],
      },
      {
        id: 'entertainment-games',
        name: 'Games',
        count: 1699,
        links: [
          { name: 'Video Games', url: '/entertainment/games/video-games' },
          { name: 'Board Games', url: '/entertainment/games/board-games' },
        ],
      },
    ],
  },
  {
    id: 'environment-nature',
    name: 'Environment and Nature',
    count: 193,
    isNew: true,
  },
  {
    id: 'events',
    name: 'Events',
    count: 53,
    isNew: true,
  },
  {
    id: 'government',
    name: 'Government',
    count: 1031,
    isNew: true,
  },
  {
    id: 'health',
    name: 'Health',
    count: 367,
    isNew: true,
    isCool: false,
    subcategories: [
      {
        id: 'health-nutrition',
        name: 'Nutrition',
        count: 500,
        links: [
          { name: 'Diets', url: '/health/nutrition/diets' },
          { name: 'Supplements', url: '/health/nutrition/supplements' },
        ],
      },
      {
        id: 'health-fitness',
        name: 'Fitness',
        count: 467,
        links: [
          { name: 'Cardio', url: '/health/fitness/cardio' },
          { name: 'Strength Training', url: '/health/fitness/strength-training' },
        ],
      },
      {
        id: 'health-mental-health',
        name: 'Mental Health',
        count: 400,
        links: [
          { name: 'Stress Management', url: '/health/mental-health/stress-management' },
          { name: 'Depression', url: '/health/mental-health/depression' },
        ],
      },
    ],
  },
  {
    id: 'humanities',
    name: 'Humanities',
    count: 163,
    isNew: true,
  },
  {
    id: 'law',
    name: 'Law',
    count: 163,
    isNew: true,
  },
  {
    id: 'news',
    name: 'News',
    count: 185,
    isNew: true,
  },
  {
    id: 'politics',
    name: 'Politics',
    count: 148,
    isNew: true,
  },
  {
    id: 'reference',
    name: 'Reference',
    count: 474,
    isNew: true,
  },
  {
    id: 'regional-information',
    name: 'Regional Information',
    count: 2605,
    isNew: true,
  },
  {
    id: 'science',
    name: 'Science',
    count: 2634,
    isNew: true,
    isCool: true,
    subcategories: [
      {
        id: 'science-physics',
        name: 'Physics',
        count: 1000,
        links: [
          { name: 'Quantum Mechanics', url: '/science/physics/quantum-mechanics' },
          { name: 'Relativity', url: '/science/physics/relativity' },
        ],
      },
      {
        id: 'science-biology',
        name: 'Biology',
        count: 934,
        links: [
          { name: 'Genetics', url: '/science/biology/genetics' },
          { name: 'Ecology', url: '/science/biology/ecology' },
        ],
      },
      {
        id: 'science-chemistry',
        name: 'Chemistry',
        count: 700,
        links: [
          { name: 'Organic Chemistry', url: '/science/chemistry/organic' },
          { name: 'Inorganic Chemistry', url: '/science/chemistry/inorganic' },
        ],
      },
    ],
  },
  {
    id: 'social-science',
    name: 'Social Science',
    count: 93,
    isNew: true,
  },
  {
    id: 'society-culture',
    name: 'Society and Culture',
    count: 648,
    isNew: true,
  },
];

export function getCategoryById(id: string, categoryList: Category[] = categories): Category | undefined {
  for (const category of categoryList) {
    if (category.id === id) {
      return category;
    }
    if (category.subcategories) {
      const found = getCategoryById(id, category.subcategories);
      if (found) return found;
    }
  }
  return undefined;
}

export function getCategoryPath(id: string): Category[] {
  const path: Category[] = [];
  function findPath(categoryList: Category[], targetId: string): boolean {
    for (const category of categoryList) {
      path.push(category);
      if (category.id === targetId) {
        return true;
      }
      if (category.subcategories && findPath(category.subcategories, targetId)) {
        return true;
      }
      path.pop();
    }
    return false;
  }
  findPath(categories, id);
  return path;
}

export function getAllNewCategories(): Category[] {
  const newCategories: Category[] = [];
  function findNewCategories(categoryList: Category[]) {
    for (const category of categoryList) {
      if (category.isNew) {
        newCategories.push(category);
      }
      if (category.subcategories) {
        findNewCategories(category.subcategories);
      }
    }
  }
  findNewCategories(categories);
  return newCategories;
}

export function getAllCoolCategories(): Category[] {
  const coolCategories: Category[] = [];
  function findCoolCategories(categoryList: Category[]) {
    for (const category of categoryList) {
      if (category.isCool) {
        coolCategories.push(category);
      }
      if (category.subcategories) {
        findCoolCategories(category.subcategories);
      }
    }
  }
  findCoolCategories(categories);
  return coolCategories;
}