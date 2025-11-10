# LinkUp - Professional Social Network

A modern, LinkedIn-inspired social networking platform with a beautiful glassmorphic UI.

## Features

### Feed & Posts
- Create posts with text (up to 500 characters) and images
- Like posts with animated heart button
- Delete your own posts
- Real-time character counter
- Persistent data storage using localStorage

### Profile Management
- **Editable Profile**: Click on your avatar in the navigation bar to access your profile page
- **Profile Customization**:
  - Edit name, headline, location, and about section
  - Upload custom profile photo and cover image
  - Choose custom profile color
  - All changes saved automatically to localStorage

### Profile Sections
- **Experience**: Add, edit, and delete work experiences
  - Job title, company, duration, description
- **Education**: Manage your educational background
  - Degree, institution, duration, additional info
- **Skills**: Add and remove skills with tag-based interface
- **About**: Personal bio and introduction

### User Interface
- Modern glassmorphism design with gradient accents
- Smooth animations and hover effects
- Dark/Light theme toggle
- Fully responsive design
- Clean, professional layout

## Usage

### Accessing Your Profile
1. Click on your avatar/profile picture in the top navigation bar
2. You'll be redirected to `profile.html`

### Editing Profile Information
1. Click the "Edit Profile" button on your profile page
2. Update your information in the modal form
3. Click "Save Changes" - updates are immediate and persistent

### Managing Experience/Education
1. Click the "+" button in the respective section
2. Fill in the required information
3. Click "Add" to save
4. Hover over items to see delete button

### Adding Skills
1. Click the "+" button in the Skills section
2. Enter skill name
3. Click on the X icon on any skill tag to remove it

## Data Storage

All user data is stored in the browser's localStorage:
- `linkup_user_profile`: Profile information
- `linkup_experiences`: Work experience entries
- `linkup_education`: Education entries
- `linkup_skills`: Skills array
- `linkup.posts`: All posts
- `linkup.likes`: Liked post IDs
- `linkup.theme`: Theme preference

## Files

- `index.html`: Main feed page
- `profile.html`: Profile management page
- `app.js`: Main application logic
- `profile.js`: Profile page functionality
- `styles.css`: Complete styling for both pages

## Browser Support

Works on all modern browsers that support:
- ES6+ JavaScript
- CSS Grid & Flexbox
- localStorage API
- FileReader API (for image uploads)

## Getting Started

Simply open `index.html` in a web browser. No build process or server required!

---

Built with ❤️ using vanilla JavaScript, HTML, and CSS
