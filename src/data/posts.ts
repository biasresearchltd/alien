// src/data/posts.ts

import { Category } from './categories';

export interface BasePost {
  id: string;
  title: string;
  type: 'essay' | 'movie' | 'image' | 'carousel';
  categoryId: string;
  votes: number;
}

export interface EssayPost extends BasePost {
  type: 'essay';
  content: string;
}

export interface MoviePost extends BasePost {
  type: 'movie';
  videoUrl: string;
  description: string;
}

export interface ImagePost extends BasePost {
  type: 'image';
  imageUrl: string;
  description: string;
}

export interface CarouselPost extends BasePost {
  type: 'carousel';
  images: { url: string; caption: string }[];
}

export type Post = EssayPost | MoviePost | ImagePost | CarouselPost;

export const examplePosts: Post[] = [
  {
	id: '1',
	title: 'The Evolution of Modern Art',
	type: 'essay',
	categoryId: 'art-painting',
	votes: 120,
	content: 'Modern art has undergone significant transformations over the past century. From the bold strokes of impressionism to the mind-bending perspectives of cubism, artists have continually pushed the boundaries of visual expression...'
  },
  {
	id: '2',
	title: 'Inception: Dream Within a Dream',
	type: 'movie',
	categoryId: 'entertainment-movies',
	votes: 95,
	videoUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
	description: 'Inception is a 2010 science fiction action film written and directed by Christopher Nolan. The film stars Leonardo DiCaprio as a professional thief with the rare ability to extract information from people\'s minds while they are dreaming.'
  },
  {
	id: '3',
	title: 'The Golden Hour in Photography',
	type: 'image',
	categoryId: 'art-photography',
	votes: 87,
	imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
	description: 'The golden hour, just after sunrise or before sunset, provides photographers with a magical quality of light that can transform ordinary scenes into extraordinary images.'
  },
  {
	id: '4',
	title: 'Iconic Sculptures Through the Ages',
	type: 'carousel',
	categoryId: 'art-sculpture',
	votes: 105,
	images: [
	  { url: 'https://images.unsplash.com/photo-1578255783530-b461a7a99243?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80', caption: 'The David by Michelangelo' },
	  { url: 'https://images.unsplash.com/photo-1590562177087-ca6af9bb82ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', caption: 'The Thinker by Auguste Rodin' },
	  { url: 'https://images.unsplash.com/photo-1623113562225-694f6a2ee75e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', caption: 'Venus de Milo at the Louvre' }
	]
  },
  {
	id: '5',
	title: 'The Impact of AI on Modern Business',
	type: 'essay',
	categoryId: 'business',
	votes: 78,
	content: 'Artificial Intelligence is revolutionizing the way businesses operate. From predictive analytics to automated customer service, AI is enhancing efficiency and opening new possibilities across various industries...'
  },
  {
	id: '6',
	title: 'Understanding Quantum Computing',
	type: 'movie',
	categoryId: 'science-physics',
	votes: 112,
	videoUrl: 'https://www.youtube.com/embed/JhHMJCUmq28',
	description: 'This educational video explains the basics of quantum computing, its potential applications, and how it differs from classical computing.'
  },
  {
	id: '7',
	title: 'The Beauty of Neural Networks',
	type: 'image',
	categoryId: 'computers-programming',
	votes: 93,
	imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1465&q=80',
	description: 'A visual representation of a neural network, showcasing the intricate connections that enable machine learning algorithms to process complex data.'
  },
  {
	id: '8',
	title: 'Evolution of Video Game Graphics',
	type: 'carousel',
	categoryId: 'entertainment-games',
	votes: 88,
	images: [
	  { url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80', caption: 'Early 8-bit Graphics' },
	  { url: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80', caption: '3D Graphics Revolution' },
	  { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', caption: 'Modern Hyper-Realistic Graphics' }
	]
  }
];

export function getPostsByCategoryId(categoryId: string): Post[] {
  return examplePosts.filter(post => post.categoryId === categoryId);
}