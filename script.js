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

    // Create hero content with name and tagline in a separate div above the pills
    heroSection.innerHTML = `
        <div class="hero-content">
            <h1>${resumeData.basics.name}</h1>
            <p class="tagline">${resumeData.basics.label}</p>
        </div>
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
    facetsData.forEach(facet => {
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

    // Create a facet-info-list to match the structure of the facet sections
    const infoList = document.createElement('ul');
    infoList.className = 'facet-info-list';

    // Add basic info section
    const basicInfo = createBasicInfoSection();
    infoList.appendChild(basicInfo);

    // Add skills section
    const skills = createSkillsSection();
    infoList.appendChild(skills);

    // Add work history section based on template
    const workHistory = createWorkHistorySection(template);
    infoList.appendChild(workHistory);

    // Add education section
    const education = createEducationSection();
    infoList.appendChild(education);

    // Add the info list to the container
    contentContainer.appendChild(infoList);
}

/**
 * Create the basic info section
 * @returns {HTMLElement} The basic info section
 */
function createBasicInfoSection() {
    // Create a list item for the facet-info-list
    const infoItem = document.createElement('li');
    infoItem.className = 'info-item';

    // Create a heading for the section
    const heading = document.createElement('strong');
    heading.textContent = 'Personal Information';

    // Create a container for the personal info content
    const infoContent = document.createElement('div');
    infoContent.className = 'info-content';

    // Add contact information
    const contactDetails = document.createElement('p');
    contactDetails.innerHTML = `<strong>Contact:</strong> Email: ${resumeData.basics.email}, Phone: ${resumeData.basics.phone}, Location: ${resumeData.basics.location.city}, ${resumeData.basics.location.region}`;
    infoContent.appendChild(contactDetails);

    // Add professional summary
    const summaryContent = document.createElement('p');
    summaryContent.innerHTML = `<strong>Professional Summary:</strong> ${resumeData.basics.summary}`;
    infoContent.appendChild(summaryContent);

    // Assemble the info item
    infoItem.appendChild(heading);
    infoItem.appendChild(document.createTextNode(': '));
    infoItem.appendChild(infoContent);

    return infoItem;
}

/**
 * Create the skills section
 * @returns {HTMLElement} The skills section
 */
function createSkillsSection() {
    // Create a list item for the facet-info-list
    const infoItem = document.createElement('li');
    infoItem.className = 'info-item';

    // Create a heading for the section
    const heading = document.createElement('strong');
    heading.textContent = 'Skills';

    // Create a container for the skills content
    const skillsContent = document.createElement('div');
    skillsContent.className = 'info-content';

    // Add each skill group
    resumeData.skills.forEach(skill => {
        const skillGroup = document.createElement('p');
        skillGroup.innerHTML = `<strong>${skill.name}:</strong> ${skill.keywords.join(', ')}`;
        skillsContent.appendChild(skillGroup);
    });

    // Assemble the info item
    infoItem.appendChild(heading);
    infoItem.appendChild(document.createTextNode(': '));
    infoItem.appendChild(skillsContent);

    return infoItem;
}

/**
 * Create the work history section based on template configuration
 * @param {string} templateId - The template ID to use
 * @returns {HTMLElement} The work history section
 */
function createWorkHistorySection(templateId) {
    // Create a list item for the facet-info-list
    const infoItem = document.createElement('li');
    infoItem.className = 'info-item';

    // Create a heading for the section
    const heading = document.createElement('strong');
    heading.textContent = 'Work Experience';

    // Create a container for the work history content
    const workContent = document.createElement('div');
    workContent.className = 'info-content';

    // Get template configuration
    const templateConfig = templatesData[templateId];
    if (!templateConfig) {
        console.error(`Template configuration not found for: ${templateId}`);
        infoItem.appendChild(heading);
        infoItem.appendChild(document.createTextNode(': No template configuration found'));
        return infoItem;
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

    // Add each job
    workEntries.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'job-item';

        // Job title and company
        const jobTitle = document.createElement('p');
        jobTitle.className = 'job-title';
        if (job.position) {
            jobTitle.innerHTML = `<strong>${job.position} at ${job.name}</strong>`;
        } else {
            jobTitle.innerHTML = `<strong>${job.name}</strong>`;
        }
        jobDiv.appendChild(jobTitle);

        // Job period and location
        const jobDetails = document.createElement('p');
        jobDetails.className = 'job-details';
        jobDetails.innerHTML = `${job.startDate} to ${job.endDate || 'Present'} | ${job.location}`;
        jobDiv.appendChild(jobDetails);

        // Job summary
        const jobSummary = document.createElement('p');
        jobSummary.className = 'job-summary';
        jobSummary.textContent = job.summary;
        jobDiv.appendChild(jobSummary);

        // Add highlights if available
        if (job.highlights && job.highlights.length > 0) {
            const highlightsDiv = document.createElement('div');
            highlightsDiv.className = 'job-highlights';

            const highlightsHeading = document.createElement('p');
            highlightsHeading.innerHTML = '<strong>Highlights:</strong>';
            highlightsDiv.appendChild(highlightsHeading);

            const highlightsList = document.createElement('ul');
            highlightsList.className = 'highlights-list';

            job.highlights.forEach(highlight => {
                const highlightItem = document.createElement('li');
                highlightItem.textContent = highlight;
                highlightsList.appendChild(highlightItem);
            });

            highlightsDiv.appendChild(highlightsList);
            jobDiv.appendChild(highlightsDiv);
        }

        workContent.appendChild(jobDiv);

        // Add a separator between jobs
        if (workEntries.indexOf(job) < workEntries.length - 1) {
            const separator = document.createElement('hr');
            separator.className = 'job-separator';
            workContent.appendChild(separator);
        }
    });

    // Assemble the info item
    infoItem.appendChild(heading);
    infoItem.appendChild(document.createTextNode(': '));
    infoItem.appendChild(workContent);

    return infoItem;
}

/**
 * Create the education section
 * @returns {HTMLElement} The education section
 */
function createEducationSection() {
    // Create a list item for the facet-info-list
    const infoItem = document.createElement('li');
    infoItem.className = 'info-item';

    // Create a heading for the section
    const heading = document.createElement('strong');
    heading.textContent = 'Education';

    // Create a container for the education content
    const educationContent = document.createElement('div');
    educationContent.className = 'info-content';

    // Add each education entry
    resumeData.education.forEach(edu => {
        const eduDiv = document.createElement('div');
        eduDiv.className = 'education-item';

        // Degree and area
        const degree = document.createElement('p');
        degree.className = 'degree';
        degree.innerHTML = `<strong>${edu.studyType} in ${edu.area}</strong>`;
        eduDiv.appendChild(degree);

        // Institution and year
        const details = document.createElement('p');
        details.className = 'education-details';
        details.innerHTML = `${edu.institution} | Completed: ${edu.endDate}`;
        eduDiv.appendChild(details);

        educationContent.appendChild(eduDiv);

        // Add a separator between education entries
        if (resumeData.education.indexOf(edu) < resumeData.education.length - 1) {
            const separator = document.createElement('hr');
            separator.className = 'education-separator';
            educationContent.appendChild(separator);
        }
    });

    // Assemble the info item
    infoItem.appendChild(heading);
    infoItem.appendChild(document.createTextNode(': '));
    infoItem.appendChild(educationContent);

    return infoItem;
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
    facetsData.forEach(facet => {
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
