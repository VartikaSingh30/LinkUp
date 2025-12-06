import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Cropper from 'react-cropper';

function Profile() {
  const [profile, setProfile] = useState({
    name: 'Vartika Singh',
    headline: 'CS Student at VITS Satna | Full Stack Developer',
    location: 'Satna, Madhya Pradesh',
    about: 'Passionate about building innovative web applications and exploring new technologies. Currently pursuing Computer Science at VITS (Vindhya Institute of Technology and Science), Satna with a focus on full-stack development.',
    color: '#667eea',
    bannerImage: null,
    avatarImage: null
  });

  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [itemModalType, setItemModalType] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [cropperType, setCropperType] = useState('');
  
  const cropperRef = useRef(null);
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('linkup_user_profile');
    const savedExperiences = localStorage.getItem('linkup_experiences');
    const savedEducation = localStorage.getItem('linkup_education');
    const savedSkills = localStorage.getItem('linkup_skills');
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedExperiences) setExperiences(JSON.parse(savedExperiences));
    if (savedEducation) setEducation(JSON.parse(savedEducation));
    if (savedSkills) setSkills(JSON.parse(savedSkills));
  }, []);

  useEffect(() => {
    localStorage.setItem('linkup_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('linkup_experiences', JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem('linkup_education', JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem('linkup_skills', JSON.stringify(skills));
  }, [skills]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setProfile({
      ...profile,
      name: formData.get('editName'),
      headline: formData.get('editHeadline'),
      location: formData.get('editLocation'),
      about: formData.get('editAboutText'),
      color: formData.get('editAvatarColor')
    });
    setShowEditModal(false);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentImage(event.target.result);
        setCropperType(type);
        setShowCropperModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
      
      if (cropperType === 'banner') {
        setProfile({ ...profile, bannerImage: croppedDataUrl });
      } else if (cropperType === 'avatar') {
        setProfile({ ...profile, avatarImage: croppedDataUrl });
      }
      
      setShowCropperModal(false);
      setCurrentImage('');
    }
  };

  const addItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (itemModalType === 'experience') {
      setExperiences([...experiences, {
        id: Date.now(),
        title: formData.get('title'),
        company: formData.get('company'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate') || 'Present',
        description: formData.get('description')
      }]);
    } else if (itemModalType === 'education') {
      setEducation([...education, {
        id: Date.now(),
        school: formData.get('school'),
        degree: formData.get('degree'),
        field: formData.get('field'),
        startYear: formData.get('startYear'),
        endYear: formData.get('endYear') || 'Present'
      }]);
    } else if (itemModalType === 'skill') {
      setSkills([...skills, {
        id: Date.now(),
        name: formData.get('skillName'),
        level: formData.get('skillLevel')
      }]);
    }
    
    setShowItemModal(false);
  };

  const deleteItem = (type, id) => {
    if (type === 'experience') setExperiences(experiences.filter(e => e.id !== id));
    else if (type === 'education') setEducation(education.filter(e => e.id !== id));
    else if (type === 'skill') setSkills(skills.filter(s => s.id !== id));
  };

  const openItemModal = (type) => {
    setItemModalType(type);
    setShowItemModal(true);
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
          <div className="me-chip" title="Me">
            <div className="avatar avatar--sm" style={{ background: profile.color }}>
              {profile.avatarImage ? (
                <img src={profile.avatarImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                getInitials(profile.name)
              )}
            </div>
          </div>
        </nav>
      </header>

      <div className="profile-page-wrapper">
        <div className="profile-container">
          <div className="profile-card profile-header-card">
            <div 
              className="profile-banner" 
              id="profileBanner"
              style={profile.bannerImage ? { backgroundImage: `url(${profile.bannerImage})` } : {}}
            >
              <input
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleImageUpload(e, 'banner')}
              />
              <button className="edit-banner-btn" onClick={() => bannerInputRef.current?.click()} title="Change banner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>
            
            <div className="profile-main-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar-large" style={{ background: profile.color }}>
                    {profile.avatarImage ? (
                      <img src={profile.avatarImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      getInitials(profile.name)
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                  />
                  <button className="edit-avatar-badge" onClick={() => avatarInputRef.current?.click()} title="Change photo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </button>
                </div>
                
                <div className="profile-actions">
                  <button className="profile-btn profile-btn-primary" onClick={() => setShowEditModal(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
              
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-headline">{profile.headline}</p>
              <div className="profile-meta">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{profile.location}</span>
              </div>
              <span className="profile-connections">500+ connections</span>
            </div>
          </div>

          <div className="profile-card profile-section-card">
            <div className="section-header">
              <h2 className="section-title">About</h2>
              <button className="section-edit-btn" onClick={() => setShowEditModal(true)} title="Edit about">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
            <div className="about-content">{profile.about}</div>
          </div>

          <div className="profile-card profile-section-card">
            <div className="section-header">
              <h2 className="section-title">Experience</h2>
              <button className="section-edit-btn" onClick={() => openItemModal('experience')} title="Add experience">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <div id="experienceList">
              {experiences.length === 0 ? (
                <p className="muted">No experience added yet.</p>
              ) : (
                experiences.map(exp => (
                  <div key={exp.id} className="profile-item">
                    <div className="profile-item-content">
                      <strong>{exp.title}</strong>
                      <p>{exp.company}</p>
                      <p className="muted">{exp.startDate} - {exp.endDate}</p>
                      {exp.description && <p>{exp.description}</p>}
                    </div>
                    <button className="item-delete-btn" onClick={() => deleteItem('experience', exp.id)}>
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="profile-card profile-section-card">
            <div className="section-header">
              <h2 className="section-title">Education</h2>
              <button className="section-edit-btn" onClick={() => openItemModal('education')} title="Add education">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <div id="educationList">
              {education.length === 0 ? (
                <p className="muted">No education added yet.</p>
              ) : (
                education.map(edu => (
                  <div key={edu.id} className="profile-item">
                    <div className="profile-item-content">
                      <strong>{edu.school}</strong>
                      <p>{edu.degree} in {edu.field}</p>
                      <p className="muted">{edu.startYear} - {edu.endYear}</p>
                    </div>
                    <button className="item-delete-btn" onClick={() => deleteItem('education', edu.id)}>
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="profile-card profile-section-card">
            <div className="section-header">
              <h2 className="section-title">Skills</h2>
              <button className="section-edit-btn" onClick={() => openItemModal('skill')} title="Add skill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <div className="skills-grid">
              {skills.length === 0 ? (
                <p className="muted">No skills added yet.</p>
              ) : (
                skills.map(skill => (
                  <div key={skill.id} className="skill-badge">
                    <span>{skill.name}</span>
                    <button className="skill-delete-btn" onClick={() => deleteItem('skill', skill.id)}>×</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="profile-modal">
          <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditProfile}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="editName">Full Name *</label>
                  <input type="text" className="form-input" id="editName" name="editName" required defaultValue={profile.name} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="editHeadline">Headline *</label>
                  <input type="text" className="form-input" id="editHeadline" name="editHeadline" required defaultValue={profile.headline} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="editLocation">Location</label>
                  <input type="text" className="form-input" id="editLocation" name="editLocation" defaultValue={profile.location} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="editAboutText">About</label>
                  <textarea className="form-textarea" id="editAboutText" name="editAboutText" rows="5" defaultValue={profile.about}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="editAvatarColor">Profile Color</label>
                  <input type="color" className="form-color-input" id="editAvatarColor" name="editAvatarColor" defaultValue={profile.color} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="profile-btn profile-btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="profile-btn profile-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="profile-modal">
          <div className="modal-backdrop" onClick={() => setShowItemModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add {itemModalType === 'experience' ? 'Experience' : itemModalType === 'education' ? 'Education' : 'Skill'}</h3>
              <button className="modal-close" onClick={() => setShowItemModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={addItem}>
              <div className="modal-body">
                {itemModalType === 'experience' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input type="text" className="form-input" name="title" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company *</label>
                      <input type="text" className="form-input" name="company" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Start Date *</label>
                      <input type="text" className="form-input" name="startDate" required placeholder="e.g., Jan 2023" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input type="text" className="form-input" name="endDate" placeholder="Leave empty for current" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-textarea" name="description" rows="4"></textarea>
                    </div>
                  </>
                )}
                {itemModalType === 'education' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">School *</label>
                      <input type="text" className="form-input" name="school" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Degree *</label>
                      <input type="text" className="form-input" name="degree" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Field of Study *</label>
                      <input type="text" className="form-input" name="field" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Start Year *</label>
                      <input type="text" className="form-input" name="startYear" required placeholder="e.g., 2020" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Year</label>
                      <input type="text" className="form-input" name="endYear" placeholder="Leave empty for current" />
                    </div>
                  </>
                )}
                {itemModalType === 'skill' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Skill Name *</label>
                      <input type="text" className="form-input" name="skillName" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Level</label>
                      <select className="form-input" name="skillLevel">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="profile-btn profile-btn-secondary" onClick={() => setShowItemModal(false)}>Cancel</button>
                <button type="submit" className="profile-btn profile-btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCropperModal && (
        <div className="profile-modal">
          <div className="modal-backdrop" onClick={() => setShowCropperModal(false)}></div>
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Crop Image</h3>
              <button className="modal-close" onClick={() => setShowCropperModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <div style={{ maxHeight: '500px', overflow: 'hidden' }}>
                <Cropper
                  ref={cropperRef}
                  src={currentImage}
                  style={{ height: 400, width: '100%' }}
                  aspectRatio={cropperType === 'banner' ? 3 / 1 : 1}
                  guides={true}
                  viewMode={1}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="profile-btn profile-btn-secondary" onClick={() => setShowCropperModal(false)}>Cancel</button>
              <button type="button" className="profile-btn profile-btn-primary" onClick={handleCrop}>Apply</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer muted">
        <div>© {new Date().getFullYear()} LinkUp • A simple demo (not affiliated).</div>
      </footer>
    </>
  );
}

export default Profile;
