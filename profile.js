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
    headline: 'CS Student at VITS Satna | Full Stack Developer',
    location: 'Satna, Madhya Pradesh',
    about: 'Passionate about building innovative web applications and exploring new technologies. Currently pursuing Computer Science at VITS (Vindhya Institute of Technology and Science), Satna with a focus on full-stack development.',
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
    profileBanner: document.getElementById('profileBanner'),
    
    editProfileBtn: document.getElementById('editProfileBtn'),
    editAboutBtn: document.getElementById('editAboutBtn'),
    editBannerBtn: document.getElementById('editBannerBtn'),
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
    
    cropperModal: document.getElementById('cropperModal'),
    closeCropperModal: document.getElementById('closeCropperModal'),
    cancelCropBtn: document.getElementById('cancelCropBtn'),
    applyCropBtn: document.getElementById('applyCropBtn'),
    cropperImage: document.getElementById('cropperImage'),
    cropperTitle: document.getElementById('cropperTitle'),
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
      institution: 'VITS (Vindhya Institute of Technology and Science), Satna',
      duration: '2022 - 2026',
      description: 'CGPA: 9.2/10',
    },
  ]);
  let skills = loadData(STORAGE_KEYS.SKILLS, [
    'JavaScript', 'React', 'Node.js', 'Python', 'HTML/CSS', 'MongoDB', 'Git', 'REST APIs'
  ]);

  let currentModalType = null;
  let cropper = null;
  let currentCropType = null; // 'avatar' or 'banner'

  // Initialize
  function init() {
    renderProfile();
    renderExperiences();
    renderEducation();
    renderSkills();
    bindEvents();
    
    // Scroll effect for topbar
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 10;
      const topbar = document.querySelector('.topbar');
      if (topbar) {
        topbar.classList.toggle('scrolled', scrolled);
      }
    });
  }

  // Render profile
  function renderProfile() {
    const initials = getInitials(userProfile.name);
    el.profileAvatar.textContent = initials;
    el.profileAvatar.style.background = userProfile.color;
    if (el.meAvatar) {
      el.meAvatar.textContent = initials;
      el.meAvatar.style.background = userProfile.color;
    }
    
    el.displayName.textContent = userProfile.name;
    el.displayHeadline.textContent = userProfile.headline;
    el.displayLocation.textContent = userProfile.location;
    el.displayAbout.textContent = userProfile.about;
    
    if (userProfile.coverImage) {
      el.profileBanner.style.backgroundImage = `url(${userProfile.coverImage})`;
      el.profileBanner.style.backgroundSize = 'cover';
      el.profileBanner.style.backgroundPosition = 'center';
    }
    
    if (userProfile.avatarImage) {
      el.profileAvatar.style.backgroundImage = `url(${userProfile.avatarImage})`;
      el.profileAvatar.style.backgroundSize = 'cover';
      el.profileAvatar.style.backgroundPosition = 'center';
      el.profileAvatar.textContent = '';
    }
  }

  // Render experiences
  function renderExperiences() {
    if (experiences.length === 0) {
      el.experienceList.innerHTML = '<div class="empty-state"><p>No experience added yet</p></div>';
      return;
    }
    
    el.experienceList.innerHTML = experiences.map(exp => `
      <div class="profile-item" data-id="${exp.id}">
        <div class="item-logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>
        </div>
        <div class="item-content">
          <h3 class="item-title">${escapeHTML(exp.title)}</h3>
          <p class="item-subtitle">${escapeHTML(exp.company)}</p>
          <p class="item-date">${escapeHTML(exp.duration)}</p>
          ${exp.description ? `<p class="item-description">${escapeHTML(exp.description)}</p>` : ''}
        </div>
        <div class="item-actions">
          <button class="item-delete-btn" data-type="experience" data-id="${exp.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Render education
  function renderEducation() {
    if (education.length === 0) {
      el.educationList.innerHTML = '<div class="empty-state"><p>No education added yet</p></div>';
      return;
    }
    
    el.educationList.innerHTML = education.map(edu => `
      <div class="profile-item" data-id="${edu.id}">
        <div class="item-logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
        <div class="item-content">
          <h3 class="item-title">${escapeHTML(edu.degree)}</h3>
          <p class="item-subtitle">${escapeHTML(edu.institution)}</p>
          <p class="item-date">${escapeHTML(edu.duration)}</p>
          ${edu.description ? `<p class="item-description">${escapeHTML(edu.description)}</p>` : ''}
        </div>
        <div class="item-actions">
          <button class="item-delete-btn" data-type="education" data-id="${edu.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Render skills
  function renderSkills() {
    if (skills.length === 0) {
      el.skillsList.innerHTML = '<div class="empty-state"><p>No skills added yet</p></div>';
      return;
    }
    
    el.skillsList.innerHTML = skills.map((skill, index) => `
      <div class="skill-item">
        <span class="skill-name">
          <svg class="skill-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/>
          </svg>
          ${escapeHTML(skill)}
        </span>
        <button class="skill-remove" data-index="${index}" title="Remove skill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
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
    
    el.editBannerBtn.addEventListener('click', handleCoverUpload);
    el.editAvatarBtn.addEventListener('click', handleAvatarUpload);
    
    // Cropper modal events
    el.closeCropperModal.addEventListener('click', closeCropperModal);
    el.cancelCropBtn.addEventListener('click', closeCropperModal);
    el.applyCropBtn.addEventListener('click', applyCrop);
    
    // Close modal on overlay click
    el.editProfileModal.addEventListener('click', (e) => {
      if (e.target === el.editProfileModal || e.target.classList.contains('modal-backdrop')) {
        closeEditProfileModal();
      }
    });
    el.addItemModal.addEventListener('click', (e) => {
      if (e.target === el.addItemModal || e.target.classList.contains('modal-backdrop')) {
        closeAddItemModal();
      }
    });
    el.cropperModal.addEventListener('click', (e) => {
      if (e.target === el.cropperModal || e.target.classList.contains('modal-backdrop')) {
        closeCropperModal();
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
        if (!el.cropperModal.hidden) {
          closeCropperModal();
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
          <label class="form-label" for="itemTitle">Job Title *</label>
          <input class="form-input" type="text" id="itemTitle" required placeholder="e.g., Software Engineer" />
        </div>
        <div class="form-group">
          <label class="form-label" for="itemCompany">Company *</label>
          <input class="form-input" type="text" id="itemCompany" required placeholder="e.g., Google" />
        </div>
        <div class="form-group">
          <label class="form-label" for="itemDuration">Duration *</label>
          <input class="form-input" type="text" id="itemDuration" required placeholder="e.g., Jan 2023 - Present" />
        </div>
        <div class="form-group">
          <label class="form-label" for="itemDescription">Description</label>
          <textarea class="form-textarea" id="itemDescription" rows="4" placeholder="Describe your responsibilities..."></textarea>
        </div>
      `;
    } else if (type === 'education') {
      el.addItemTitle.textContent = 'Add Education';
      el.formFields.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="itemDegree">Degree *</label>
          <input class="form-input" type="text" id="itemDegree" required placeholder="e.g., B.Tech Computer Science" />
        </div>
        <div class="form-group">
          <label class="form-label" for="itemInstitution">Institution *</label>
          <input class="form-input" type="text" id="itemInstitution" required placeholder="e.g., VITS Satna" />
        </div>
        <div class="form-group">
          <label class="form-label" for="itemDuration">Duration *</label>
          <input class="form-input" type="text" id="itemDuration" required placeholder="e.g., 2022 - 2026" />
        </div>
        <div class="form-group">
          <label class="form-label" for="itemDescription">Additional Info</label>
          <textarea class="form-textarea" id="itemDescription" rows="4" placeholder="CGPA, achievements, etc."></textarea>
        </div>
      `;
    } else if (type === 'skill') {
      el.addItemTitle.textContent = 'Add Skill';
      el.formFields.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="itemSkill">Skill Name *</label>
          <input class="form-input" type="text" id="itemSkill" required placeholder="e.g., React, Python, etc." />
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
    const deleteBtn = e.target.closest('.item-delete-btn');
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
    currentCropType = 'banner';
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        openCropperModal(event.target.result, 'Crop Banner Image');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // Handle avatar upload
  function handleAvatarUpload() {
    currentCropType = 'avatar';
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        openCropperModal(event.target.result, 'Crop Profile Picture');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // Open cropper modal
  function openCropperModal(imageData, title) {
    el.cropperTitle.textContent = title;
    el.cropperImage.src = imageData;
    el.cropperModal.hidden = false;
    document.body.style.overflow = 'hidden';
    
    // Initialize cropper with different aspect ratios
    if (cropper) {
      cropper.destroy();
    }
    
    const aspectRatio = currentCropType === 'banner' ? 16 / 9 : 1;
    
    cropper = new Cropper(el.cropperImage, {
      aspectRatio: aspectRatio,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
      responsive: true,
      background: true,
    });
  }

  // Close cropper modal
  function closeCropperModal() {
    el.cropperModal.hidden = true;
    document.body.style.overflow = '';
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    currentCropType = null;
  }

  // Apply crop
  function applyCrop() {
    if (!cropper) return;
    
    const canvas = cropper.getCroppedCanvas({
      maxWidth: currentCropType === 'banner' ? 1600 : 800,
      maxHeight: currentCropType === 'banner' ? 900 : 800,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
    
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    
    if (currentCropType === 'banner') {
      userProfile.coverImage = croppedImage;
    } else if (currentCropType === 'avatar') {
      userProfile.avatarImage = croppedImage;
    }
    
    saveData(STORAGE_KEYS.USER_PROFILE, userProfile);
    renderProfile();
    closeCropperModal();
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
