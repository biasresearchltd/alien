import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import './App.css';
import Breadcrumb from './Breadcrumb';
import CategoryPage from './CategoryPage';
import NewPage from './NewPage';
import CoolPage from './CoolPage';
import PopularPage from './PopularPage';
import StatsPage from './StatsPage';
import InteractiveMenu from './InteractiveMenu';
import { categories, Category, getCategoryById, getCategoryPath } from './data/categories';
import AnimatedContent from './components/AnimatedContent';
import AnimatedList from './components/AnimatedList';
import AnimatedText from './components/AnimatedText';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getPostById } from './services/postService';

// Remove the old component entirely and replace with this new one
// This is an entirely new component with a different name to force React to re-render
const NavigationURLDisplay: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  const params = useParams();
  const location = useLocation();
  const [urlText, setUrlText] = useState(baseUrl);
  
  useEffect(() => {
    console.log('NavigationURLDisplay: Updating URL display');
    console.log('Current path:', location.pathname);
    console.log('Params:', params);
    console.log('Base URL:', baseUrl);
    
    // Get current path
    const path = location.pathname;
    
    // We'll build a new URL
    let newUrlText = baseUrl;
    
    // Check if we're viewing a post
    if (path.includes('/post/') && params.postId) {
      console.log('Found post path with ID:', params.postId);
      
      try {
        const post = getPostById(params.postId);
        console.log('Post data for URL display:', post);
        
        if (post) {
          // Format post title for URL
          const urlFriendlyTitle = post.title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
            
          console.log('URL-friendly title:', urlFriendlyTitle);
          
          // Get the full category path using getCategoryPath function
          const categories = getCategoryPath(post.categoryId);
          
          // Create URL-friendly category path
          const categoryPathString = categories
            .map(cat => cat.name.toLowerCase().replace(/\s+/g, '-'))
            .join('/');
          
          console.log('Category path for URL:', categoryPathString);
            
          // Build path: baseUrl/art/painting/evolution-of-modern-art
          newUrlText = `${baseUrl}/${categoryPathString}/${urlFriendlyTitle}`;
          console.log('New URL text for post view:', newUrlText);
        }
      } catch (error) {
        console.error('Error getting post data for URL:', error);
      }
    } 
    // Check if we're viewing a category
    else if (path.includes('/category/') && params.categoryId) {
      console.log('Found category path with ID:', params.categoryId);
      
      // Get full category path using getCategoryPath
      const categories = getCategoryPath(params.categoryId);
      
      // Create URL-friendly path
      const categoryPath = categories
        .map(cat => cat.name.toLowerCase().replace(/\s+/g, '-'))
        .join('/');
      
      console.log('Category path for URL display:', categoryPath);
      
      // Build the URL
      newUrlText = `${baseUrl}/${categoryPath}`;
      console.log('New URL text for category view:', newUrlText);
    }
    // Handle other special pages
    else if (path === '/new') {
      newUrlText = `${baseUrl}/whats-new`;
    }
    else if (path === '/cool') {
      newUrlText = `${baseUrl}/whats-cool`;
    }
    else if (path === '/popular') {
      newUrlText = `${baseUrl}/whats-popular`;
    }
    else if (path === '/stats') {
      newUrlText = `${baseUrl}/stats`;
    }
    else if (path === '/login') {
      newUrlText = `${baseUrl}/login`;
    }
    else if (path === '/account') {
      newUrlText = `${baseUrl}/my-account`;
    }
    else if (path.startsWith('/post/create')) {
      newUrlText = `${baseUrl}/create-new-post`;
    }
    else if (path.startsWith('/post/edit/')) {
      newUrlText = `${baseUrl}/edit-post`;
    }
    
    console.log('Setting URL display to:', newUrlText);
    setUrlText(newUrlText);
  }, [location.pathname, params, baseUrl]);

  return (
    <input 
      type="text" 
      value={urlText}
      placeholder="alien/" 
      readOnly 
      id="search-input" 
      className="url-input" 
    />
  );
};

// Main app content with navigation
const AppContent: React.FC = () => {
  const [path, setPath] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pageSearchInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [mainContentKey, setMainContentKey] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();

  // Update content key on route change to reset animations
  useEffect(() => {
    setMainContentKey(prevKey => prevKey + 1);
  }, [location.pathname]);

  // Synchronize path state with post navigation
  useEffect(() => {
    console.log('Location changed:', location.pathname);
    
    if (location.pathname === '/') {
      setPath([]);
    } else if (location.pathname.startsWith('/category/')) {
      const categoryId = location.pathname.split('/')[2];
      console.log('Category ID from URL:', categoryId);
      
      if (categoryId) {
        // Use getCategoryPath to get the full path of categories
        const categoryPath = getCategoryPath(categoryId);
        console.log('Category path from getCategoryPath:', categoryPath);
        
        // Set path to just the category IDs
        setPath([categoryId]);
        
        // Update page title with the category name
        const categoryName = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1].name : 'Category';
        document.title = `Alien - ${categoryName}`;
      }
    } else if (location.pathname.startsWith('/post/')) {
      const postId = location.pathname.split('/')[2];
      console.log('Post ID from URL:', postId);
      
      if (postId) {
        const post = getPostById(postId);
        console.log('Post data:', post);
        
        if (post) {
          // Get full category path for post
          const categoryPath = getCategoryPath(post.categoryId);
          console.log('Category path for post:', categoryPath);
          
          // This was causing "Unknown" to appear in breadcrumb/title
          setPath([post.categoryId]);
          
          // Update page title to match the current post
          document.title = `Alien - ${post.title}`;
        }
      }
    }
  }, [location.pathname]);

  const handleNavigate = (categoryId: string) => {
    // If navigating to a category, use the full category ID
    console.log('Navigating to category:', categoryId);
    setPath([categoryId]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setPath(path.slice(0, index + 1));
  };

  const handleReset = () => {
    setPath([]);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleForward = () => {
    window.history.forward();
  };

  const handleHome = () => {
    setPath([]);
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentCategory: Category | undefined = path.length
    ? getCategoryById(path[path.length - 1])
    : undefined;

  // Get the current post if we're viewing a post
  const currentPostId = location.pathname.includes('/post/') ? 
    location.pathname.split('/').pop() : undefined;
    
  const currentPost = currentPostId ? getPostById(currentPostId) : undefined;

  // Set display text based on current view
  const displayText = currentPost 
    ? currentPost.title
    : (path.length ? (currentCategory?.name || 'Unknown Category') : 'A Guide to WWW');
    
  const currentUrl = path.length
    ? `alien/${path.join('/')}`
    : 'alien/';

  // Create route key for animation triggering
  const routeKey = location.pathname + path.join('-');
  
  // Footer component with delayed appearance
  const Footer: React.FC = () => {
    const [show, setShow] = useState(false);
    
    useEffect(() => {
      // Show footer after a delay to allow main content to animate first
      const timer = setTimeout(() => {
        setShow(true);
      }, 2500); // Wait for main content to animate
      
      return () => clearTimeout(timer);
    }, []);
    
    if (!show) return null;
    
    const footerItemStyle = {
      display: 'block',
      marginBottom: '6px',
      lineHeight: '1.2'
    };
    
    return (
      <div className="footer" style={{ marginTop: '30px' }}>
        <AnimatedList 
          staggerDelay={0.08}
          component="div"
          className="footer-content"
        >
          <div style={footerItemStyle}>
            <AnimatedText 
              text="© 1997 Alien Inter.net - All Rights Reserved." 
              element="p"
              preserveWhitespace={true}
            />
          </div>
          <div style={footerItemStyle}>
            <AnimatedText 
              text="Last Modified: September 15, 1997" 
              element="p"
              preserveWhitespace={true}
            />
          </div>
          <div style={footerItemStyle}>
            <AnimatedText 
              text="Created with NeXT WebObjects, Java, and CORBA" 
              element="p"
              preserveWhitespace={true}
            />
          </div>
          <div style={footerItemStyle}>
            <AnimatedText 
              text="Optimized for Netscape Navigator 3.0 and Microsoft Internet Explorer 3.0" 
              element="p"
              preserveWhitespace={true}
            />
          </div>
          <div className="visitor-counter" style={footerItemStyle}>
            <AnimatedText 
              text="Visitors: 10,834" 
              element="p"
              preserveWhitespace={true}
            />
          </div>
        </AnimatedList>
      </div>
    );
  };
  
  // Category list component with sequential animation
  const MainContent: React.FC = () => {
    // Use ref instead of state to avoid re-renders
    const completedAnimationsRef = useRef<{[key: string]: boolean}>({});
    
    // Function to mark a category name animation as complete
    const handleNameAnimationComplete = (categoryId: string) => {
      completedAnimationsRef.current[categoryId] = true;
    };
    
    return (
      <div className="categories">
        <AnimatedList 
          staggerDelay={0.1}
          className="categories-list"
        >
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <span className="bullet">•</span>
              <Link
                to={`/category/${category.id}`}
                onClick={() => handleNavigate(category.id)}
              >
                <AnimatedText 
                  text={category.name}
                  preserveWhitespace={true}
                  onComplete={() => handleNameAnimationComplete(category.id)}
                />
              </Link>
              <span className="count">
                <AnimatedText 
                  text={`(${category.count})`}
                  preserveWhitespace={true}
                  delay={400} // Increased delay for the count
                />
              </span>
              {category.isNew && <img src="/new.gif" alt="New" className="new-badge" />}
            </div>
          ))}
        </AnimatedList>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="header">
        <div className="title-bar">
          <div className="window-controls">
            <button className="window-button"></button>
          </div>
          <div className="window-title">NeXT <span className="title-dash"></span> Alien</div>
          <div className="window-controls-right">
            <button className="window-button"></button>
          </div>
        </div>
        
        <div className="sub-bar">
          <div className="search-icon">
            <img src="/img/nextstep/find-icon.png" alt="" className="fallback-find-icon" />
          </div>
          <div className="sub-bar-search">
            <input 
              type="text" 
              placeholder="Search in page..." 
              ref={pageSearchInputRef} 
              id="page-search-input" 
            />
          </div>
        </div>
        
        <div className="navbar">
          <button title="Globe" className="nav-button">
            <img src="/img/nextstep/globe.png" alt="Globe" className="nav-icon fallback-globe" />
          </button>
          <button title="Back" className="nav-button" onClick={handleBack}>
            <img src="/img/nextstep/back.png" alt="Back" className="nav-icon fallback-back" />
          </button>
          <button title="Forward" className="nav-button" onClick={handleForward}>
            <img src="/img/nextstep/forward.png" alt="Forward" className="nav-icon fallback-forward" />
          </button>
          <button title="Home" className="nav-button" onClick={handleHome}>
            <img src="/img/nextstep/home.png" alt="Home" className="nav-icon fallback-home" />
          </button>
          <button title="Bookmark Menu" className="nav-button">
            <img src="/img/nextstep/bookmark-menu.png" alt="Bookmark Menu" className="nav-icon fallback-bookmark-menu" />
          </button>
          <button title="Add Bookmark" className="nav-button">
            <img src="/img/nextstep/add-bookmark.png" alt="Add Bookmark" className="nav-icon fallback-add-bookmark" />
          </button>
          <button title="Search" className="nav-button">
            <img src="/img/nextstep/search.png" alt="Search" className="nav-icon fallback-search" />
          </button>
          <button title="Navigate" className="nav-button">
            <img src="/img/nextstep/navigate.png" alt="Navigate" className="nav-icon fallback-navigate" />
          </button>
          <button title="Settings" className="nav-button">
            <img src="/img/nextstep/settings.png" alt="Settings" className="nav-icon fallback-settings" />
          </button>
          <button title="Info" className="nav-button">
            <img src="/img/nextstep/info.png" alt="Info" className="nav-icon fallback-info" />
          </button>
          <button title="Print" className="nav-button">
            <img src="/img/nextstep/print.png" alt="Print" className="nav-icon fallback-print" />
          </button>
        </div>
        
        <div className="url-bar">
          <div className="url-icon">
            <img src="/img/nextstep/url-icon.png" alt="" className="fallback-url-icon" />
          </div>
          <NavigationURLDisplay baseUrl={currentUrl} />
        </div>
      </div>
      <div className="main-content" ref={mainContentRef}>
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
          {isAuthenticated 
            ? <><Link to="/account">My Account</Link> | <a href="#" onClick={handleLogout}>Logout ({user?.username})</a></>
            : <Link to="/login">Login</Link>
          }]
        </div>
        <div style={{ marginBottom: '15px' }}>
          <InteractiveMenu />
        </div>
        <AnimatedContent routeKey={`${routeKey}-${mainContentKey}`}>
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
            <Route path="/login" element={<Login />} />
            
            {/* Post routes */}
            <Route path="/post/:postId" element={<PostDetail />} />
            
            {/* Protected routes */}
            <Route path="/post/create" element={
              <ProtectedRoute>
                <PostForm />
              </ProtectedRoute>
            } />
            <Route path="/post/edit/:postId" element={
              <ProtectedRoute>
                <PostForm />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <div className="account-page">
                  <h2><AnimatedText text="My Account" preserveWhitespace={true} /></h2>
                  <p><AnimatedText text={`Welcome, ${user?.username}`} preserveWhitespace={true} /></p>
                  <p><AnimatedText text="Here you can manage your posts and account settings" preserveWhitespace={true} /></p>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
        </AnimatedContent>
      </div>
    </div>
  );
};

// Main component that provides routing context
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;