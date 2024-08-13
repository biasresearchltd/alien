import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const InteractiveMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const imageWidth = 437;
  const imageHeight = 22;

  const menuStyle: React.CSSProperties = {
	position: 'relative',
	width: '100%',
	maxWidth: `${imageWidth}px`,
	aspectRatio: `${imageWidth} / ${imageHeight}`,
  };

  const buttonStyle: React.CSSProperties = {
	position: 'absolute',
	background: 'transparent',
	border: 'none',
	cursor: 'pointer',
	top: 0,
	height: '100%',
  };

  const handleUpClick = () => {
	const pathParts = location.pathname.split('/');
	if (pathParts.length > 2) {
	  navigate(pathParts.slice(0, -1).join('/'));
	} else {
	  navigate('/');
	}
  };

  const handleSearchClick = () => {
	document.getElementById('search-bar')?.focus();
  };

  const menuItems = [
	{ name: 'Top', path: '/top', left: '0%', width: '16.67%' },
	{ name: 'Up', onClick: handleUpClick, left: '16.67%', width: '16.67%' },
	{ name: 'Search', onClick: handleSearchClick, left: '33.33%', width: '16.67%' },
	{ name: 'Mail', href: 'mailto:contact@example.com', left: '50%', width: '16.67%' },
	{ name: 'Add', path: '/add', left: '66.67%', width: '16.67%' },
	{ name: 'Help', path: '/help', left: '83.33%', width: '16.67%' },
  ];

  return (
	<div style={menuStyle}>
	  <img 
		src="/menu.gif" 
		alt="Menu" 
		className="menu" 
		style={{
		  width: '100%',
		  height: '100%',
		  objectFit: 'contain',
		  imageRendering: 'pixelated',
		}} 
	  />
	  {menuItems.map((item) => (
		item.path ? (
		  <Link
			key={item.name}
			to={item.path}
			style={{
			  ...buttonStyle,
			  left: item.left,
			  width: item.width,
			}}
			title={item.name}
		  />
		) : item.href ? (
		  <a
			key={item.name}
			href={item.href}
			style={{
			  ...buttonStyle,
			  left: item.left,
			  width: item.width,
			}}
			title={item.name}
		  />
		) : (
		  <button
			key={item.name}
			onClick={item.onClick}
			style={{
			  ...buttonStyle,
			  left: item.left,
			  width: item.width,
			}}
			title={item.name}
		  />
		)
	  ))}
	</div>
  );
};

export default InteractiveMenu;