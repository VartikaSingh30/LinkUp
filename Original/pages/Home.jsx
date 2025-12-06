import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const savedPosts = localStorage.getItem('linkup.posts');
    const savedLikes = localStorage.getItem('linkup.likes');
    const savedGroups = localStorage.getItem('linkup.groups');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedLikes) setLikes(JSON.parse(savedLikes));
    if (savedGroups) setGroups(JSON.parse(savedGroups));
    else {
      const defaultGroups = [
        { id: Date.now(), name: 'Web Developers' },
        { id: Date.now() + 1, name: 'React Enthusiasts' }
      ];
      setGroups(defaultGroups);
      localStorage.setItem('linkup.groups', JSON.stringify(defaultGroups));
    }
  }, []);

  useEffect(() => {
    if (posts.length > 0) localStorage.setItem('linkup.posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('linkup.likes', JSON.stringify(likes));
  }, [likes]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostImage(file);
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postText.trim() && !postImage) return;

    const newPost = {
      id: Date.now(),
      author: 'You',
      avatar: 'Y',
      text: postText,
      image: imagePreview,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setPostImage(null);
    setImagePreview('');
    document.getElementById('composerImage').value = '';
  };

  const deletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const toggleLike = (id) => {
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <>
      <header className="topbar card">
        <div className="topbar__left">
          <Link to="/" className="brand" aria-label="LinkUp Home">
            <span className="brand__logo" aria-hidden="true">LU</span>
            <span className="brand__text">LinkUp</span>
          </Link>
          <label className="search">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <input id="search" type="search" placeholder="Search" />
          </label>
        </div>
        <nav className="topbar__right">
          <button className="icon-btn" title="Home" aria-label="Home">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
            </svg>
          </button>
          <Link to="/network" className="icon-btn" title="My Network" aria-label="My Network">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"></path>
            </svg>
          </Link>
          <Link to="/chat" className="icon-btn" title="Chat" aria-label="Chat">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path>
            </svg>
          </Link>
          <Link to="/profile" className="me-chip" title="View Profile">
            <div className="avatar avatar--sm" id="meAvatar" aria-hidden="true">V</div>
          </Link>
        </nav>
      </header>

      <main className="container">
        <aside className="sidebar-left">
          <section className="card profile-card">
            <div className="profile-card__header"></div>
            <div className="profile-card__body">
              <div className="avatar" id="profileAvatar">VS</div>
              <h2 className="profile__name" id="profileName">Vartika Singh</h2>
              <p className="profile__headline" id="profileHeadline">Computer Science Student at VITS Satna</p>
              <p className="profile__location" id="profileLocation">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Satna, Madhya Pradesh, India
              </p>
            </div>
            <div className="profile-card__footer">
              <Link className="link" to="/profile">View profile</Link>
            </div>
          </section>

          <nav className="card shortcuts">
            <h3 className="card__title">Manage</h3>
            <ul>
              <li><a href="#">Connections</a></li>
              <li><a href="#">Groups</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="#">Saved</a></li>
            </ul>
          </nav>

          <section className="card groups-card">
            <h3 className="card__title">My Groups</h3>
            <ul className="groups-list" id="groupsList">
              {groups.map(group => (
                <li key={group.id}><a href="#">{group.name}</a></li>
              ))}
            </ul>
          </section>
        </aside>

        <section className="feed">
          <article className="card composer">
            <form id="composerForm" onSubmit={handleSubmit}>
              <div className="composer__row">
                <div className="avatar avatar--sm" id="composerAvatar">Y</div>
                <textarea 
                  id="composerText" 
                  rows="3" 
                  placeholder="Start a post" 
                  aria-label="Write a post..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  maxLength="500"
                ></textarea>
              </div>
              <div className="composer__actions">
                <label className="btn btn--ghost">
                  <input 
                    id="composerImage" 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={handleImageChange}
                  />
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l4-4h12l2 2zM7 9a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                  Add image
                </label>
                <div className="grow"></div>
                <span className="muted" id="charCount">{postText.length}/500</span>
                <button id="postBtn" className="btn" type="submit" disabled={!postText.trim() && !postImage}>Post</button>
              </div>
              {imagePreview && (
                <div id="imagePreview" className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" onClick={() => { setImagePreview(''); setPostImage(null); document.getElementById('composerImage').value = ''; }}>×</button>
                </div>
              )}
            </form>
          </article>

          <div id="feed">
            {posts.map(post => (
              <article key={post.id} className="card post">
                <div className="post__header">
                  <div className="avatar">{post.avatar}</div>
                  <div className="post__meta">
                    <strong>{post.author}</strong>
                    <span className="muted">{timeAgo(post.timestamp)}</span>
                  </div>
                  {post.author === 'You' && (
                    <button className="post__delete" onClick={() => deletePost(post.id)} title="Delete post">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                      </svg>
                    </button>
                  )}
                </div>
                {post.text && <div className="post__body">{post.text}</div>}
                {post.image && (
                  <div className="post__image">
                    <img src={post.image} alt="Post content" />
                  </div>
                )}
                <div className="post__footer">
                  <button 
                    className={`btn btn--ghost ${likes[post.id] ? 'liked' : ''}`} 
                    onClick={() => toggleLike(post.id)}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill={likes[post.id] ? 'var(--primary)' : 'none'} stroke="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                    Like
                  </button>
                  <button className="btn btn--ghost">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path>
                    </svg>
                    Comment
                  </button>
                  <button className="btn btn--ghost">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path>
                    </svg>
                    Share
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer muted">
        <div>© {new Date().getFullYear()} LinkUp • A simple demo (not affiliated).</div>
      </footer>
    </>
  );
}

export default Home;
