/**
 * Resume Site JavaScript
 * Phase I Implementation
 */

// Global state
let resumeData = null;
let facetsData = null;
let templatesData = null;
let currentTemplate = 'basic';
let currentFacet = null;

// DOM Elements
const templateSelector = document.getElementById('template-select');
const downloadRawButton = document.getElementById('download-json');
const downloadFilteredButton = document.getElementById('download-filtered-json');
const printButton = document.getElementById('print-btn');
const heroSection = document.getElementById('hero-section');
const contentSection = document.getElementById('content');

// Add debugging for DOM elements
console.log('DOM Elements loaded:');
console.log('templateSelector:', templateSelector);
console.log('heroSection:', heroSection);
console.log('contentSection:', contentSection);

/**
 * Initialize the application
 */
async function init() {
    try {
        console.log('Initializing resume site...');
        
        // Load JSON data
        console.log('Starting to load JSON data...');
        await Promise.all([loadResumeData(), loadFacetsData(), loadTemplatesData()]);
        
        // Verify data was loaded correctly
        console.log('Data loaded check:', {
            resumeData: resumeData ? 'Loaded' : 'Missing',
            facetsData: facetsData ? 'Loaded' : 'Missing',
            templatesData: templatesData ? 'Loaded' : 'Missing'
        });
        
        // Generate HTML structure from JSON data
        console.log('Generating hero section...');
        generateHeroSection();
        console.log('Generating facet sections...');
        generateFacetSections();
        console.log('Populating template selector...');
        populateTemplateSelector();

        // Set up event listeners
        setupEventListeners();

        // Overview is already active by default
        currentFacet = '#overview';
        
        console.log('Resume site initialized successfully');
    } catch (error) {
        console.error('Failed to initialize resume site:', error);
    }
}

/**
 * Load resume.json data
 */
async function loadResumeData() {
    try {
        const response = await fetch('resume.json');
        if (!response.ok) {
            throw new Error(`Failed to load resume data: ${response.status} ${response.statusText}`);
        }
        resumeData = await response.json();
        console.log('Resume data loaded successfully');
    } catch (error) {
        console.error('Error loading resume data:', error);
        throw error;
    }
}

/**
 * Load facets.json data
 */
async function loadFacetsData() {
    try {
        const response = await fetch('facets.json');
        if (!response.ok) {
            throw new Error(`Failed to load facets data: ${response.status} ${response.statusText}`);
        }
        facetsData = await response.json();
        console.log('Facets data loaded successfully');
    } catch (error) {
        console.error('Error loading facets data:', error);
        throw error;
    }
}

/**
 * Load templates.json data
 */
async function loadTemplatesData() {
    try {
        const response = await fetch('templates.json');
        if (!response.ok) {
            throw new Error(`Failed to load templates data: ${response.status} ${response.statusText}`);
        }
        templatesData = await response.json();
        console.log('Templates data loaded successfully');
    } catch (error) {
        console.error('Error loading templates data:', error);
        throw error;
    }
}

/**
 * Populate template selector dropdown from templates.json
 */
function populateTemplateSelector() {
    if (!templatesData) return;
    
    templateSelector.innerHTML = '';
    
    Object.values(templatesData).forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = template.label;
        option.title = template.description;
        templateSelector.appendChild(option);
    });
    
    // Set the default template
    templateSelector.value = currentTemplate;
}

/**
 * Generate hero section from JSON data
 */
function generateHeroSection() {
    if (!resumeData || !facetsData) return;
    
    // Create hero content
    heroSection.innerHTML = `
        <h1>${resumeData.basics.name}</h1>
        <p class="tagline">${resumeData.basics.label}</p>
        <nav class="facets">
            <ul>
                ${facetsData.map((facet) => `
                    <li><a href="${facet.targetSelector}" 
                          ${facet.title === "Overview" ? 'class="active"' : ''} 
                          aria-label="${facet.ariaLabel}">
                        <span class="icon ${facet.icon}"></span>${facet.title}
                    </a></li>
                `).join('')}
            </ul>
        </nav>
    `;
}

/**
 * Generate facet sections from JSON data
 */
function generateFacetSections() {
    if (!resumeData || !facetsData) return;

    // Clear existing content
    contentSection.innerHTML = '';

    // Create all facet sections
    facetsData.forEach((facet, index) => {
        const section = document.createElement('section');
        
        // Set ID based on facet targetSelector (without the # symbol)
        const targetId = facet.targetSelector.substring(1); // Remove the # from the targetSelector
        section.id = targetId;
        section.className = 'facet-section';
        
        // Make the Overview section active by default
        if (facet.title === "Overview") {
            section.classList.add('active');
        }

        // Create heading
        const heading = document.createElement('h2');
        heading.textContent = facet.title;
        section.appendChild(heading);

        // Create facet info list directly (removing the facet-summary container)
        const facetList = document.createElement('ul');
        facetList.className = 'facet-info-list';

        // Add objective
        const objectiveItem = document.createElement('li');
        objectiveItem.className = 'info-item'; // Changed to match personal-info structure
        
        const objectiveTitle = document.createElement('strong');
        objectiveTitle.textContent = 'Career Objective';
        
        const objectiveText = document.createElement('span');
        objectiveText.textContent = `: ${facet.objective}`;
        
        objectiveItem.appendChild(objectiveTitle);
        objectiveItem.appendChild(objectiveText);
        facetList.appendChild(objectiveItem);

        // Add description
        const descriptionItem = document.createElement('li');
        descriptionItem.className = 'info-item'; // Changed to match personal-info structure
        
        const descriptionTitle = document.createElement('strong');
        descriptionTitle.textContent = 'Industry Impact';
        
        const descriptionText = document.createElement('span');
        descriptionText.textContent = `: ${facet.description || 'No description available.'}`;
        
        descriptionItem.appendChild(descriptionTitle);
        descriptionItem.appendChild(descriptionText);
        facetList.appendChild(descriptionItem);

        // Add my experience
        const experienceItem = document.createElement('li');
        experienceItem.className = 'info-item'; // Changed to match personal-info structure
        
        const experienceTitle = document.createElement('strong');
        experienceTitle.textContent = 'My Experience';
        
        const experienceText = document.createElement('span');
        experienceText.textContent = `: ${facet.myRole || 'No experience information available.'}`;
        
        experienceItem.appendChild(experienceTitle);
        experienceItem.appendChild(experienceText);
        facetList.appendChild(experienceItem);

        section.appendChild(facetList);

        // Add resume content container
        const resumeContent = document.createElement('div');
        resumeContent.className = 'resume-content';
        section.appendChild(resumeContent);

        contentSection.appendChild(section);
    });
    
    // Set current facet to Overview
    currentFacet = '#overview';
    
    // Render resume content for the overview section
    renderResumeContent(currentFacet, currentTemplate);
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Facet navigation
    const facetLinks = document.querySelectorAll('.facets a');
    facetLinks.forEach(link => {
        // Remove any existing event listeners to prevent duplicates
        link.removeEventListener('click', handleFacetClick);
        // Add the event listener
        link.addEventListener('click', handleFacetClick);
    });

    // Template switching
    templateSelector.addEventListener('change', handleTemplateChange);

    // Download buttons
    downloadRawButton.addEventListener('click', handleDownloadRawClick);
    downloadFilteredButton.addEventListener('click', handleDownloadFilteredClick);

    // Print button
    printButton.addEventListener('click', handlePrintClick);
    
    console.log('Event listeners set up, found', facetLinks.length, 'facet links');
}

/**
 * Handle facet navigation click
 * @param {Event} event - Click event
 */
function handleFacetClick(event) {
    event.preventDefault();
    
    // Get the target section ID from the href attribute
    const targetSelector = event.currentTarget.getAttribute('href');
    console.log('Facet clicked:', targetSelector);
    
    if (!targetSelector) {
        console.error('No target selector found in href attribute');
        return;
    }
    
    // Remove the # from the beginning of the selector
    const targetId = targetSelector.substring(1);
    const targetSection = document.getElementById(targetId);

    if (!targetSection) {
        console.error('Target section not found:', targetId);
        return;
    }

    // Update active state for navigation links
    const facetLinks = document.querySelectorAll('.facets a');
    facetLinks.forEach(link => {
        link.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Hide all facet sections
    const facetSections = document.querySelectorAll('.facet-section');
    facetSections.forEach(section => {
        section.classList.remove('active');
    });

    // Show the target section
    targetSection.classList.add('active');
    currentFacet = targetSelector;

    // Render resume content for this facet with current template
    renderResumeContent(currentFacet, currentTemplate);
    
    console.log('Navigation complete, current facet:', currentFacet);
}

/**
 * Handle template change
 * @param {Event} event - Change event
 */
function handleTemplateChange(event) {
    currentTemplate = event.target.value;

    // Re-render current facet with new template
    if (currentFacet) {
        renderResumeContent(currentFacet, currentTemplate);
    }
}

/**
 * Handle raw JSON download button click
 */
function handleDownloadRawClick() {
    if (!resumeData) {
        console.error('Resume data not loaded');
        return;
    }

    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });

    // Create a temporary download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume-raw.json';

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Handle filtered JSON download button click
 */
function handleDownloadFilteredClick() {
    if (!resumeData || !templatesData) {
        console.error('Resume or template data not loaded');
        return;
    }

    // Get current template configuration
    const templateConfig = templatesData[currentTemplate];
    if (!templateConfig) {
        console.error(`Template configuration not found for: ${currentTemplate}`);
        return;
    }

    // Create a filtered copy of the resume data
    const filteredData = JSON.parse(JSON.stringify(resumeData));
    
    // Apply template filters to work history
    if (filteredData.work && templateConfig.filters.work) {
        const filters = templateConfig.filters.work;
        let workEntries = [...filteredData.work];
        
        // Apply year filter if specified
        if (filters.yearsBack) {
            const cutoffDate = new Date();
            cutoffDate.setFullYear(cutoffDate.getFullYear() - filters.yearsBack);
            
            workEntries = workEntries.filter(job => {
                const endDate = job.endDate ? new Date(job.endDate) : new Date();
                return endDate >= cutoffDate;
            });
        }

        // Apply summary inclusion/exclusion filters
        if (filters.includeIsSummary) {
            // Add back any summary items that might have been filtered by date
            const summaryItems = filteredData.work.filter(job => job.isSummary);
            workEntries = [...new Set([...workEntries, ...summaryItems])];
        }
        
        if (filters.excludeIsSummary) {
            workEntries = workEntries.filter(job => !job.isSummary);
        }
        
        // Update the work array in the filtered data
        filteredData.work = workEntries;
    }

    // Create a Blob with the filtered JSON data
    const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });

    // Create a temporary download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${currentTemplate}.json`;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Handle print button click
 */
function handlePrintClick() {
    window.print();
}

/**
 * Render resume content based on facet and template
 * @param {string} facetId - The ID of the facet section
 * @param {string} template - The template to use
 */
function renderResumeContent(facetId, template) {
    if (!resumeData || !facetsData) {
        console.error('Data not loaded');
        return;
    }

    // Find the content container for this facet
    const contentContainer = document.querySelector(`${facetId} .resume-content`);
    if (!contentContainer) return;

    // Clear existing content
    contentContainer.innerHTML = '';

    // Create resume content based on template
    const content = document.createElement('div');

    // Add basic info section
    const basicInfo = createBasicInfoSection();
    content.appendChild(basicInfo);

    // Add skills section
    const skills = createSkillsSection();
    content.appendChild(skills);

    // Add work history section based on template
    const workHistory = createWorkHistorySection(template);
    content.appendChild(workHistory);

    // Add education section
    const education = createEducationSection();
    content.appendChild(education);

    // Add the content to the container
    contentContainer.appendChild(content);
}

/**
 * Create the basic info section
 * @returns {HTMLElement} The basic info section
 */
function createBasicInfoSection() {
    const section = document.createElement('section');
    section.className = 'basic-info';

    const heading = document.createElement('h3');
    heading.textContent = 'Personal Information';
    section.appendChild(heading);

    // Create a list for personal info items
    const infoList = document.createElement('ul');
    infoList.className = 'personal-info-list';

    // Add contact information
    const contactItem = document.createElement('li');
    contactItem.className = 'info-item';
    
    const contactTitle = document.createElement('strong');
    contactTitle.textContent = 'Contact Details';
    
    const contactDetails = document.createElement('span');
    contactDetails.innerHTML = `: Email: ${resumeData.basics.email}, Phone: ${resumeData.basics.phone}, Location: ${resumeData.basics.location.city}, ${resumeData.basics.location.region}`;
    
    contactItem.appendChild(contactTitle);
    contactItem.appendChild(contactDetails);
    infoList.appendChild(contactItem);

    // Add professional summary
    const summaryItem = document.createElement('li');
    summaryItem.className = 'info-item';
    
    const summaryTitle = document.createElement('strong');
    summaryTitle.textContent = 'Professional Summary';
    
    const summaryContent = document.createElement('span');
    summaryContent.textContent = `: ${resumeData.basics.summary}`;
    
    summaryItem.appendChild(summaryTitle);
    summaryItem.appendChild(summaryContent);
    infoList.appendChild(summaryItem);

    section.appendChild(infoList);
    return section;
}

/**
 * Create the skills section
 * @returns {HTMLElement} The skills section
 */
function createSkillsSection() {
    const section = document.createElement('section');
    section.className = 'skills';

    const heading = document.createElement('h3');
    heading.textContent = 'Skills';
    section.appendChild(heading);

    const skillsList = document.createElement('ul');

    resumeData.skills.forEach(skill => {
        const skillItem = document.createElement('li');

        const skillName = document.createElement('strong');
        skillName.textContent = skill.name;

        const skillKeywords = document.createElement('span');
        skillKeywords.textContent = `: ${skill.keywords.join(', ')}`;

        skillItem.appendChild(skillName);
        skillItem.appendChild(skillKeywords);
        skillsList.appendChild(skillItem);
    });

    section.appendChild(skillsList);

    return section;
}

/**
 * Create the work history section based on template configuration
 * @param {string} templateId - The template ID to use
 * @returns {HTMLElement} The work history section
 */
function createWorkHistorySection(templateId) {
    const section = document.createElement('section');
    section.className = 'work-history';

    const heading = document.createElement('h3');
    heading.textContent = 'Work Experience';
    section.appendChild(heading);

    // Get template configuration
    const templateConfig = templatesData[templateId];
    if (!templateConfig) {
        console.error(`Template configuration not found for: ${templateId}`);
        return section;
    }

    // Filter work history based on template configuration
    let workEntries = [...resumeData.work];
    const filters = templateConfig.filters.work;

    // Apply year filter if specified
    if (filters.yearsBack) {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - filters.yearsBack);
        
        workEntries = workEntries.filter(job => {
            const endDate = job.endDate ? new Date(job.endDate) : new Date();
            return endDate >= cutoffDate;
        });
    }

    // Apply summary inclusion/exclusion filters
    if (filters.includeIsSummary) {
        // Add back any summary items that might have been filtered by date
        const summaryItems = resumeData.work.filter(job => job.isSummary);
        workEntries = [...new Set([...workEntries, ...summaryItems])];
    }
    
    if (filters.excludeIsSummary) {
        workEntries = workEntries.filter(job => !job.isSummary);
    }

    const workList = document.createElement('ul');

    workEntries.forEach(job => {
        const jobItem = document.createElement('li');
        jobItem.className = 'job';

        const jobHeader = document.createElement('div');
        jobHeader.className = 'job-header';

        const jobTitle = document.createElement('h4');
        // Handle cases where position might not exist
        if (job.position) {
            jobTitle.textContent = `${job.position} at ${job.name}`;
        } else {
            jobTitle.textContent = job.name;
        }

        const jobPeriod = document.createElement('div');
        jobPeriod.className = 'job-period';
        jobPeriod.textContent = `${job.startDate} to ${job.endDate || 'Present'}`;

        const jobLocation = document.createElement('div');
        jobLocation.className = 'job-location';
        jobLocation.textContent = job.location;

        const jobSummary = document.createElement('p');
        jobSummary.className = 'job-summary';
        jobSummary.textContent = job.summary;

        jobHeader.appendChild(jobTitle);
        jobHeader.appendChild(jobPeriod);
        jobHeader.appendChild(jobLocation);

        jobItem.appendChild(jobHeader);
        jobItem.appendChild(jobSummary);

        // Add highlights if available
        if (job.highlights && job.highlights.length > 0) {
            const highlightsHeading = document.createElement('h5');
            highlightsHeading.textContent = 'Highlights:';
            jobItem.appendChild(highlightsHeading);

            const highlightsList = document.createElement('ul');
            highlightsList.className = 'highlights';

            job.highlights.forEach(highlight => {
                const highlightItem = document.createElement('li');
                highlightItem.textContent = highlight;
                highlightsList.appendChild(highlightItem);
            });

            jobItem.appendChild(highlightsList);
        }

        workList.appendChild(jobItem);
    });

    section.appendChild(workList);

    return section;
}

/**
 * Create the education section
 * @returns {HTMLElement} The education section
 */
function createEducationSection() {
    const section = document.createElement('section');
    section.className = 'education';

    const heading = document.createElement('h3');
    heading.textContent = 'Education';
    section.appendChild(heading);

    const educationList = document.createElement('ul');

    resumeData.education.forEach(edu => {
        const eduItem = document.createElement('li');

        const degree = document.createElement('div');
        degree.className = 'degree';
        degree.innerHTML = `<strong>${edu.studyType}</strong> in ${edu.area}`;

        const institution = document.createElement('div');
        institution.className = 'institution';
        institution.textContent = edu.institution;

        const year = document.createElement('div');
        year.className = 'year';
        year.textContent = `Completed: ${edu.endDate}`;

        eduItem.appendChild(degree);
        eduItem.appendChild(institution);
        eduItem.appendChild(year);

        educationList.appendChild(eduItem);
    });

    section.appendChild(educationList);

    return section;
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Try to initialize normally first
    init();
    
    // If content is still empty after a short delay, try rebuilding
    setTimeout(function() {
        if (contentSection.innerHTML.trim() === '') {
            console.log('Content section is empty, attempting rebuild...');
            rebuildContentArea();
        }
    }, 1000);
});

/**
 * Rebuild the main content area
 */
function rebuildContentArea() {
    console.log('Attempting to rebuild content area...');
    
    // Check if we have the necessary data
    if (!resumeData) {
        console.error('Resume data not loaded');
        return;
    }
    
    if (!facetsData) {
        console.error('Facets data not loaded');
        return;
    }
    
    if (!templatesData) {
        console.error('Templates data not loaded');
        return;
    }
    
    // Clear existing content
    contentSection.innerHTML = '';
    
    console.log('Creating facet sections...');
    
    // Create facet sections based on facetsData
    facetsData.forEach((facet, index) => {
        // Create section element
        const section = document.createElement('section');
        
        // Use the title as ID if targetSelector is missing
        const targetId = facet.targetSelector ? 
            facet.targetSelector.substring(1) : 
            facet.title.toLowerCase().replace(/\s+/g, '-');
            
        section.id = targetId;
        section.className = 'facet-section';
        
        // Make Overview active by default
        if (facet.title === "Overview") {
            section.classList.add('active');
            currentFacet = `#${targetId}`;
        }
        
        // Create heading
        const heading = document.createElement('h2');
        heading.textContent = facet.title;
        section.appendChild(heading);
        
        // Create facet info list
        const facetList = document.createElement('ul');
        facetList.className = 'facet-info-list';
        
        // Add objective if available
        if (facet.objective) {
            const objectiveItem = document.createElement('li');
            objectiveItem.className = 'info-item';
            
            const objectiveTitle = document.createElement('strong');
            objectiveTitle.textContent = 'Career Objective';
            
            const objectiveText = document.createElement('span');
            objectiveText.textContent = `: ${facet.objective}`;
            
            objectiveItem.appendChild(objectiveTitle);
            objectiveItem.appendChild(objectiveText);
            facetList.appendChild(objectiveItem);
        }
        
        // Add description if available
        if (facet.description) {
            const descriptionItem = document.createElement('li');
            descriptionItem.className = 'info-item';
            
            const descriptionTitle = document.createElement('strong');
            descriptionTitle.textContent = 'Industry Impact';
            
            const descriptionText = document.createElement('span');
            descriptionText.textContent = `: ${facet.description}`;
            
            descriptionItem.appendChild(descriptionTitle);
            descriptionItem.appendChild(descriptionText);
            facetList.appendChild(descriptionItem);
        }
        
        // Add my experience if available
        if (facet.myRole) {
            const experienceItem = document.createElement('li');
            experienceItem.className = 'info-item';
            
            const experienceTitle = document.createElement('strong');
            experienceTitle.textContent = 'My Experience';
            
            const experienceText = document.createElement('span');
            experienceText.textContent = `: ${facet.myRole}`;
            
            experienceItem.appendChild(experienceTitle);
            experienceItem.appendChild(experienceText);
            facetList.appendChild(experienceItem);
        }
        
        section.appendChild(facetList);
        
        // Add resume content container
        const resumeContent = document.createElement('div');
        resumeContent.className = 'resume-content';
        section.appendChild(resumeContent);
        
        contentSection.appendChild(section);
    });
    
    // Render resume content for the active facet
    if (currentFacet) {
        renderResumeContent(currentFacet, currentTemplate);
    }
    
    // Rebuild hero section
    generateHeroSection();
    
    // Rebuild template selector
    populateTemplateSelector();
    
    // Set up event listeners again
    setupEventListeners();
    
    console.log('Content area rebuilt successfully');
}
