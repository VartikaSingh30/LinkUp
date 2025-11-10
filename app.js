// LinkUp - Vanilla JS demo with basic posting capability
(function () {
  'use strict';

  const STORAGE = {
    POSTS: 'linkup.posts',
    LIKES: 'linkup.likes',
    THEME: 'linkup.theme',
    USER: 'linkup_current_user',
  };

  // Load user from profile or use default
  function loadCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE.USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    
    // Default user
    return {
      id: 'me',
      name: 'Vartika Singh',
      headline: 'CS Student at VIT Vellore | Full Stack Developer',
      college: 'VIT Vellore',
      location: 'Vellore, Tamil Nadu',
      color: '#667eea',
    };
  }

  const currentUser = loadCurrentUser();

  // Elements
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const el = {
    year: $('#year'),
    meAvatar: $('#meAvatar'),
    profileAvatar: $('#profileAvatar'),
    profileName: $('#profileName'),
    profileHeadline: $('#profileHeadline'),
    composerForm: $('#composerForm'),
    composerText: $('#composerText'),
    composerImage: $('#composerImage'),
    imagePreview: $('#imagePreview'),
    charCount: $('#charCount'),
    postBtn: $('#postBtn'),
    feed: $('#feed'),
  };

  // State
  let posts = loadPosts();
  let liked = loadLikes();

  init();

  function init() {
    // Footer year
    if (el.year) el.year.textContent = String(new Date().getFullYear());

    // Paint profile
    const initials = getInitials(currentUser.name);
    [el.meAvatar, el.profileAvatar, $('#composerAvatar')].forEach((node) => {
      if (!node) return;
      node.textContent = initials;
      node.style.background = currentUser.color;
      node.title = currentUser.name;
    });
    if (el.profileName) el.profileName.textContent = currentUser.name;
    if (el.profileHeadline) el.profileHeadline.textContent = currentUser.headline;

    // Scroll effect for topbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 10;
      const topbar = $('.topbar');
      if (topbar) {
        topbar.classList.toggle('scrolled', scrolled);
      }
    });

    // Composer events
    if (el.composerText) {
      el.composerText.addEventListener('input', handleComposerInput);
    }
    if (el.composerImage) {
      el.composerImage.addEventListener('change', handleImageSelect);
    }
    if (el.composerForm) {
      el.composerForm.addEventListener('submit', handlePostSubmit);
    }

    // Seed demo posts on first run
    if (!localStorage.getItem(STORAGE.POSTS)) {
      posts = seedPosts();
      savePosts(posts);
    }

    // Groups
    renderGroups();

    // Render feed
    renderFeed();
  }

  // Utilities
  function getInitials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join('');
  }

  function timeAgo(iso) {
    const delta = (Date.now() - new Date(iso).getTime()) / 1000;
    if (delta < 60) return 'just now';
    if (delta < 3600) return Math.floor(delta / 60) + 'm';
    if (delta < 86400) return Math.floor(delta / 3600) + 'h';
    if (delta < 2592000) return Math.floor(delta / 86400) + 'd';
    return new Date(iso).toLocaleDateString();
  }

  function loadPosts() {
    try {
      const raw = localStorage.getItem(STORAGE.POSTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to load posts', e);
      return [];
    }
  }

  function savePosts(list) {
    localStorage.setItem(STORAGE.POSTS, JSON.stringify(list));
  }

  function loadLikes() {
    try {
      const raw = localStorage.getItem(STORAGE.LIKES);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveLikes(set) {
    localStorage.setItem(STORAGE.LIKES, JSON.stringify(Array.from(set)));
  }

  function seedPosts() {
    const now = Date.now();
    const mk = (name, headline, text, minsAgo, color, imageData) => ({
      id: cryptoRandomId(),
      author: { name, headline, initials: getInitials(name), color },
      content: text,
      imageData: imageData || null,
      createdAt: new Date(now - minsAgo * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 100),
      comments: 0,
    });
    return [
      mk('Shruti Singh', 'Product Designer @ Flow', 'Design sprint notes from today — quick share for the team. Keep prototypes scrappy, test early, ship sooner. 🚀', 35, '#f43f5e'),
      mk('Nandini Singh', 'Full‑stack Dev', 'Just learned a neat trick with CSS grid minmax() to keep cards tidy on any screen size.', 120, '#10b981'),
      mk('Vaishnavi Singh', 'Data Analyst', 'EDA complete. Some surprising seasonality in support tickets. Write‑up coming tomorrow.', 1440, '#0ea5e9'),
    ];
  }

  function cryptoRandomId() {
    if (window.crypto && crypto.getRandomValues) {
      const arr = new Uint32Array(4);
      crypto.getRandomValues(arr);
      return Array.from(arr, (n) => n.toString(16)).join('');
    }
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }



  // Composer handlers
  function handleComposerInput() {
    const text = el.composerText.value.trim();
    const len = text.length;
    el.charCount.textContent = `${len}/500`;
    el.postBtn.disabled = len === 0 || len > 500;
  }

  function handleImageSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      el.imagePreview.hidden = true;
      el.imagePreview.innerHTML = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.alt = 'Selected image';
      el.imagePreview.innerHTML = '';
      el.imagePreview.appendChild(img);
      el.imagePreview.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  function handlePostSubmit(e) {
    e.preventDefault();
    const text = el.composerText.value.trim();
    if (!text) return;

    // Capture image if any
    const img = el.imagePreview.querySelector('img');
    const imageData = img ? img.src : null;

    const post = {
      id: cryptoRandomId(),
      author: {
        name: currentUser.name,
        headline: currentUser.headline,
        initials: getInitials(currentUser.name),
        color: currentUser.color,
      },
      content: text.slice(0, 500),
      imageData,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };

    posts.unshift(post);
    savePosts(posts);

    // Reset form
    el.composerText.value = '';
    el.charCount.textContent = '0/500';
    el.postBtn.disabled = true;
    el.composerImage.value = '';
    el.imagePreview.hidden = true;
    el.imagePreview.innerHTML = '';

    // Render
    renderFeed();
    // Scroll to top of feed (smooth)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Rendering
  function renderFeed() {
    if (!el.feed) return;
    if (!Array.isArray(posts)) posts = [];

    const html = posts.map((p) => renderPostHTML(p)).join('');
    el.feed.innerHTML = html;

    // Bind actions via delegation
    el.feed.removeEventListener('click', onFeedClick); // avoid dupes
    el.feed.addEventListener('click', onFeedClick);
  }

  function onFeedClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const card = e.target.closest('.post');
    if (!card) return;
    const id = card.getAttribute('data-id');
    const action = btn.getAttribute('data-action');

    if (action === 'like') {
      toggleLike(id, btn);
    } else if (action === 'delete') {
      deletePost(id);
    }
    // Placeholders for other actions
  }

  function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return;
    
    // Remove post from array
    posts.splice(idx, 1);
    savePosts(posts);
    
    // Remove from likes if exists
    if (liked.has(id)) {
      liked.delete(id);
      saveLikes(liked);
    }
    
    // Re-render feed
    renderFeed();
  }

  function toggleLike(id, btn) {
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const isLiked = liked.has(id);
    if (isLiked) {
      liked.delete(id);
      posts[idx].likes = Math.max(0, (posts[idx].likes || 0) - 1);
    } else {
      liked.add(id);
      posts[idx].likes = (posts[idx].likes || 0) + 1;
    }
    saveLikes(liked);
    savePosts(posts);

    // Update UI quickly
    const card = el.feed.querySelector(`.post[data-id="${id}"]`);
    if (card) {
      const likeBtn = card.querySelector('[data-action="like"]');
      const likeCount = card.querySelector('.js-like-count');
      likeBtn.classList.toggle('post__liked', !isLiked);
      likeBtn.querySelector('span').textContent = (!isLiked ? 'Liked' : 'Like');
      likeCount.textContent = posts[idx].likes;
    }
  }

  function renderPostHTML(p) {
    const isLiked = liked.has(p.id);
    const imgHTML = p.imageData
      ? `<div class="post__image"><img src="${p.imageData}" alt="Post image" loading="lazy"></div>`
      : '';
    
    const isOwnPost = p.author.name === currentUser.name;
    const deleteBtn = isOwnPost ? `
      <button class="post__btn post__btn--delete" data-action="delete" title="Delete post">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span>Delete</span>
      </button>
    ` : '';

    return `
      <article class="card post" data-id="${p.id}">
        <div class="post__header">
          <div class="avatar avatar--sm" style="background:${p.author.color}">${p.author.initials}</div>
          <div>
            <div class="post__meta">
              <span class="post__author">${escapeHTML(p.author.name)}</span>
              <span class="post__time" title="${new Date(p.createdAt).toLocaleString()}">${timeAgo(p.createdAt)}</span>
            </div>
            <div class="muted" style="font-size:.9rem">${escapeHTML(p.author.headline || '')}</div>
          </div>
        </div>
        <div class="post__body">${linkify(escapeHTML(p.content))}</div>
        ${imgHTML}
        <div class="post__stats">
          <span><strong class="js-like-count">${p.likes || 0}</strong> likes</span>
          <span>${p.comments || 0} comments</span>
        </div>
        <div class="post__actions">
          <button class="post__btn ${isLiked ? 'post__liked' : ''}" data-action="like">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.22 2.44C11.09 5 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>${isLiked ? 'Liked' : 'Like'}</span>
          </button>
          <button class="post__btn" data-action="comment">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
            <span>Comment</span>
          </button>
          <button class="post__btn" data-action="send">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
            <span>Send</span>
          </button>
          ${deleteBtn}
        </div>
      </article>
    `;
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function linkify(str) {
    const urlRE = /https?:\/\/[^\s]+/g;
    return str.replace(urlRE, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
  }

  // Suggestions (right sidebar)
  function renderSuggestions() {
    const list = $('#suggestList');
    if (!list) return;
    const people = [
      { name: 'Maya Singh', headline: 'UX Researcher', color: '#f59e0b' },
      { name: 'Nandini', headline: 'Mobile Engineer', color: '#14b8a6' },
      { name: 'Riya', headline: 'ML Engineer', color: '#8b5cf6' },
    ];
    list.innerHTML = people
      .map((p) => `
        <li>
          <div class="suggest-item">
            <div class="avatar avatar--sm" style="background:${p.color}">${getInitials(p.name)}</div>
            <div>
              <div style="font-weight:700">${escapeHTML(p.name)}</div>
              <div class="headline">${escapeHTML(p.headline)}</div>
            </div>
            <button class="btn btn--ghost" type="button">Connect</button>
          </div>
        </li>
      `)
      .join('');
  }

  // Groups (left sidebar)
  function renderGroups() {
    const list = $('#groupsList');
    if (!list) return;
    const groups = [
      { name: 'Full Stack Developers', members: '45.2k', color: '#667eea' },
      { name: 'React & JavaScript Community', members: '38.7k', color: '#f093fb' },
      { name: 'Backend Engineering', members: '32.1k', color: '#4facfe' },
      { name: 'Web3 & Blockchain Enthusiasts', members: '28.5k', color: '#10b981' },
      { name: 'VIT Tech Community', members: '12.8k', color: '#f59e0b' },
    ];
    list.innerHTML = groups
      .map((g) => `
        <li>
          <a href="#" class="group-item">
            <div class="group-icon" style="background: linear-gradient(135deg, ${g.color}, ${g.color}dd)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
            <div class="group-info">
              <div class="group-name">${escapeHTML(g.name)}</div>
              <div class="group-members">${g.members} members</div>
            </div>
          </a>
        </li>
      `)
      .join('');
  }
})();
