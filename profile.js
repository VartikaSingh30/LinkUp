// Profile Page Script
(function () {
  'use strict';

  // Storage keys
  const STORAGE_KEYS = {
    USER_PROFILE: 'linkup_user_profile',
    EXPERIENCES: 'linkup_experiences',
    EDUCATION: 'linkup_education',
    SKILLS: 'linkup_skills',
  };

  // Default user profile
  const defaultProfile = {
    name: 'Vartika Singh',
    headline: 'CS Student at VIT Vellore | Full Stack Developer',
    location: 'Vellore, Tamil Nadu',
    about: 'Passionate about building innovative web applications and exploring new technologies. Currently pursuing Computer Science at VIT Vellore with a focus on full-stack development.',
    color: '#667eea',
    coverImage: null,
    avatarImage: null,
  };

  // Load data from localStorage
  function loadData(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // Save data to localStorage
  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Get initials from name
  function getInitials(name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Elements
  const el = {
    profileAvatar: document.getElementById('profileAvatar'),
    meAvatar: document.getElementById('meAvatar'),
    displayName: document.getElementById('displayName'),
    displayHeadline: document.getElementById('displayHeadline'),
    displayLocation: document.getElementById('displayLocation'),
    displayAbout: document.getElementById('displayAbout'),
    profileCover: document.getElementById('profileCover'),
    
    editProfileBtn: document.getElementById('editProfileBtn'),
    editAboutBtn: document.getElementById('editAboutBtn'),
    editCoverBtn: document.getElementById('editCoverBtn'),
    editAvatarBtn: document.getElementById('editAvatarBtn'),
    
    editProfileModal: document.getElementById('editProfileModal'),
    closeEditModal: document.getElementById('closeEditModal'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),
    editProfileForm: document.getElementById('editProfileForm'),
    editName: document.getElementById('editName'),
    editHeadline: document.getElementById('editHeadline'),
    editLocation: document.getElementById('editLocation'),
    editAboutText: document.getElementById('editAboutText'),
    editAvatarColor: document.getElementById('editAvatarColor'),
    
    addItemModal: document.getElementById('addItemModal'),
    closeAddModal: document.getElementById('closeAddModal'),
    cancelAddBtn: document.getElementById('cancelAddBtn'),
    addItemForm: document.getElementById('addItemForm'),
    addItemTitle: document.getElementById('addItemTitle'),
    formFields: document.getElementById('formFields'),
    
    experienceList: document.getElementById('experienceList'),
    educationList: document.getElementById('educationList'),
    skillsList: document.getElementById('skillsList'),
    
    addExperienceBtn: document.getElementById('addExperienceBtn'),
    addEducationBtn: document.getElementById('addEducationBtn'),
    addSkillBtn: document.getElementById('addSkillBtn'),
    
    themeToggle: document.getElementById('themeToggle'),
  };

  // State
  let userProfile = loadData(STORAGE_KEYS.USER_PROFILE, defaultProfile);
  let experiences = loadData(STORAGE_KEYS.EXPERIENCES, [
    {
      id: Date.now(),
      title: 'Full Stack Developer Intern',
      company: 'Tech Startup',
      duration: 'Jun 2024 - Present',
      description: 'Building scalable web applications using React and Node.js',
    },
  ]);
  let education = loadData(STORAGE_KEYS.EDUCATION, [
    {
      id: Date.now(),
      degree: 'B.Tech Computer Science',
      institution: 'VIT Vellore',
      duration: '2022 - 2026',
      description: 'CGPA: 9.2/10',
    },
  ]);
  let skills = loadData(STORAGE_KEYS.SKILLS, [
    'JavaScript', 'React', 'Node.js', 'Python', 'HTML/CSS', 'MongoDB', 'Git', 'REST APIs'
  ]);

  let currentModalType = null;

  // Initialize
  function init() {
    renderProfile();
    renderExperiences();
    renderEducation();
    renderSkills();
    bindEvents();
    initTheme();
  }

  // Render profile
  function renderProfile() {
    const initials = getInitials(userProfile.name);
    el.profileAvatar.textContent = initials;
    el.profileAvatar.style.background = userProfile.color;
    el.meAvatar.textContent = initials;
    el.meAvatar.style.background = userProfile.color;
    
    el.displayName.textContent = userProfile.name;
    el.displayHeadline.textContent = userProfile.headline;
    el.displayLocation.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      ${userProfile.location}
    `;
    el.displayAbout.textContent = userProfile.about;
    
    if (userProfile.coverImage) {
      el.profileCover.style.backgroundImage = `url(${userProfile.coverImage})`;
    }
    
    if (userProfile.avatarImage) {
      el.profileAvatar.style.backgroundImage = `url(${userProfile.avatarImage})`;
      el.profileAvatar.textContent = '';
    }
  }

  // Render experiences
  function renderExperiences() {
    if (experiences.length === 0) {
      el.experienceList.innerHTML = '<p class="empty-state">No experience added yet</p>';
      return;
    }
    
    el.experienceList.innerHTML = experiences.map(exp => `
      <div class="profile-item" data-id="${exp.id}">
        <div class="item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>
        </div>
        <div class="item-content">
          <h3>${escapeHTML(exp.title)}</h3>
          <p class="item-subtitle">${escapeHTML(exp.company)}</p>
          <p class="item-duration">${escapeHTML(exp.duration)}</p>
          ${exp.description ? `<p class="item-description">${escapeHTML(exp.description)}</p>` : ''}
        </div>
        <button class="item-delete" data-type="experience" data-id="${exp.id}" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');
  }

  // Render education
  function renderEducation() {
    if (education.length === 0) {
      el.educationList.innerHTML = '<p class="empty-state">No education added yet</p>';
      return;
    }
    
    el.educationList.innerHTML = education.map(edu => `
      <div class="profile-item" data-id="${edu.id}">
        <div class="item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
        <div class="item-content">
          <h3>${escapeHTML(edu.degree)}</h3>
          <p class="item-subtitle">${escapeHTML(edu.institution)}</p>
          <p class="item-duration">${escapeHTML(edu.duration)}</p>
          ${edu.description ? `<p class="item-description">${escapeHTML(edu.description)}</p>` : ''}
        </div>
        <button class="item-delete" data-type="education" data-id="${edu.id}" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');
  }

  // Render skills
  function renderSkills() {
    if (skills.length === 0) {
      el.skillsList.innerHTML = '<p class="empty-state">No skills added yet</p>';
      return;
    }
    
    el.skillsList.innerHTML = skills.map((skill, index) => `
      <span class="skill-tag">
        ${escapeHTML(skill)}
        <button class="skill-remove" data-index="${index}" title="Remove skill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    `).join('');
  }

  // Bind events
  function bindEvents() {
    el.editProfileBtn.addEventListener('click', openEditProfileModal);
    el.editAboutBtn.addEventListener('click', openEditProfileModal);
    el.closeEditModal.addEventListener('click', closeEditProfileModal);
    el.cancelEditBtn.addEventListener('click', closeEditProfileModal);
    el.editProfileForm.addEventListener('submit', handleProfileSubmit);
    
    el.addExperienceBtn.addEventListener('click', () => openAddItemModal('experience'));
    el.addEducationBtn.addEventListener('click', () => openAddItemModal('education'));
    el.addSkillBtn.addEventListener('click', () => openAddItemModal('skill'));
    el.closeAddModal.addEventListener('click', closeAddItemModal);
    el.cancelAddBtn.addEventListener('click', closeAddItemModal);
    el.addItemForm.addEventListener('submit', handleAddItemSubmit);
    
    el.experienceList.addEventListener('click', handleItemDelete);
    el.educationList.addEventListener('click', handleItemDelete);
    el.skillsList.addEventListener('click', handleSkillRemove);
    
    el.editCoverBtn.addEventListener('click', handleCoverUpload);
    el.editAvatarBtn.addEventListener('click', handleAvatarUpload);
    
    if (el.themeToggle) {
      el.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Close modal on overlay click
    el.editProfileModal.addEventListener('click', (e) => {
      if (e.target === el.editProfileModal || e.target.classList.contains('modal-overlay')) {
        closeEditProfileModal();
      }
    });
    el.addItemModal.addEventListener('click', (e) => {
      if (e.target === el.addItemModal || e.target.classList.contains('modal-overlay')) {
        closeAddItemModal();
      }
    });
    
    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!el.editProfileModal.hidden) {
          closeEditProfileModal();
        }
        if (!el.addItemModal.hidden) {
          closeAddItemModal();
        }
      }
    });
  }

  // Open edit profile modal
  function openEditProfileModal() {
    el.editName.value = userProfile.name;
    el.editHeadline.value = userProfile.headline;
    el.editLocation.value = userProfile.location;
    el.editAboutText.value = userProfile.about;
    el.editAvatarColor.value = userProfile.color;
    el.editProfileModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  // Close edit profile modal
  function closeEditProfileModal() {
    el.editProfileModal.hidden = true;
    document.body.style.overflow = '';
  }

  // Handle profile submit
  function handleProfileSubmit(e) {
    e.preventDefault();
    
    userProfile.name = el.editName.value.trim();
    userProfile.headline = el.editHeadline.value.trim();
    userProfile.location = el.editLocation.value.trim();
    userProfile.about = el.editAboutText.value.trim();
    userProfile.color = el.editAvatarColor.value;
    
    saveData(STORAGE_KEYS.USER_PROFILE, userProfile);
    
    // Update main app's user profile too
    localStorage.setItem('linkup_current_user', JSON.stringify({
      name: userProfile.name,
      headline: userProfile.headline,
      college: userProfile.location.split(',')[0],
      location: userProfile.location,
      color: userProfile.color,
    }));
    
    renderProfile();
    closeEditProfileModal();
  }

  // Open add item modal
  function openAddItemModal(type) {
    currentModalType = type;
    
    if (type === 'experience') {
      el.addItemTitle.textContent = 'Add Experience';
      el.formFields.innerHTML = `
        <div class="form-group">
          <label for="itemTitle">Job Title *</label>
          <input type="text" id="itemTitle" required placeholder="e.g., Software Engineer" />
        </div>
        <div class="form-group">
          <label for="itemCompany">Company *</label>
          <input type="text" id="itemCompany" required placeholder="e.g., Google" />
        </div>
        <div class="form-group">
          <label for="itemDuration">Duration *</label>
          <input type="text" id="itemDuration" required placeholder="e.g., Jan 2023 - Present" />
        </div>
        <div class="form-group">
          <label for="itemDescription">Description</label>
          <textarea id="itemDescription" rows="4" placeholder="Describe your responsibilities..."></textarea>
        </div>
      `;
    } else if (type === 'education') {
      el.addItemTitle.textContent = 'Add Education';
      el.formFields.innerHTML = `
        <div class="form-group">
          <label for="itemDegree">Degree *</label>
          <input type="text" id="itemDegree" required placeholder="e.g., B.Tech Computer Science" />
        </div>
        <div class="form-group">
          <label for="itemInstitution">Institution *</label>
          <input type="text" id="itemInstitution" required placeholder="e.g., VIT Vellore" />
        </div>
        <div class="form-group">
          <label for="itemDuration">Duration *</label>
          <input type="text" id="itemDuration" required placeholder="e.g., 2022 - 2026" />
        </div>
        <div class="form-group">
          <label for="itemDescription">Additional Info</label>
          <textarea id="itemDescription" rows="4" placeholder="CGPA, achievements, etc."></textarea>
        </div>
      `;
    } else if (type === 'skill') {
      el.addItemTitle.textContent = 'Add Skill';
      el.formFields.innerHTML = `
        <div class="form-group">
          <label for="itemSkill">Skill Name *</label>
          <input type="text" id="itemSkill" required placeholder="e.g., React, Python, etc." />
        </div>
      `;
    }
    
    el.addItemModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  // Close add item modal
  function closeAddItemModal() {
    el.addItemModal.hidden = true;
    document.body.style.overflow = '';
    currentModalType = null;
    el.addItemForm.reset();
  }

  // Handle add item submit
  function handleAddItemSubmit(e) {
    e.preventDefault();
    
    if (currentModalType === 'experience') {
      const newExp = {
        id: Date.now(),
        title: document.getElementById('itemTitle').value.trim(),
        company: document.getElementById('itemCompany').value.trim(),
        duration: document.getElementById('itemDuration').value.trim(),
        description: document.getElementById('itemDescription').value.trim(),
      };
      experiences.unshift(newExp);
      saveData(STORAGE_KEYS.EXPERIENCES, experiences);
      renderExperiences();
    } else if (currentModalType === 'education') {
      const newEdu = {
        id: Date.now(),
        degree: document.getElementById('itemDegree').value.trim(),
        institution: document.getElementById('itemInstitution').value.trim(),
        duration: document.getElementById('itemDuration').value.trim(),
        description: document.getElementById('itemDescription').value.trim(),
      };
      education.unshift(newEdu);
      saveData(STORAGE_KEYS.EDUCATION, education);
      renderEducation();
    } else if (currentModalType === 'skill') {
      const newSkill = document.getElementById('itemSkill').value.trim();
      if (newSkill && !skills.includes(newSkill)) {
        skills.push(newSkill);
        saveData(STORAGE_KEYS.SKILLS, skills);
        renderSkills();
      }
    }
    
    closeAddItemModal();
  }

  // Handle item delete
  function handleItemDelete(e) {
    const deleteBtn = e.target.closest('.item-delete');
    if (!deleteBtn) return;
    
    const type = deleteBtn.dataset.type;
    const id = parseInt(deleteBtn.dataset.id);
    
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    if (type === 'experience') {
      experiences = experiences.filter(exp => exp.id !== id);
      saveData(STORAGE_KEYS.EXPERIENCES, experiences);
      renderExperiences();
    } else if (type === 'education') {
      education = education.filter(edu => edu.id !== id);
      saveData(STORAGE_KEYS.EDUCATION, education);
      renderEducation();
    }
  }

  // Handle skill remove
  function handleSkillRemove(e) {
    const removeBtn = e.target.closest('.skill-remove');
    if (!removeBtn) return;
    
    const index = parseInt(removeBtn.dataset.index);
    skills.splice(index, 1);
    saveData(STORAGE_KEYS.SKILLS, skills);
    renderSkills();
  }

  // Handle cover upload
  function handleCoverUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        userProfile.coverImage = event.target.result;
        saveData(STORAGE_KEYS.USER_PROFILE, userProfile);
        renderProfile();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // Handle avatar upload
  function handleAvatarUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        userProfile.avatarImage = event.target.result;
        saveData(STORAGE_KEYS.USER_PROFILE, userProfile);
        renderProfile();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // Theme functions
  function initTheme() {
    const theme = localStorage.getItem('linkup_theme') || 'light';
    document.body.classList.toggle('dark', theme === 'dark');
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('linkup_theme', isDark ? 'dark' : 'light');
  }

  // Escape HTML
  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
