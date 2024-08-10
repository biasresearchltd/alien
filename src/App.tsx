import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Breadcrumb from './Breadcrumb';
import CategoryPage from './CategoryPage';
import NewPage from './NewPage';
import CoolPage from './CoolPage';
import PopularPage from './PopularPage';
import StatsPage from './StatsPage';
import { categories, Category } from './data/categories';

const App: React.FC = () => {
  const [path, setPath] = useState<Category[]>([]);

  const handleNavigate = (category: Category) => {
	setPath([...path, category]);
  };

  const handleBreadcrumbClick = (index: number) => {
	setPath(path.slice(0, index + 1));
  };

  const handleReset = () => {
	setPath([]); // Reset the path to the top of the category list
  };

  const currentCategory: Category = path.length
	? path[path.length - 1]
	: { name: 'Home', subcategories: categories };

  const displayText = path.length
	? path.map(category => category.name).join(' > ')
	: 'A Guide to WWW';

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
			<input type="text" placeholder="Search" />
		  </div>
		</div>
		<div className="main-content">
		  <h1>
			<Link to="/" onClick={handleReset} className="alien-title">
			  <span className="alien-text">Alien</span>
			</Link>
			- {displayText}
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
		  <img src="/menu.gif" alt="Menu" className="menu" />
		  <Routes>
			<Route path="/" element={
			  <CategoryPage
				category={currentCategory}
				onNavigate={handleNavigate}
			  />
			} />
			<Route path="/new" element={<NewPage />} />
			<Route path="/cool" element={<CoolPage />} />
			<Route path="/popular" element={<PopularPage />} />
			<Route path="/stats" element={<StatsPage />} />
			<Route path="/random" element={<div>Showing a Random Link</div>} />
		  </Routes>
		</div>
		<div className="footer">
		  <b>23836</b> entries in <i>Alien</i> | <Link to="#"><i>Alien</i></Link> | <Link to="#"><i>Up</i></Link> | <Link to="#"><i>Search</i></Link> | <Link to="#"><i>Mail</i></Link> | <Link to="#"><i>Add</i></Link> | <Link to="#"><i>Help</i></Link>
		  <p><a href="mailto:">[email protected]</a></p>
		  <p>Copyright © 1994 Antimeme and Bias Research Ltd.</p>
		</div>
	  </div>
	</Router>
  );
};

export default App;
