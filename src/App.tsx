import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import './animations.css';
import Breadcrumb from './Breadcrumb';
import CategoryPage from './CategoryPage';
import NewPage from './NewPage';
import CoolPage from './CoolPage';
import PopularPage from './PopularPage';
import StatsPage from './StatsPage';
import InteractiveMenu from './InteractiveMenu';
import { categories, Category, getCategoryById } from './data/categories';

const App: React.FC = () => {
  const [path, setPath] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleNavigate = (categoryId: string) => {
	setPath([...path, categoryId]);
  };

  const handleBreadcrumbClick = (index: number) => {
	setPath(path.slice(0, index + 1));
  };

  const handleReset = () => {
	setPath([]);
  };

  const currentCategory: Category | undefined = path.length
	? getCategoryById(path[path.length - 1])
	: undefined;

  const displayText = path.length
	? currentCategory?.name || 'Unknown Category'
	: 'A Guide to WWW';

  const MainContent: React.FC = () => (
	<div className="categories fade-in">
	  <ul>
		{categories.map((category, index) => (
		  <li 
			key={category.id} 
			className="category-item fade-in"
			style={{ animationDelay: `${index * 0.05}s` }}
		  >
			<Link to={`/category/${category.id}`} onClick={() => handleNavigate(category.id)}>
			  {category.name}
			</Link>
			<span className="count">({category.count})</span>
			{category.isNew && <img src="/new.gif" alt="New" className="new-badge" />}
		  </li>
		))}
	  </ul>
	</div>
  );

  return (
	<Router>
	  <div className="app">
		<div className="header">
		  <div className="navbar">
			<button>Back</button>
			<button>Forward</button>
			<button>Home</button>
			<button>Reload</button>
			<button>Images</button>
			<button>Open</button>
			<button>Print</button>
			<button>Find</button>
			<button>Stop</button>
		  </div>
		  <div className="search-bar">
			<input type="text" placeholder="Search" ref={searchInputRef} id="search-input" />
		  </div>
		</div>
		<div className="main-content">
		  <h1>
			<Link to="/" onClick={handleReset} className="alien-title">
			  <span className="alien-text">Alien</span>
			</Link>
			&nbsp;- {displayText}
		  </h1>
		  <Breadcrumb path={path} onClick={handleBreadcrumbClick} />
		  <div className="sub-links">
			[
			<Link to="/new">What's New?</Link> | 
			<Link to="/cool">What's Cool?</Link> | 
			<Link to="/popular">What's Popular?</Link> | 
			<Link to="/stats">Stats</Link> | 
			<Link to="/random">A Random Link</Link>]
		  </div>
		  <InteractiveMenu />
		  <Routes>
			<Route path="/" element={<MainContent />} />
			<Route path="/category/:categoryId" element={
			  <CategoryPage
				category={currentCategory?.id || ''}
				onNavigate={handleNavigate}
			  />
			} />
			<Route path="/new" element={<NewPage onNavigate={handleNavigate} />} />
			<Route path="/cool" element={<CoolPage onNavigate={handleNavigate} />} />
			<Route path="/popular" element={<PopularPage onNavigate={handleNavigate} />} />
			<Route path="/stats" element={<StatsPage />} />
		  </Routes>
		</div>
		<div className="footer">
		  <b>23836</b> entries in <i>Alien</i> | <Link to="#"><i>Alien</i></Link> | <Link to="#"><i>Up</i></Link> | <Link to="#"><i>Search</i></Link> | <Link to="#"><i>Mail</i></Link> | <Link to="#"><i>Add</i></Link> | <Link to="#"><i>Help</i></Link>
		  <p><a href="mailto:feedback@alien.com">feedback@alien.com</a></p>
		  <p>Copyright © 1994 Antimeme and Bias Research Ltd.</p>
		</div>
	  </div>
	</Router>
  );
};

export default App;