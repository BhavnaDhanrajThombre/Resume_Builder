
// Global variables
let currentSection = 'personal';
let resumeData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    setupEventListeners();
    loadSampleData();
    updatePreview();
});

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Event listeners setup
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Tab navigation
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', () => switchSection(tab.dataset.section));
    });

    // Form inputs for live preview
    document.addEventListener('input', debounce(updatePreview, 300));
    document.addEventListener('change', updatePreview);

    // File upload
    document.getElementById('photo').addEventListener('change', handlePhotoUpload);

    // Save/Load/Download buttons
    document.getElementById('saveBtn').addEventListener('click', saveResume);
    document.getElementById('loadBtn').addEventListener('click', loadResume);
    document.getElementById('downloadBtn').addEventListener('click', downloadPDF);

    // Remove buttons for dynamic sections
    document.addEventListener('click', function (e) {
        if (e.target.closest('.remove-btn')) {
            removeSection(e.target.closest('.remove-btn'));
        }
    });
}

// Load sample data
function loadSampleData() {
    const sampleData = {
        fullName: 'John Doe',
        jobTitle: 'Senior Software Developer',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://linkedin.com/in/johndoe',
        professionalSummary: 'Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and leading development teams.'
    };

    Object.keys(sampleData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = sampleData[key];
        }
    });
}

// Section switching
function switchSection(sectionName) {
    // Update active tab
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update active section
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');

    currentSection = sectionName;
}

// Photo upload handler
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previewPhoto').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update preview
function updatePreview() {
    updatePersonalInfo();
    updateSummary();
    updateExperience();
    updateEducation();
    updateSkills();
    updateProjects();
}

function updatePersonalInfo() {
    const name = document.getElementById('fullName').value || 'Your Name';
    const title = document.getElementById('jobTitle').value || 'Your Job Title';
    const email = document.getElementById('email').value || 'your.email@example.com';
    const phone = document.getElementById('phone').value || '+1 (555) 123-4567';
    const location = document.getElementById('location').value || 'Your Location';
    const website = document.getElementById('website').value || 'yourwebsite.com';

    document.getElementById('previewName').textContent = name;
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewEmail').textContent = email;
    document.getElementById('previewPhone').textContent = phone;
    document.getElementById('previewLocation').textContent = location;

    const websiteElement = document.getElementById('previewWebsite');
    if (website && website !== 'yourwebsite.com') {
        websiteElement.textContent = website.replace(/^https?:\/\//, '');
        websiteElement.style.display = 'block';
    } else {
        websiteElement.style.display = 'none';
    }
}

function updateSummary() {
    const summary = document.getElementById('professionalSummary').value;
    const summarySection = document.getElementById('summarySection');
    const previewSummary = document.getElementById('previewSummary');

    if (summary.trim()) {
        previewSummary.textContent = summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
}

function updateExperience() {
    const experienceContainer = document.getElementById('previewExperience');
    const experienceSection = document.getElementById('experienceSection');
    const experiences = document.querySelectorAll('#experienceContainer .dynamic-section');

    experienceContainer.innerHTML = '';

    if (experiences.length === 0) {
        experienceSection.style.display = 'none';
        return;
    }

    let hasContent = false;
    experiences.forEach(exp => {
        const title = exp.querySelector('.experience-title').value;
        const company = exp.querySelector('.experience-company').value;
        const duration = exp.querySelector('.experience-duration').value;
        const description = exp.querySelector('.experience-description').value;

        if (title || company || duration || description) {
            hasContent = true;
            const expElement = document.createElement('div');
            expElement.className = 'resume-item fade-in';
            expElement.innerHTML = `
                        <h4>${title || 'Job Title'}</h4>
                        <div class="meta">${company || 'Company'} | ${duration || 'Duration'}</div>
                        <p>${description || 'Job description...'}</p>
                    `;
            experienceContainer.appendChild(expElement);
        }
    });

    experienceSection.style.display = hasContent ? 'block' : 'none';
}

function updateEducation() {
    const educationContainer = document.getElementById('previewEducation');
    const educationSection = document.getElementById('educationSection');
    const educations = document.querySelectorAll('#educationContainer .dynamic-section');

    educationContainer.innerHTML = '';

    if (educations.length === 0) {
        educationSection.style.display = 'none';
        return;
    }

    let hasContent = false;
    educations.forEach(edu => {
        const degree = edu.querySelector('.education-degree').value;
        const institution = edu.querySelector('.education-institution').value;
        const year = edu.querySelector('.education-year').value;
        const info = edu.querySelector('.education-info').value;

        if (degree || institution || year || info) {
            hasContent = true;
            const eduElement = document.createElement('div');
            eduElement.className = 'resume-item fade-in';
            eduElement.innerHTML = `
                        <h4>${degree || 'Degree'}</h4>
                        <div class="meta">${institution || 'Institution'} | ${year || 'Year'}</div>
                        ${info ? `<p>${info}</p>` : ''}
                    `;
            educationContainer.appendChild(eduElement);
        }
    });

    educationSection.style.display = hasContent ? 'block' : 'none';
}

function updateSkills() {
    const skillsContainer = document.getElementById('previewSkills');
    const skillsSection = document.getElementById('skillsSection');
    const skills = document.querySelectorAll('#skillsContainer .dynamic-section');

    skillsContainer.innerHTML = '';

    if (skills.length === 0) {
        skillsSection.style.display = 'none';
        return;
    }

    let hasContent = false;
    skills.forEach(skill => {
        const skillName = skill.querySelector('.skill-name').value;

        if (skillName.trim()) {
            hasContent = true;
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item fade-in';
            skillElement.textContent = skillName;
            skillsContainer.appendChild(skillElement);
        }
    });

    skillsSection.style.display = hasContent ? 'block' : 'none';
}

function updateProjects() {
    const projectsContainer = document.getElementById('previewProjects');
    const projectsSection = document.getElementById('projectsSection');
    const projects = document.querySelectorAll('#projectsContainer .dynamic-section');

    projectsContainer.innerHTML = '';

    if (projects.length === 0) {
        projectsSection.style.display = 'none';
        return;
    }

    let hasContent = false;
    projects.forEach(proj => {
        const name = proj.querySelector('.project-name').value;
        const tech = proj.querySelector('.project-tech').value;
        const description = proj.querySelector('.project-description').value;
        const link = proj.querySelector('.project-link').value;

        if (name || tech || description || link) {
            hasContent = true;
            const projElement = document.createElement('div');
            projElement.className = 'resume-item fade-in';
            projElement.innerHTML = `
                        <h4>${name || 'Project Name'}</h4>
                        <div class="meta">${tech || 'Technologies used'}</div>
                        <p>${description || 'Project description...'}</p>
                        ${link ? `<p><a href="${link}" target="_blank" style="color: #3b82f6;">${link}</a></p>` : ''}
                    `;
            projectsContainer.appendChild(projElement);
        }
    });

    projectsSection.style.display = hasContent ? 'block' : 'none';
}

// Dynamic section management
function addExperience() {
    const container = document.getElementById('experienceContainer');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section fade-in';
    newSection.innerHTML = `
                <button type="button" class="remove-btn" onclick="removeSection(this)">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="form-input experience-title" placeholder="Software Developer">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="form-input experience-company" placeholder="Tech Corp">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" class="form-input experience-duration" placeholder="Jan 2020 - Present">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-textarea experience-description" placeholder="Describe your responsibilities and achievements..."></textarea>
                </div>
            `;
    container.appendChild(newSection);
    updatePreview();
}

function addEducation() {
    const container = document.getElementById('educationContainer');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section fade-in';
    newSection.innerHTML = `
                <button type="button" class="remove-btn" onclick="removeSection(this)">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" class="form-input education-degree" placeholder="Bachelor of Science">
                </div>
                <div class="form-group">
                    <label>Institution</label>
                    <input type="text" class="form-input education-institution" placeholder="University Name">
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" class="form-input education-year" placeholder="2018 - 2022">
                </div>
                <div class="form-group">
                    <label>Additional Info</label>
                    <textarea class="form-textarea education-info" placeholder="GPA, honors, relevant coursework..."></textarea>
                </div>
            `;
    container.appendChild(newSection);
    updatePreview();
}

function addSkill() {
    const container = document.getElementById('skillsContainer');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section fade-in';
    newSection.innerHTML = `
                <button type="button" class="remove-btn" onclick="removeSection(this)">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-group">
                    <label>Skill</label>
                    <input type="text" class="form-input skill-name" placeholder="JavaScript">
                </div>
            `;
    container.appendChild(newSection);
    updatePreview();
}

function addProject() {
    const container = document.getElementById('projectsContainer');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section fade-in';
    newSection.innerHTML = `
                <button type="button" class="remove-btn" onclick="removeSection(this)">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" class="form-input project-name" placeholder="E-commerce Website">
                </div>
                <div class="form-group">
                    <label>Technologies</label>
                    <input type="text" class="form-input project-tech" placeholder="React, Node.js, MongoDB">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-textarea project-description" placeholder="Describe the project and your role..."></textarea>
                </div>
                <div class="form-group">
                    <label>Link (optional)</label>
                    <input type="url" class="form-input project-link" placeholder="https://github.com/username/project">
                </div>
            `;
    container.appendChild(newSection);
    updatePreview();
}

function removeSection(button) {
    const section = button.closest('.dynamic-section');
    section.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        section.remove();
        updatePreview();
    }, 300);
}

// Save/Load functionality
function saveResume() {
    const resumeData = collectResumeData();
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    showNotification('Resume saved successfully!', 'success');
}

function loadResume() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        const resumeData = JSON.parse(savedData);
        populateForm(resumeData);
        updatePreview();
        showNotification('Resume loaded successfully!', 'success');
    } else {
        showNotification('No saved resume found!', 'error');
    }
}

function collectResumeData() {
    const data = {
        personal: {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            website: document.getElementById('website').value,
            photo: document.getElementById('previewPhoto').src
        },
        summary: document.getElementById('professionalSummary').value,
        experience: [],
        education: [],
        skills: [],
        projects: []
    };

    // Collect experience data
    document.querySelectorAll('#experienceContainer .dynamic-section').forEach(section => {
        data.experience.push({
            title: section.querySelector('.experience-title').value,
            company: section.querySelector('.experience-company').value,
            duration: section.querySelector('.experience-duration').value,
            description: section.querySelector('.experience-description').value
        });
    });

    // Collect education data
    document.querySelectorAll('#educationContainer .dynamic-section').forEach(section => {
        data.education.push({
            degree: section.querySelector('.education-degree').value,
            institution: section.querySelector('.education-institution').value,
            year: section.querySelector('.education-year').value,
            info: section.querySelector('.education-info').value
        });
    });

    // Collect skills data
    document.querySelectorAll('#skillsContainer .dynamic-section').forEach(section => {
        const skillName = section.querySelector('.skill-name').value;
        if (skillName.trim()) {
            data.skills.push(skillName);
        }
    });

    // Collect projects data
    document.querySelectorAll('#projectsContainer .dynamic-section').forEach(section => {
        data.projects.push({
            name: section.querySelector('.project-name').value,
            tech: section.querySelector('.project-tech').value,
            description: section.querySelector('.project-description').value,
            link: section.querySelector('.project-link').value
        });
    });

    return data;
}

function populateForm(data) {
    // Populate personal info
    if (data.personal) {
        Object.keys(data.personal).forEach(key => {
            const element = document.getElementById(key);
            if (element && key !== 'photo') {
                element.value = data.personal[key] || '';
            }
        });

        if (data.personal.photo) {
            document.getElementById('previewPhoto').src = data.personal.photo;
        }
    }

    // Populate summary
    if (data.summary) {
        document.getElementById('professionalSummary').value = data.summary;
    }

    // Clear and populate experience
    const expContainer = document.getElementById('experienceContainer');
    expContainer.innerHTML = '';
    if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
            addExperience();
            const lastSection = expContainer.lastElementChild;
            lastSection.querySelector('.experience-title').value = exp.title || '';
            lastSection.querySelector('.experience-company').value = exp.company || '';
            lastSection.querySelector('.experience-duration').value = exp.duration || '';
            lastSection.querySelector('.experience-description').value = exp.description || '';
        });
    } else {
        addExperience();
    }

    // Clear and populate education
    const eduContainer = document.getElementById('educationContainer');
    eduContainer.innerHTML = '';
    if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
            addEducation();
            const lastSection = eduContainer.lastElementChild;
            lastSection.querySelector('.education-degree').value = edu.degree || '';
            lastSection.querySelector('.education-institution').value = edu.institution || '';
            lastSection.querySelector('.education-year').value = edu.year || '';
            lastSection.querySelector('.education-info').value = edu.info || '';
        });
    } else {
        addEducation();
    }

    // Clear and populate skills
    const skillsContainer = document.getElementById('skillsContainer');
    skillsContainer.innerHTML = '';
    if (data.skills && data.skills.length > 0) {
        data.skills.forEach(skill => {
            addSkill();
            const lastSection = skillsContainer.lastElementChild;
            lastSection.querySelector('.skill-name').value = skill;
        });
    } else {
        addSkill();
    }

    // Clear and populate projects
    const projectsContainer = document.getElementById('projectsContainer');
    projectsContainer.innerHTML = '';
    if (data.projects && data.projects.length > 0) {
        data.projects.forEach(project => {
            addProject();
            const lastSection = projectsContainer.lastElementChild;
            lastSection.querySelector('.project-name').value = project.name || '';
            lastSection.querySelector('.project-tech').value = project.tech || '';
            lastSection.querySelector('.project-description').value = project.description || '';
            lastSection.querySelector('.project-link').value = project.link || '';
        });
    } else {
        addProject();
    }
}

// Download PDF functionality
function downloadPDF() {
    const originalTitle = document.title;
    document.title = (document.getElementById('fullName').value || 'Resume') + ' - Resume';

    setTimeout(() => {
        window.print();
        document.title = originalTitle;
    }, 100);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
                color: white;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                font-weight: 500;
            `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Additional CSS for notifications
const style = document.createElement('style');
style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-10px);
                }
            }
        `;
document.head.appendChild(style);

