// Network Page - Group Management
(function () {
  'use strict';

  const STORAGE = {
    GROUPS: 'linkup.groups',
    USER: 'linkup_current_user',
  };

  // Elements
  const $ = (sel) => document.querySelector(sel);
  
  const el = {
    year: $('#year'),
    meAvatar: $('#meAvatar'),
    profileAvatar: $('#profileAvatar'),
    profileName: $('#profileName'),
    profileHeadline: $('#profileHeadline'),
    createGroupBtn: $('#createGroupBtn'),
    groupsList: $('#groupsList'),
    groupModal: $('#groupModal'),
    modalTitle: $('#modalTitle'),
    groupForm: $('#groupForm'),
    closeModal: $('#closeModal'),
    cancelModal: $('#cancelModal'),
    groupName: $('#groupName'),
    groupDescription: $('#groupDescription'),
  };

  let groups = [];
  let currentUser = null;

  init();

  function init() {
    // Footer year
    if (el.year) el.year.textContent = String(new Date().getFullYear());

    // Load current user
    currentUser = loadCurrentUser();
    
    // Update profile display
    updateProfileDisplay();

    // Load groups
    loadGroups();
    renderGroups();

    // Event listeners
    if (el.createGroupBtn) {
      el.createGroupBtn.addEventListener('click', openCreateGroupModal);
    }
    if (el.closeModal) {
      el.closeModal.addEventListener('click', closeModal);
    }
    if (el.cancelModal) {
      el.cancelModal.addEventListener('click', closeModal);
    }
    if (el.groupForm) {
      el.groupForm.addEventListener('submit', handleCreateGroup);
    }

    // Close modal on backdrop click
    const backdrop = el.groupModal?.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.groupModal && !el.groupModal.hidden) {
        closeModal();
      }
    });
  }

  function loadCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE.USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    
    return {
      id: 'me',
      name: 'Vartika Singh',
      headline: 'CS Student at VIT Vellore | Full Stack Developer',
      color: '#667eea',
    };
  }

  function updateProfileDisplay() {
    const initials = getInitials(currentUser.name);
    
    [el.meAvatar, el.profileAvatar].forEach((avatar) => {
      if (avatar) {
        avatar.textContent = initials;
        avatar.style.background = currentUser.color;
        avatar.title = currentUser.name;
      }
    });

    if (el.profileName) {
      el.profileName.textContent = currentUser.name;
    }
    if (el.profileHeadline) {
      el.profileHeadline.textContent = currentUser.headline;
    }
  }

  function getInitials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join('');
  }

  function loadGroups() {
    try {
      const stored = localStorage.getItem(STORAGE.GROUPS);
      if (stored) {
        groups = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load groups', e);
      groups = [];
    }
  }

  function saveGroups() {
    try {
      localStorage.setItem(STORAGE.GROUPS, JSON.stringify(groups));
    } catch (e) {
      console.error('Failed to save groups', e);
    }
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  function openCreateGroupModal() {
    if (el.modalTitle) {
      el.modalTitle.textContent = 'Create Group';
    }
    if (el.groupForm) {
      el.groupForm.reset();
    }
    if (el.groupModal) {
      el.groupModal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    // Focus on the name input
    setTimeout(() => {
      if (el.groupName) el.groupName.focus();
    }, 100);
  }

  function closeModal() {
    if (el.groupModal) {
      el.groupModal.hidden = true;
      document.body.style.overflow = '';
    }
    if (el.groupForm) {
      el.groupForm.reset();
    }
  }

  function handleCreateGroup(e) {
    e.preventDefault();

    const name = el.groupName.value.trim();
    const description = el.groupDescription.value.trim();

    if (!name || !description) {
      alert('Please fill in all fields');
      return;
    }

    const newGroup = {
      id: generateId(),
      name: name,
      description: description,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      members: 1,
      color: getRandomColor(),
    };

    groups.unshift(newGroup);
    saveGroups();
    renderGroups();
    closeModal();

    // Show success message
    showSuccessMessage('Group created successfully!');
  }

  function renderGroups() {
    if (!el.groupsList) return;

    if (groups.length === 0) {
      el.groupsList.innerHTML = `
        <div class="empty-state-network">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h3>No groups yet</h3>
          <p>Create your first group to start connecting with others</p>
        </div>
      `;
      return;
    }

    const html = groups.map((group) => renderGroupCard(group)).join('');
    el.groupsList.innerHTML = html;

    // Bind delete buttons
    document.querySelectorAll('.group-delete-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const groupId = btn.getAttribute('data-id');
        deleteGroup(groupId);
      });
    });
  }

  function renderGroupCard(group) {
    const timeAgo = formatTimeAgo(group.createdAt);
    
    return `
      <div class="network-group-card" data-id="${group.id}">
        <div class="group-card-header">
          <div class="group-icon" style="background: ${group.color}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div class="group-card-info">
            <h3>${escapeHTML(group.name)}</h3>
            <p class="muted">${group.members} ${group.members === 1 ? 'member' : 'members'}</p>
          </div>
          <button class="group-delete-btn" data-id="${group.id}" title="Delete group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        <div class="group-card-body">
          <p>${escapeHTML(group.description)}</p>
        </div>
        <div class="group-card-footer">
          <span class="muted">Created by ${escapeHTML(group.createdBy)}</span>
          <span class="muted">•</span>
          <span class="muted">${timeAgo}</span>
        </div>
      </div>
    `;
  }

  function deleteGroup(groupId) {
    if (!confirm('Are you sure you want to delete this group?')) {
      return;
    }

    groups = groups.filter((g) => g.id !== groupId);
    saveGroups();
    renderGroups();
    showSuccessMessage('Group deleted successfully!');
  }

  function getRandomColor() {
    const colors = [
      '#667eea',
      '#764ba2',
      '#f093fb',
      '#4facfe',
      '#43e97b',
      '#fa709a',
      '#30cfd0',
      '#a8edea',
      '#667eea',
      '#f5576c',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function formatTimeAgo(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) return 'just now';

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Less than 30 days
    if (diff < 2592000000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }

    // Otherwise show date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
})();
