/**
 * Icon Replacement Functionality
 * Phase II Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Define the icon mappings
  const iconMappings = {
    'user': 'assets/icons/user.svg',
    'code': 'assets/icons/code.svg',
    'database': 'assets/icons/database.svg',
    'server': 'assets/icons/server.svg',
    'cloud': 'assets/icons/cloud.svg',
    'users': 'assets/icons/users.svg',
    'workflow': 'assets/icons/workflow.svg',
    'ai': 'assets/icons/ai.svg'
  };

  // Find all icon elements
  const iconElements = document.querySelectorAll('.icon');

  // Replace background image with inline SVG
  iconElements.forEach(icon => {
    // Get the icon type from the class list
    const iconType = Array.from(icon.classList)
      .find(className => iconMappings[className]);

    if (iconType && iconMappings[iconType]) {
      // Fetch the SVG file
      fetch(iconMappings[iconType])
        .then(response => response.text())
        .then(svgContent => {
          // Replace the background image with inline SVG
          icon.innerHTML = svgContent;
          icon.style.backgroundImage = 'none';

          // Ensure the SVG inherits the color
          const svg = icon.querySelector('svg');
          if (svg) {
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.stroke = 'currentColor';
          }
        })
        .catch(error => {
          console.error(`Error loading SVG for ${iconType}:`, error);
        });
    }
  });
});
