/**
 * Header functionality for Phase II implementation
 * - Implements sticky header that shrinks on scroll to 20% of initial height
 * - Adds smooth scroll for anchor links
 * - Highlights active facet using Intersection Observer
 */

document.addEventListener('DOMContentLoaded', () => {
  // Create a wrapper for the hero element if it doesn't exist
  const hero = document.querySelector('.hero');
  if (hero && !hero.parentElement.classList.contains('hero-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-wrapper';
    hero.parentNode.insertBefore(wrapper, hero);
    wrapper.appendChild(hero);
  }

  // Get the header wrapper element
  const headerWrapper = document.querySelector('.hero-wrapper');

  // Store the initial height of the header wrapper
  let initialHeaderHeight = 0;

  // Function to update body padding based on header height
  function updateBodyPadding() {
    const headerHeight = headerWrapper.offsetHeight;

    // Store initial height if not already set
    if (initialHeaderHeight === 0 && !headerWrapper.classList.contains('shrink')) {
      initialHeaderHeight = headerHeight;
      console.log(`Initial header height: ${initialHeaderHeight}px`);
    }

    document.body.style.paddingTop = `${headerHeight}px`;
    console.log(`Header height: ${headerHeight}px - Body padding updated`);

    // Also update scroll-margin-top for section headings
    document.querySelectorAll('.facet-section h2').forEach(heading => {
      heading.style.scrollMarginTop = `${headerHeight + 20}px`;
    });
  }

  // Initial update of body padding
  updateBodyPadding();

  // Update padding after images and fonts have loaded
  window.addEventListener('load', () => {
    updateBodyPadding();
    // Make sure we capture the initial height after everything is loaded
    initialHeaderHeight = headerWrapper.offsetHeight;
    console.log(`Initial header height (after load): ${initialHeaderHeight}px`);

    // Set the initial height CSS variable
    headerWrapper.style.setProperty('--initial-height', `${initialHeaderHeight}px`);
  });

  // Update padding when window is resized
  window.addEventListener('resize', updateBodyPadding);

  // Implement sticky header that shrinks on scroll to 20% of initial height
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      if (!headerWrapper.classList.contains('shrink')) {
        // Apply the shrink class
        headerWrapper.classList.add('shrink');

        // If we have the initial height, set the height to 20% of initial
        if (initialHeaderHeight > 0) {
          const targetHeight = initialHeaderHeight * 0.25; // 25% of initial height
          headerWrapper.style.setProperty('--shrink-height', `${targetHeight}px`);
        }
      }
      // Update padding after shrinking - use longer transition time
      setTimeout(updateBodyPadding, 1250);
    } else {
      if (headerWrapper.classList.contains('shrink')) {
        // Remove the shrink class
        headerWrapper.classList.remove('shrink');
        // Reset any inline height
        headerWrapper.style.removeProperty('--shrink-height');
      }
      // Update padding after expanding - use shorter transition time
      setTimeout(updateBodyPadding, 250);
    }
  });

  // Get all facet navigation links
  const facetLinks = document.querySelectorAll('.facets a');

  // Add smooth scroll behavior to facet links
  facetLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Get the target section ID from the href attribute
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      // Scroll to the target section smoothly
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });

      // Update URL without page reload
      history.pushState(null, null, link.getAttribute('href'));
    });
  });

  // Set up Intersection Observer to highlight active facet
  const facetSections = document.querySelectorAll('.facet-section');

  // Create observer options
  const observerOptions = {
    root: null, // Use viewport as root
    rootMargin: '-100px 0px -50% 0px', // Adjust rootMargin to account for sticky header
    threshold: 0 // Trigger when any part of the element is visible
  };

  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Get the id of the section
      const id = entry.target.getAttribute('id');

      // Find the corresponding navigation link
      const link = document.querySelector(`.facets a[href="#${id}"]`);

      if (entry.isIntersecting) {
        // Add active class to the link when section is in view
        link.classList.add('active');
      } else {
        // Remove active class when section is out of view
        link.classList.remove('active');
      }
    });
  }, observerOptions);

  // Observe all facet sections
  facetSections.forEach(section => {
    observer.observe(section);

    // Add scroll-margin-top to section headings to avoid header overlap
    const heading = section.querySelector('h2');
    if (heading) {
      heading.style.scrollMarginTop = '80px'; // Adjust based on header height
    }
  });
});
