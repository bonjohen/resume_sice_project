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
        option.title = template.description; // This adds the hover text
        option.setAttribute('data-description', template.description); // Additional attribute for custom tooltip
        templateSelector.appendChild(option);
    });

    // Set the default template
    templateSelector.value = currentTemplate;

    // Create a custom tooltip element for better hover experience
    const tooltip = document.createElement('div');
    tooltip.className = 'template-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // Add event listeners for custom tooltip
    templateSelector.addEventListener('mouseover', function(e) {
        if (e.target.tagName === 'OPTION') {
            const description = e.target.getAttribute('data-description');
            if (description) {
                tooltip.textContent = description;
                tooltip.style.display = 'block';

                // Position the tooltip near the cursor
                const rect = templateSelector.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.bottom + 5) + 'px';
            }
        }
    });

    templateSelector.addEventListener('mouseout', function() {
        tooltip.style.display = 'none';
    });

    // Update tooltip when template changes
    templateSelector.addEventListener('change', function() {
        const selectedOption = templateSelector.options[templateSelector.selectedIndex];
        const description = selectedOption.getAttribute('data-description');
        if (description) {
            tooltip.textContent = description;
        }
    });
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
        objectiveItem.className = 'info-item';

        const objectiveTitle = document.createElement('h3');
        objectiveTitle.className = 'info-heading';
        objectiveTitle.textContent = 'Career Objective';

        const objectiveContent = document.createElement('div');
        objectiveContent.className = 'info-content';

        const objectiveText = document.createElement('p');
        objectiveText.className = 'objective-text';
        objectiveText.textContent = facet.objective;
        objectiveContent.appendChild(objectiveText);

        objectiveItem.appendChild(objectiveTitle);
        objectiveItem.appendChild(objectiveContent);
        facetList.appendChild(objectiveItem);

        // Add description
        const descriptionItem = document.createElement('li');
        descriptionItem.className = 'info-item';

        const descriptionTitle = document.createElement('h3');
        descriptionTitle.className = 'info-heading';
        descriptionTitle.textContent = 'Industry Impact';

        const descriptionContent = document.createElement('div');
        descriptionContent.className = 'info-content';

        const descriptionText = document.createElement('p');
        descriptionText.className = 'impact-text';
        descriptionText.textContent = facet.description || 'No description available.';
        descriptionContent.appendChild(descriptionText);

        descriptionItem.appendChild(descriptionTitle);
        descriptionItem.appendChild(descriptionContent);
        facetList.appendChild(descriptionItem);

        // Add my experience
        const experienceItem = document.createElement('li');
        experienceItem.className = 'info-item';

        const experienceTitle = document.createElement('h3');
        experienceTitle.className = 'info-heading';
        experienceTitle.textContent = 'My Experience';

        const experienceContent = document.createElement('div');
        experienceContent.className = 'info-content';

        const experienceText = document.createElement('p');
        experienceText.className = 'experience-text';
        experienceText.textContent = facet.myRole || 'No experience information available.';
        experienceContent.appendChild(experienceText);

        experienceItem.appendChild(experienceTitle);
        experienceItem.appendChild(experienceContent);
        facetList.appendChild(experienceItem);

        section.appendChild(facetList);

        // We'll append the resume content directly to the facet-info-list
        // Store a reference to the facet-info-list in a data attribute for later use
        section.setAttribute('data-facet-list', facetList.id = `facet-list-${targetId}`);

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

    // Get the section element
    const section = document.querySelector(facetId);
    if (!section) {
        console.error('Section not found:', facetId);
        return;
    }

    // Get the facet-info-list for this section
    const facetListId = section.getAttribute('data-facet-list');
    const facetList = document.getElementById(facetListId);
    if (!facetList) {
        console.error('Facet list not found:', facetListId);
        return;
    }

    // Remove any previously added resume content items
    // We'll keep the first three items (objective, impact, experience) and remove the rest
    while (facetList.children.length > 3) {
        facetList.removeChild(facetList.lastChild);
    }

    // Add basic info section
    const basicInfo = createBasicInfoSection();
    facetList.appendChild(basicInfo);

    // Add skills section
    const skills = createSkillsSection();
    facetList.appendChild(skills);

    // Always add work history and education sections regardless of template
    const workHistory = createWorkHistorySection(template);
    facetList.appendChild(workHistory);

    const education = createEducationSection();
    facetList.appendChild(education);

    console.log(`Rendered content for facet ${facetId} with template ${template}`);
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
    const heading = document.createElement('h3');
    heading.className = 'info-heading';
    heading.textContent = 'Personal Information';

    // Create a container for the personal info content
    const infoContent = document.createElement('div');
    infoContent.className = 'info-content';

    // Add contact information without the "Contact:" label
    const contactDetails = document.createElement('p');
    contactDetails.className = 'contact-details';
    contactDetails.innerHTML = `Email: ${resumeData.basics.email}, Phone: ${resumeData.basics.phone}, Location: ${resumeData.basics.location.city}, ${resumeData.basics.location.region}`;
    infoContent.appendChild(contactDetails);

    // We're removing the professional summary as requested

    // Assemble the info item
    infoItem.appendChild(heading);
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
    const heading = document.createElement('h3');
    heading.className = 'info-heading';
    heading.textContent = 'Skills';

    // Create a container for the skills content
    const skillsContent = document.createElement('div');
    skillsContent.className = 'info-content';

    // Add each skill group
    resumeData.skills.forEach(skill => {
        const skillGroup = document.createElement('div');
        skillGroup.className = 'skill-group';

        const skillName = document.createElement('h4');
        skillName.className = 'skill-name';
        skillName.textContent = `${skill.name}:`;

        const skillKeywords = document.createElement('p');
        skillKeywords.className = 'skill-keywords';
        skillKeywords.textContent = skill.keywords.join(', ');

        skillGroup.appendChild(skillName);
        skillGroup.appendChild(skillKeywords);
        skillsContent.appendChild(skillGroup);
    });

    // Assemble the info item
    infoItem.appendChild(heading);
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
    const heading = document.createElement('h3');
    heading.className = 'info-heading';
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

    // Always include work history for all templates
    let workEntries = [...resumeData.work];
    const filters = templateConfig.filters.work;

    // Apply year filter if specified
    if (filters.yearsBack) {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - filters.yearsBack);

        console.log('Filtering work history with cutoff date:', cutoffDate);

        // Make a copy of the original entries before filtering
        const originalEntries = [...workEntries];

        workEntries = workEntries.filter(job => {
            // Parse the end date string (format: YYYY-MM)
            let endDateObj;
            if (job.endDate) {
                const [year, month] = job.endDate.split('-').map(num => parseInt(num, 10));
                endDateObj = new Date(year, month - 1); // month is 0-indexed in JS Date
            } else {
                endDateObj = new Date(); // Current date if no end date (still employed)
            }

            console.log(`Job: ${job.name}, End date: ${job.endDate}, Parsed date:`, endDateObj);

            return endDateObj >= cutoffDate;
        });

        console.log('Filtered work entries:', workEntries.length);

        // If no entries match the filter, use all entries
        if (workEntries.length === 0) {
            console.log('No entries match the filter, using all entries');
            workEntries = originalEntries;
        }
    }

    // Apply summary inclusion/exclusion filters
    if (filters.includeIsSummary) {
        // Add back any summary items that might have been filtered by date
        // For this implementation, we'll consider jobs with "summary" in their position as summary items
        // This is a fallback since the resume.json doesn't have explicit isSummary properties
        const summaryItems = resumeData.work.filter(job =>
            job.isSummary ||
            (job.position && job.position.toLowerCase().includes('summary')) ||
            (job.name && job.name.toLowerCase().includes('summary'))
        );

        console.log('Summary items to include:', summaryItems.length);

        // Add summary items that weren't already included
        summaryItems.forEach(item => {
            if (!workEntries.some(entry => entry.name === item.name && entry.position === item.position)) {
                workEntries.push(item);
            }
        });
    }

    if (filters.excludeIsSummary) {
        workEntries = workEntries.filter(job =>
            !job.isSummary &&
            !(job.position && job.position.toLowerCase().includes('summary')) &&
            !(job.name && job.name.toLowerCase().includes('summary'))
        );

        console.log('After excluding summary items:', workEntries.length);
    }

    // Check if we have any work entries
    if (workEntries.length === 0) {
        console.log('No work entries after filtering, using fallback');

        // Fallback: If Current Focus template has no entries, show at least the most recent ones
        if (templateId === 'current-focus') {
            // Sort work entries by end date (most recent first)
            const sortedEntries = [...resumeData.work].sort((a, b) => {
                // Parse the end date string (format: YYYY-MM)
                let aDate, bDate;

                if (a.endDate) {
                    const [aYear, aMonth] = a.endDate.split('-').map(num => parseInt(num, 10));
                    aDate = new Date(aYear, aMonth - 1); // month is 0-indexed in JS Date
                } else {
                    aDate = new Date(); // Current date if no end date (still employed)
                }

                if (b.endDate) {
                    const [bYear, bMonth] = b.endDate.split('-').map(num => parseInt(num, 10));
                    bDate = new Date(bYear, bMonth - 1); // month is 0-indexed in JS Date
                } else {
                    bDate = new Date(); // Current date if no end date (still employed)
                }

                return bDate - aDate; // Descending order (most recent first)
            });

            // Take the 3 most recent entries
            workEntries = sortedEntries.slice(0, 3);

            console.log('Using fallback with most recent entries:', workEntries.length);
        }
    }

    // If still no entries, show a message
    if (workEntries.length === 0) {
        const noWorkMessage = document.createElement('p');
        noWorkMessage.textContent = 'No work history to display for the selected template.';
        workContent.appendChild(noWorkMessage);

        // Assemble the info item
        infoItem.appendChild(heading);
        infoItem.appendChild(workContent);

        return infoItem;
    }

    // Add each job
    workEntries.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'job-item';

        // Create a container for the job header with icon
        const jobHeader = document.createElement('div');
        jobHeader.className = 'job-header';

        // Add company icon
        const companyIcon = document.createElement('div');
        companyIcon.className = 'company-icon';

        // Determine which icon to use based on company type or name
        let iconPath = 'assets/icons/code.svg'; // Default to code icon
        if (job.name.toLowerCase().includes('data') || (job.position && job.position.toLowerCase().includes('data'))) {
            iconPath = 'assets/icons/database.svg';
        } else if (job.name.toLowerCase().includes('consult') || (job.position && job.position.toLowerCase().includes('consult'))) {
            iconPath = 'assets/icons/users.svg';
        } else if (job.name.toLowerCase().includes('university') || job.name.toLowerCase().includes('college') || job.name.toLowerCase().includes('school')) {
            iconPath = 'assets/icons/user.svg';
        } else if (job.name.toLowerCase().includes('startup') || (job.position && job.position.toLowerCase().includes('founder'))) {
            iconPath = 'assets/icons/workflow.svg';
        } else if (job.name.toLowerCase().includes('ai') || (job.position && job.position.toLowerCase().includes('ai'))) {
            iconPath = 'assets/icons/ai.svg';
        }

        // Fetch and insert the SVG
        fetch(iconPath)
            .then(response => response.text())
            .then(svgContent => {
                companyIcon.innerHTML = svgContent;
            })
            .catch(error => {
                console.error('Error loading company icon:', error);
            });

        jobHeader.appendChild(companyIcon);

        // Job title and company
        const jobTitle = document.createElement('h3');
        jobTitle.className = 'job-title';
        if (job.position) {
            jobTitle.textContent = `${job.position} at ${job.name}`;
        } else {
            jobTitle.textContent = `${job.name}`;
        }

        jobHeader.appendChild(jobTitle);
        jobDiv.appendChild(jobHeader);

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

            const highlightsHeading = document.createElement('h4');
            highlightsHeading.className = 'highlights-heading';
            highlightsHeading.textContent = 'Highlights:';
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
    const heading = document.createElement('h3');
    heading.className = 'info-heading';
    heading.textContent = 'Education';

    // Create a container for the education content
    const educationContent = document.createElement('div');
    educationContent.className = 'info-content';

    // Check if we have any education entries
    if (!resumeData.education || resumeData.education.length === 0) {
        const noEducationMessage = document.createElement('p');
        noEducationMessage.textContent = 'No education history to display.';
        educationContent.appendChild(noEducationMessage);

        // Assemble the info item even if there's no education data
        infoItem.appendChild(heading);
        infoItem.appendChild(educationContent);

        return infoItem;
    }

    // Add each education entry
    resumeData.education.forEach(edu => {
        const eduDiv = document.createElement('div');
        eduDiv.className = 'education-item';

        // Create a container for the education header with icon
        const eduHeader = document.createElement('div');
        eduHeader.className = 'education-header';

        // Add institution icon
        const institutionIcon = document.createElement('div');
        institutionIcon.className = 'institution-icon';

        // Fetch and insert the education SVG
        fetch('assets/icons/user.svg')
            .then(response => response.text())
            .then(svgContent => {
                institutionIcon.innerHTML = svgContent;
            })
            .catch(error => {
                console.error('Error loading education icon:', error);
            });

        eduHeader.appendChild(institutionIcon);

        // Degree and area
        const degree = document.createElement('h4');
        degree.className = 'degree';
        degree.textContent = `${edu.studyType} in ${edu.area}`;
        eduHeader.appendChild(degree);

        eduDiv.appendChild(eduHeader);

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

            const objectiveTitle = document.createElement('h3');
            objectiveTitle.className = 'info-heading';
            objectiveTitle.textContent = 'Career Objective';

            const objectiveContent = document.createElement('div');
            objectiveContent.className = 'info-content';

            const objectiveText = document.createElement('p');
            objectiveText.className = 'objective-text';
            objectiveText.textContent = facet.objective;
            objectiveContent.appendChild(objectiveText);

            objectiveItem.appendChild(objectiveTitle);
            objectiveItem.appendChild(objectiveContent);
            facetList.appendChild(objectiveItem);
        }

        // Add description if available
        if (facet.description) {
            const descriptionItem = document.createElement('li');
            descriptionItem.className = 'info-item';

            const descriptionTitle = document.createElement('h3');
            descriptionTitle.className = 'info-heading';
            descriptionTitle.textContent = 'Industry Impact';

            const descriptionContent = document.createElement('div');
            descriptionContent.className = 'info-content';

            const descriptionText = document.createElement('p');
            descriptionText.className = 'impact-text';
            descriptionText.textContent = facet.description;
            descriptionContent.appendChild(descriptionText);

            descriptionItem.appendChild(descriptionTitle);
            descriptionItem.appendChild(descriptionContent);
            facetList.appendChild(descriptionItem);
        }

        // Add my experience if available
        if (facet.myRole) {
            const experienceItem = document.createElement('li');
            experienceItem.className = 'info-item';

            const experienceTitle = document.createElement('h3');
            experienceTitle.className = 'info-heading';
            experienceTitle.textContent = 'My Experience';

            const experienceContent = document.createElement('div');
            experienceContent.className = 'info-content';

            const experienceText = document.createElement('p');
            experienceText.className = 'experience-text';
            experienceText.textContent = facet.myRole;
            experienceContent.appendChild(experienceText);

            experienceItem.appendChild(experienceTitle);
            experienceItem.appendChild(experienceContent);
            facetList.appendChild(experienceItem);
        }

        // Store a reference to the facet-info-list in a data attribute for later use
        section.setAttribute('data-facet-list', facetList.id = `facet-list-${targetId}`);

        section.appendChild(facetList);
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
