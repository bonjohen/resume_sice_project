# Resume Website

A static resume website with facet navigation, responsive design, and multiple template views.

## Overview

This project implements a personal resume website with the following features:
- Landing page with hero section (name, tagline, and facet navigation)
- Smooth scrolling to different resume sections based on professional facets
- Two resume templates: Basic and Current-Focus
- Download functionality for resume.json
- Print-optimized view
- Structured data with JSON-LD

## Project Structure

```
/
├── index.html              # Main HTML file
├── style.css               # CSS styles
├── script.js               # JavaScript functionality
├── resume.json             # Resume data in JSON Resume format
├── facets.json             # Facet configuration
├── .well-known/
│   └── resume.json         # Duplicate of resume.json for discovery
├── robots.txt              # Search engine directives
├── templates/              # Template rendering logic
└── assets/                 # Images and other static assets
```

## Development

### Prerequisites
- Modern web browser
- Text editor or IDE
- Basic knowledge of HTML, CSS, and JavaScript
- Node.js and npm (for running tests)

### Local Development

#### Launch Instructions
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/resume-website.git
   cd resume-website
   ```

2. Launch using one of these methods:

   **Option 1: Using Vite (recommended)**
   ```
   npm install -g vite
   vite
   ```
   Then open http://localhost:5173 in your browser.

   **Option 2: Using Python's built-in server**
   ```
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   Then open http://localhost:8000 in your browser.

   **Option 3: Using Node.js http-server**
   ```
   npm install -g http-server
   http-server
   ```
   Then open http://localhost:8080 in your browser.

   **Option 4: Direct file opening**
   Simply open the `index.html` file in your browser (note: some features may not work correctly due to CORS restrictions).

## Testing

### Automated Tests
The project uses a simple test suite to verify core functionality:

1. Install test dependencies:
   ```
   npm install
   ```

2. Run the automated test suite:
   ```
   npm test
   ```

This will execute tests in `tests/test-smoke.js` that verify:
- HTTP 200 status and correct page title
- Presence of hero elements
- Pill navigation functionality
- Resume data loading
- Template switching
- Download link configuration
- Print functionality

### Manual Testing

For Phase I, perform these manual checks:

1. **Responsive Design Testing**:
   - Resize browser to 320px, 768px, and 1280px widths
   - Verify no horizontal scrolling appears
   - Confirm all elements remain usable and properly styled

2. **Navigation Testing**:
   - Click each facet pill and verify smooth scrolling to the correct section
   - Confirm the correct objective text is visible for each facet

3. **Template Testing**:
   - Switch between Basic and Current-Focus templates
   - Verify Current-Focus only shows last 10 years of work history

4. **Print Testing**:
   - Click the print button
   - In the print preview, verify navigation elements are hidden
   - Confirm resume content is properly paginated

5. **Download Testing**:
   - Click the download button
   - Verify resume.json is downloaded with correct content

## Data Structure

The site uses two primary data files:

1. `resume.json`: Contains all resume content following the [JSON Resume](https://jsonresume.org/schema/) standard
2. `facets.json`: Defines the professional facets and their display configuration

## Features

### Facet Navigation
The site organizes resume content into professional facets (e.g., Data Engineering, Software Development) that users can navigate through via the pill navigation in the hero section.

### Templates
Two resume templates are available:
- **Basic**: Shows full biography, education, and complete work history
- **Current-Focus**: Highlights the last ten years of work history plus a skills summary of earlier years

### Print & Download
- Print button optimizes the layout for printing
- Download button provides the raw resume.json file

## Browser Compatibility
Tested and compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
[MIT License](LICENSE)
