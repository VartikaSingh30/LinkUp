import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Network() {
  const [activeTab, setActiveTab] = useState('mynetwork');
  const [connections, setConnections] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const recommendedPeople = [
    { id: 1, name: 'Sarah Johnson', title: 'Product Manager at TechCorp', avatar: 'SJ' },
    { id: 2, name: 'Michael Chen', title: 'Software Engineer at StartupXYZ', avatar: 'MC' },
    { id: 3, name: 'Emily Davis', title: 'UX Designer at DesignHub', avatar: 'ED' },
    { id: 4, name: 'David Wilson', title: 'Data Scientist at DataLabs', avatar: 'DW' },
    { id: 5, name: 'Jessica Brown', title: 'Marketing Lead at BrandCo', avatar: 'JB' },
    { id: 6, name: 'James Miller', title: 'Full Stack Developer', avatar: 'JM' },
    { id: 7, name: 'Lisa Anderson', title: 'Business Analyst at FinTech', avatar: 'LA' },
    { id: 8, name: 'Robert Taylor', title: 'DevOps Engineer at CloudSys', avatar: 'RT' }
  ];

  const mutualConnections = [
    { id: 101, name: 'Alex Martinez', title: 'Frontend Developer', mutuals: 12, avatar: 'AM' },
    { id: 102, name: 'Sophia Lee', title: 'Backend Engineer', mutuals: 8, avatar: 'SL' },
    { id: 103, name: 'Daniel Kumar', title: 'Mobile Developer', mutuals: 15, avatar: 'DK' }
  ];

  useEffect(() => {
    const savedConnections = localStorage.getItem('linkup.connections');
    const savedGroups = localStorage.getItem('linkup.groups');
    
    if (savedConnections) setConnections(JSON.parse(savedConnections));
    if (savedGroups) setGroups(JSON.parse(savedGroups));
  }, []);

  useEffect(() => {
    localStorage.setItem('linkup.connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('linkup.groups', JSON.stringify(groups));
  }, [groups]);

  const addConnection = (person) => {
    if (!connections.find(c => c.id === person.id)) {
      setConnections([...connections, person]);
    }
  };

  const removeConnection = (id) => {
    setConnections(connections.filter(c => c.id !== id));
  };

  const createGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupDescription.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: groupName,
      description: groupDescription,
      members: 1,
      createdAt: new Date().toISOString()
    };

    setGroups([...groups, newGroup]);
    setGroupName('');
    setGroupDescription('');
    setShowModal(false);
  };

  const deleteGroup = (id) => {
    setGroups(groups.filter(g => g.id !== id));
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
          <Link to="/" className="icon-btn" title="Home" aria-label="Home">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
            </svg>
          </Link>
          <Link to="/network" className="icon-btn" title="My Network" aria-label="My Network" style={{ background: 'rgba(102, 126, 234, 0.1)', color: 'var(--primary)' }}>
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

      <main className="container" style={{ maxWidth: '1100px' }}>
        <aside className="sidebar-left">
          <section className="card profile-card">
            <div className="profile-card__header"></div>
            <div className="profile-card__body">
              <div className="avatar" id="profileAvatar">VS</div>
              <h2 className="profile__name" id="profileName">Vartika Singh</h2>
              <p className="profile__headline" id="profileHeadline">Computer Science Student at VITS Satna</p>
            </div>
            <div className="profile-card__footer">
              <Link className="link" to="/profile">View profile</Link>
            </div>
          </section>

          <nav className="card shortcuts">
            <h3 className="card__title">Manage</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('mynetwork'); }}>My Network</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('recommended'); }}>Recommendations</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('mutual'); }}>Mutual Connections</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('groups'); }}>Groups</a></li>
            </ul>
          </nav>
        </aside>

        <section className="feed">
          <article className="card network-header">
            <div className="network-header-content">
              <h1>My Network</h1>
              <p className="muted">Manage your professional network</p>
            </div>
          </article>

          <article className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="network-tabs">
              <button 
                className={`network-tab ${activeTab === 'mynetwork' ? 'active' : ''}`} 
                onClick={() => setActiveTab('mynetwork')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                My Network
              </button>
              <button 
                className={`network-tab ${activeTab === 'recommended' ? 'active' : ''}`} 
                onClick={() => setActiveTab('recommended')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Recommended
              </button>
              <button 
                className={`network-tab ${activeTab === 'mutual' ? 'active' : ''}`} 
                onClick={() => setActiveTab('mutual')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Mutual
              </button>
              <button 
                className={`network-tab ${activeTab === 'groups' ? 'active' : ''}`} 
                onClick={() => setActiveTab('groups')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
                </svg>
                Groups
              </button>
            </div>
          </article>

          {activeTab === 'mynetwork' && (
            <div className="network-content">
              <article className="card">
                <div className="card__title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>My Connections (<span id="connectionCount">{connections.length}</span>)</span>
                </div>
                <div className="network-list">
                  {connections.length === 0 ? (
                    <p className="muted" style={{ padding: '2rem', textAlign: 'center' }}>No connections yet. Start connecting!</p>
                  ) : (
                    connections.map(conn => (
                      <div key={conn.id} className="network-item">
                        <div className="avatar">{conn.avatar}</div>
                        <div className="network-item-info">
                          <strong>{conn.name}</strong>
                          <p className="muted">{conn.title}</p>
                        </div>
                        <button className="btn btn--ghost btn--sm" onClick={() => removeConnection(conn.id)}>Remove</button>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>
          )}

          {activeTab === 'recommended' && (
            <div className="network-content">
              <article className="card">
                <div className="card__title">People you may know</div>
                <div className="network-list">
                  {recommendedPeople.map(person => (
                    <div key={person.id} className="network-item">
                      <div className="avatar">{person.avatar}</div>
                      <div className="network-item-info">
                        <strong>{person.name}</strong>
                        <p className="muted">{person.title}</p>
                      </div>
                      <button 
                        className="btn btn--sm" 
                        onClick={() => addConnection(person)}
                        disabled={connections.find(c => c.id === person.id)}
                      >
                        {connections.find(c => c.id === person.id) ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeTab === 'mutual' && (
            <div className="network-content">
              <article className="card">
                <div className="card__title">Mutual Connections</div>
                <div className="network-list">
                  {mutualConnections.map(person => (
                    <div key={person.id} className="network-item">
                      <div className="avatar">{person.avatar}</div>
                      <div className="network-item-info">
                        <strong>{person.name}</strong>
                        <p className="muted">{person.title}</p>
                        <p className="muted" style={{ fontSize: '0.85rem' }}>{person.mutuals} mutual connections</p>
                      </div>
                      <button 
                        className="btn btn--sm" 
                        onClick={() => addConnection(person)}
                        disabled={connections.find(c => c.id === person.id)}
                      >
                        {connections.find(c => c.id === person.id) ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="network-content">
              <article className="card">
                <div className="card__title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Your Groups</span>
                  <button className="btn btn--sm" onClick={() => setShowModal(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Create Group
                  </button>
                </div>
                <div className="network-groups-list">
                  {groups.length === 0 ? (
                    <p className="muted" style={{ padding: '2rem', textAlign: 'center' }}>No groups yet. Create your first group!</p>
                  ) : (
                    groups.map(group => (
                      <div key={group.id} className="group-card">
                        <div className="group-header">
                          <div className="group-avatar">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
                            </svg>
                          </div>
                          <div className="group-info">
                            <strong>{group.name}</strong>
                            <p className="muted">{group.members} member{group.members !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <p className="group-description">{group.description}</p>
                        <button className="btn btn--ghost btn--sm" onClick={() => deleteGroup(group.id)}>Delete</button>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>
          )}
        </section>

        <aside className="sidebar-right">
          <section className="card stats-card">
            <div className="card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              Network Stats
            </div>
            <div className="network-stats">
              <div className="stat-item">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{connections.length}</div>
                  <div className="stat-label">Connections</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{groups.length}</div>
                  <div className="stat-label">Groups</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">8</div>
                  <div className="stat-label">Suggested</div>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Group</h2>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={createGroup} className="modal-body">
              <div className="form-group">
                <label htmlFor="groupName">Group Name *</label>
                <input
                  type="text"
                  id="groupName"
                  placeholder="Enter group name"
                  required
                  maxLength="100"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="groupDescription">Description *</label>
                <textarea
                  id="groupDescription"
                  rows="4"
                  placeholder="Describe your group's purpose and activities"
                  required
                  maxLength="500"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                ></textarea>
                <small className="muted">Maximum 500 characters ({groupDescription.length}/500)</small>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="footer muted">
        <div>© {new Date().getFullYear()} LinkUp • A simple demo (not affiliated).</div>
      </footer>
    </>
  );
}

export default Network;
