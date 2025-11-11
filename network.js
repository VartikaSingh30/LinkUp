// Network Page - Enhanced with Recommendations, Mutual Connections, and Groups
(function () {
  'use strict';

  const STORAGE = {
    GROUPS: 'linkup.groups',
    USER: 'linkup_current_user',
    CONNECTIONS: 'linkup.connections',
  };

  const el = {
    year: document.querySelector('#year'),
    meAvatar: document.querySelector('#meAvatar'),
    profileAvatar: document.querySelector('#profileAvatar'),
    profileName: document.querySelector('#profileName'),
    profileHeadline: document.querySelector('#profileHeadline'),
    networkTabs: document.querySelectorAll('.network-tab'),
    myNetworkContent: document.querySelector('#mynetworkContent'),
    recommendedContent: document.querySelector('#recommendedContent'),
    mutualContent: document.querySelector('#mutualContent'),
    groupsContent: document.querySelector('#groupsContent'),
    myNetworkList: document.querySelector('#myNetworkList'),
    recommendedList: document.querySelector('#recommendedList'),
    mutualList: document.querySelector('#mutualList'),
    groupsList: document.querySelector('#groupsList'),
    connectionCount: document.querySelector('#connectionCount'),
    createGroupBtn: document.querySelector('#createGroupBtn'),
    groupModal: document.querySelector('#groupModal'),
    modalTitle: document.querySelector('#modalTitle'),
    groupForm: document.querySelector('#groupForm'),
    closeModal: document.querySelector('#closeModal'),
    cancelModal: document.querySelector('#cancelModal'),
    groupName: document.querySelector('#groupName'),
    groupDescription: document.querySelector('#groupDescription'),
    navMyNetwork: document.querySelector('#navMyNetwork'),
    navRecommended: document.querySelector('#navRecommended'),
    navMutual: document.querySelector('#navMutual'),
    navGroups: document.querySelector('#navGroups'),
    quickGroupForm: document.querySelector('#quickGroupForm'),
    quickGroupName: document.querySelector('#quickGroupName'),
    quickGroupDescription: document.querySelector('#quickGroupDescription'),
    statsConnections: document.querySelector('#statsConnections'),
    statsGroups: document.querySelector('#statsGroups'),
    statsRecommended: document.querySelector('#statsRecommended'),
    charCount: document.querySelector('#charCount'),
    mobileMenuToggle: document.querySelector('#mobileMenuToggle'),
    mobileSidebar: document.querySelector('#mobileSidebar'),
    sidebarClose: document.querySelector('#sidebarClose'),
  };

  let groups = [];
  let currentUser = null;
  let myConnections = [];
  let currentTab = 'mynetwork';

  const dummyPeople = [
    { id: 1, name: 'Rahul Sharma', headline: 'Software Engineer at Google | AI Enthusiast', location: 'Bangalore, Karnataka', mutualConnections: 12, color: '#667eea' },
    { id: 2, name: 'Priya Verma', headline: 'Product Manager at Microsoft | Tech Leader', location: 'Hyderabad, Telangana', mutualConnections: 8, color: '#f093fb' },
    { id: 3, name: 'Amit Kumar', headline: 'Full Stack Developer | React & Node.js', location: 'Pune, Maharashtra', mutualConnections: 15, color: '#4facfe' },
    { id: 4, name: 'Sneha Patel', headline: 'Data Scientist at Amazon | ML Researcher', location: 'Mumbai, Maharashtra', mutualConnections: 5, color: '#43e97b' },
    { id: 5, name: 'Vikram Singh', headline: 'DevOps Engineer | Cloud Architecture', location: 'Delhi, NCR', mutualConnections: 10, color: '#fa709a' },
    { id: 6, name: 'Ananya Reddy', headline: 'UX Designer at Flipkart | Design Thinking', location: 'Bangalore, Karnataka', mutualConnections: 7, color: '#30cfd0' },
    { id: 7, name: 'Arjun Mehta', headline: 'Blockchain Developer | Web3 Enthusiast', location: 'Ahmedabad, Gujarat', mutualConnections: 6, color: '#a8edea' },
    { id: 8, name: 'Divya Iyer', headline: 'Cybersecurity Analyst | Ethical Hacker', location: 'Chennai, Tamil Nadu', mutualConnections: 9, color: '#fed6e3' },
  ];

  init();

  function init() {
    if (el.year) el.year.textContent = String(new Date().getFullYear());
    currentUser = loadCurrentUser();
    updateProfileDisplay();
    loadGroups();
    loadConnections();
    renderCurrentTab();
    setupEventListeners();
    
    // Scroll effect for topbar
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 10;
      const topbar = document.querySelector('.topbar');
      if (topbar) {
        topbar.classList.toggle('scrolled', scrolled);
      }
    });
  }

  function setupEventListeners() {
    el.networkTabs.forEach(tab => {
      tab.addEventListener('click', () => handleTabSwitch(tab.dataset.tab));
    });
    if (el.navMyNetwork) el.navMyNetwork.addEventListener('click', (e) => { e.preventDefault(); handleTabSwitch('mynetwork'); closeMobileSidebar(); });
    if (el.navRecommended) el.navRecommended.addEventListener('click', (e) => { e.preventDefault(); handleTabSwitch('recommended'); closeMobileSidebar(); });
    if (el.navMutual) el.navMutual.addEventListener('click', (e) => { e.preventDefault(); handleTabSwitch('mutual'); closeMobileSidebar(); });
    if (el.navGroups) el.navGroups.addEventListener('click', (e) => { e.preventDefault(); handleTabSwitch('groups'); closeMobileSidebar(); });
    if (el.createGroupBtn) el.createGroupBtn.addEventListener('click', openCreateGroupModal);
    if (el.closeModal) el.closeModal.addEventListener('click', closeModal);
    if (el.cancelModal) el.cancelModal.addEventListener('click', closeModal);
    if (el.groupForm) el.groupForm.addEventListener('submit', handleCreateGroup);
    if (el.quickGroupForm) el.quickGroupForm.addEventListener('submit', handleQuickCreateGroup);
    if (el.quickGroupDescription) {
      el.quickGroupDescription.addEventListener('input', updateCharCount);
    }
    if (el.mobileMenuToggle) {
      el.mobileMenuToggle.addEventListener('click', toggleMobileSidebar);
    }
    if (el.sidebarClose) {
      el.sidebarClose.addEventListener('click', closeMobileSidebar);
    }
    if (el.groupModal) {
      el.groupModal.addEventListener('click', (e) => {
        if (e.target === el.groupModal || e.target.classList.contains('modal-backdrop')) {
          closeModal();
        }
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.groupModal && !el.groupModal.hidden) {
        closeModal();
      }
    });
    setupMobileMenuOverlay();
  }

  function setupMobileMenuOverlay() {
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', closeMobileSidebar);
    }
  }

  function toggleMobileSidebar() {
    if (el.mobileSidebar) {
      const isActive = el.mobileSidebar.classList.toggle('active');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.classList.toggle('active', isActive);
      }
      if (isActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  function closeMobileSidebar() {
    if (el.mobileSidebar) {
      el.mobileSidebar.classList.remove('active');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
      document.body.style.overflow = '';
    }
  }

  function handleTabSwitch(tabName) {
    currentTab = tabName;
    el.networkTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    [el.myNetworkContent, el.recommendedContent, el.mutualContent, el.groupsContent].forEach(content => {
      if (content) content.style.display = 'none';
    });
    renderCurrentTab();
  }

  function renderCurrentTab() {
    switch(currentTab) {
      case 'mynetwork':
        if (el.myNetworkContent) el.myNetworkContent.style.display = 'block';
        renderMyNetwork();
        break;
      case 'recommended':
        if (el.recommendedContent) el.recommendedContent.style.display = 'block';
        renderRecommended();
        break;
      case 'mutual':
        if (el.mutualContent) el.mutualContent.style.display = 'block';
        renderMutual();
        break;
      case 'groups':
        if (el.groupsContent) el.groupsContent.style.display = 'block';
        renderGroups();
        break;
    }
  }

  function updateStats() {
    if (el.statsConnections) el.statsConnections.textContent = myConnections.length;
    if (el.statsGroups) el.statsGroups.textContent = groups.length;
    const recommendations = dummyPeople.filter(p => !myConnections.find(c => c.id === p.id));
    if (el.statsRecommended) el.statsRecommended.textContent = recommendations.length;
  }

  function renderMyNetwork() {
    if (!el.myNetworkList) return;
    if (el.connectionCount) el.connectionCount.textContent = myConnections.length;
    updateStats();
    if (myConnections.length === 0) {
      el.myNetworkList.innerHTML = '<div class=\"empty-state-network\"><svg width=\"64\" height=\"64\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle></svg><h3>No connections yet</h3><p>Start building your network by connecting with people</p></div>';
      return;
    }
    el.myNetworkList.innerHTML = myConnections.map(person => '<div class=\"network-person-card\"><div class=\"network-person-avatar\" style=\"background: ' + person.color + '\">' + getInitials(person.name) + '</div><div class=\"network-person-info\"><h3 class=\"network-person-name\">' + escapeHTML(person.name) + '</h3><p class=\"network-person-headline\">' + escapeHTML(person.headline) + '</p><p class=\"network-person-mutual\">' + person.location + '</p></div><div class=\"network-person-actions\"><button class=\"btn btn--sm btn--message\" onclick=\"window.location.href=\'chat.html\'\">Message</button><button class=\"btn btn--sm btn--remove\" onclick=\"window.networkRemoveConnection(' + person.id + ')\">Remove</button></div></div>').join('');
  }

  function renderRecommended() {
    if (!el.recommendedList) return;
    const recommendations = dummyPeople.filter(p => !myConnections.find(c => c.id === p.id));
    el.recommendedList.innerHTML = recommendations.map(person => '<div class=\"network-person-card\"><div class=\"network-person-avatar\" style=\"background: ' + person.color + '\">' + getInitials(person.name) + '</div><div class=\"network-person-info\"><h3 class=\"network-person-name\">' + escapeHTML(person.name) + '</h3><p class=\"network-person-headline\">' + escapeHTML(person.headline) + '</p><p class=\"network-person-mutual\">' + person.mutualConnections + ' mutual connections</p></div><div class=\"network-person-actions\"><button class=\"btn btn--sm btn--connect\" onclick=\"window.networkAddConnection(' + person.id + ')\">Connect</button></div></div>').join('');
    updateStats();
  }

  function renderMutual() {
    if (!el.mutualList) return;
    const mutualList = dummyPeople.filter(p => p.mutualConnections >= 5);
    el.mutualList.innerHTML = mutualList.map(person => '<div class=\"network-person-card\"><div class=\"network-person-avatar\" style=\"background: ' + person.color + '\">' + getInitials(person.name) + '</div><div class=\"network-person-info\"><h3 class=\"network-person-name\">' + escapeHTML(person.name) + '</h3><p class=\"network-person-headline\">' + escapeHTML(person.headline) + '</p><p class=\"network-person-mutual\">' + person.mutualConnections + ' mutual connections</p></div><div class=\"network-person-actions\"><button class=\"btn btn--sm btn--connect\" onclick=\"window.networkAddConnection(' + person.id + ')\">Connect</button></div></div>').join('');
    updateStats();
  }

  function renderGroups() {
    if (!el.groupsList) return;
    updateStats();
    if (groups.length === 0) {
      el.groupsList.innerHTML = '<div class=\"empty-state-network\"><svg width=\"64\" height=\"64\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle></svg><h3>No groups yet</h3><p>Create your first group to start connecting with others</p></div>';
      return;
    }
    el.groupsList.innerHTML = groups.map(group => '<div class=\"network-group-card\"><div class=\"group-card-header\"><div class=\"group-icon\" style=\"background: ' + group.color + '\"><svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z\"/></svg></div><div style=\"flex: 1; min-width: 0;\"><h3 style=\"margin: 0; font-size: 1.2rem; font-weight: 700;\">' + escapeHTML(group.name) + '</h3><p style=\"margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--text-muted);\">Created ' + formatDate(group.createdAt) + '</p></div><button class=\"group-delete-btn\" onclick=\"window.networkDeleteGroup(\'' + group.id + '\')\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path></svg></button></div><div class=\"group-card-body\"><p>' + escapeHTML(group.description) + '</p></div><div class=\"group-card-footer\">' + (group.members || 1) + ' member' + (group.members !== 1 ? 's' : '') + '</div></div>').join('');
  }

  window.networkAddConnection = function(personId) {
    const person = dummyPeople.find(p => p.id === personId);
    if (person && !myConnections.find(c => c.id === personId)) {
      myConnections.push(person);
      saveConnections();
      renderCurrentTab();
    }
  };

  window.networkRemoveConnection = function(personId) {
    if (confirm('Are you sure you want to remove this connection?')) {
      myConnections = myConnections.filter(c => c.id !== personId);
      saveConnections();
      renderCurrentTab();
    }
  };

  window.networkDeleteGroup = function(groupId) {
    if (confirm('Are you sure you want to delete this group?')) {
      groups = groups.filter(g => g.id !== groupId);
      saveGroups();
      renderGroups();
    }
  };

  function loadCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE.USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { id: 'me', name: 'Vartika Singh', headline: 'CS Student at VITS Satna | Full Stack Developer', color: '#667eea' };
  }

  function updateProfileDisplay() {
    const initials = getInitials(currentUser.name);
    if (el.meAvatar) {
      el.meAvatar.textContent = initials;
      el.meAvatar.style.background = currentUser.color;
    }
    if (el.profileAvatar) {
      el.profileAvatar.textContent = initials;
      el.profileAvatar.style.background = currentUser.color;
    }
    if (el.profileName) el.profileName.textContent = currentUser.name;
    if (el.profileHeadline) el.profileHeadline.textContent = currentUser.headline;
  }

  function loadGroups() {
    try {
      const stored = localStorage.getItem(STORAGE.GROUPS);
      groups = stored ? JSON.parse(stored) : [];
    } catch (e) { groups = []; }
  }

  function saveGroups() {
    try {
      localStorage.setItem(STORAGE.GROUPS, JSON.stringify(groups));
    } catch (e) {}
  }

  function loadConnections() {
    try {
      const stored = localStorage.getItem(STORAGE.CONNECTIONS);
      myConnections = stored ? JSON.parse(stored) : [];
    } catch (e) { myConnections = []; }
  }

  function saveConnections() {
    try {
      localStorage.setItem(STORAGE.CONNECTIONS, JSON.stringify(myConnections));
    } catch (e) {}
  }

  function getInitials(name) {
    return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  function openCreateGroupModal() {
    if (el.modalTitle) el.modalTitle.textContent = 'Create Group';
    if (el.groupForm) el.groupForm.reset();
    if (el.groupModal) {
      el.groupModal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    setTimeout(() => { if (el.groupName) el.groupName.focus(); }, 100);
  }

  function closeModal() {
    if (el.groupModal) el.groupModal.hidden = true;
    if (el.groupForm) el.groupForm.reset();
    document.body.style.overflow = '';
  }

  function handleCreateGroup(e) {
    e.preventDefault();
    const name = el.groupName.value.trim();
    const description = el.groupDescription.value.trim();
    if (!name || !description) { alert('Please fill in all fields'); return; }
    const newGroup = {
      id: generateId(),
      name: name,
      description: description,
      createdAt: new Date().toISOString(),
      members: 1,
      color: getRandomColor(),
    };
    groups.unshift(newGroup);
    saveGroups();
    closeModal();
    handleTabSwitch('groups');
  }

  function handleQuickCreateGroup(e) {
    e.preventDefault();
    const name = el.quickGroupName.value.trim();
    const description = el.quickGroupDescription.value.trim();
    if (!name || !description) { 
      alert('Please fill in all fields'); 
      return; 
    }
    const newGroup = {
      id: generateId(),
      name: name,
      description: description,
      createdAt: new Date().toISOString(),
      members: 1,
      color: getRandomColor(),
    };
    groups.unshift(newGroup);
    saveGroups();
    el.quickGroupForm.reset();
    if (el.charCount) el.charCount.textContent = '0';
    handleTabSwitch('groups');
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = '✓ Group created successfully!';
    successMsg.style.cssText = 'position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #43e97b 0%, #0bab64 100%); color: white; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 8px 24px rgba(67, 233, 123, 0.3); z-index: 1000; animation: slideIn 0.3s ease; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;';
    document.body.appendChild(successMsg);
    setTimeout(() => {
      successMsg.style.opacity = '0';
      successMsg.style.transition = 'opacity 0.3s ease';
      setTimeout(() => successMsg.remove(), 300);
    }, 2500);
  }

  function updateCharCount() {
    if (el.charCount && el.quickGroupDescription) {
      const count = el.quickGroupDescription.value.length;
      el.charCount.textContent = count;
      if (count > 450) {
        el.charCount.style.color = '#f5576c';
      } else {
        el.charCount.style.color = 'var(--text-muted)';
      }
    }
  }

  function getRandomColor() {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#30cfd0', '#a8edea', '#fed6e3'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return diffDays + ' days ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
    if (diffDays < 365) return Math.floor(diffDays / 30) + ' months ago';
    return Math.floor(diffDays / 365) + ' years ago';
  }

  function escapeHTML(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

})();
