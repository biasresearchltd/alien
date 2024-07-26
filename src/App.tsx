import React from 'react';
import './App.css';
import { categories } from './data/categories';

const newGifUrl = '/new.gif';
const menuUrl = '/menu.gif';

function App() {
  return (
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
		<h1><a href="#">Alien</a> - A Guide to WWW</h1>
		<div className="sub-links">
		  [ 
		  <a href="#">What's New?</a>| 
		  <a href="#">What's Cool?</a>| 
		  <a href="#">What's Popular?</a>| 
		  <a href="#">Stats</a>| 
		  <a href="#">A Random Link</a>]
		</div>
		<img src={menuUrl} alt="New" className="menu" />
		<div className="categories">
		  <ul>
			{categories.map((category, index) => (
			  <li key={index}>
				<a href="#">{category.name}</a> <span className="count">({category.count})</span>
				{category.isNew && <img src={newGifUrl} alt="New" className="new" />}
			  </li>
			))}
		  </ul>
		</div>
		<div className="footer">
		  <b>23836</b> entries in <i>Alien</i> | <a href="#"><i>Alien</i></a> | <a href="#"><i>Up</i></a> | <a href="#"><i>Search</i></a> | <a href="#"><i>Mail</i></a> | <a href="#"><i>Add</i></a> | <a href="#"><i>Help</i></a>
		  <p><a href="mailto:bias@biasresearch.ltd">[email protected]</a></p>
		  <p>Copyright © 1994 Antimeme and Bias Research Ltd.</p>
		</div>
	  </div>
	</div>
  );
}

export default App;
