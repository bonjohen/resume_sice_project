/**
 * Header functionality for Phase II implementation
 * - Implements sticky header that shrinks on scroll to 20% of initial height
 * - Adds smooth scroll for anchor links
 * - Highlights active facet using Intersection Observer
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure page starts at the top
  window.scrollTo(0, 0);

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

    // Only store initial height if we have content and not shrunk
    if (initialHeaderHeight === 0 && !headerWrapper.classList.contains('shrink') && headerHeight > 50) {
      initialHeaderHeight = headerHeight;
      console.log(`Initial header height: ${initialHeaderHeight}px`);
      // Set explicit height on wrapper for smooth transitions
      headerWrapper.style.height = `${initialHeaderHeight}px`;
    }

    document.body.style.paddingTop = `${headerHeight}px`;
    console.log(`Header height: ${headerHeight}px - Body padding updated`);

    // Also update scroll-margin-top for section headings
    document.querySelectorAll('.facet-section h2').forEach(heading => {
      heading.style.scrollMarginTop = `${headerHeight + 20}px`;
    });
  }

  // Wait a bit for content to load before initial update
  setTimeout(() => {
    updateBodyPadding();
  }, 100);

  // Update padding after images and fonts have loaded
  window.addEventListener('load', () => {
    // Wait a bit more to ensure content is fully rendered
    setTimeout(() => {
      // Force recalculation of initial height
      headerWrapper.style.height = 'auto';
      initialHeaderHeight = headerWrapper.offsetHeight;
      console.log(`Initial header height (after load): ${initialHeaderHeight}px`);

      // Set explicit height for smooth transitions
      headerWrapper.style.height = `${initialHeaderHeight}px`;
      updateBodyPadding();
    }, 200);
  });

  // Update padding when window is resized
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate initial height on resize if not shrunk
      if (!headerWrapper.classList.contains('shrink')) {
        headerWrapper.style.height = 'auto';
        initialHeaderHeight = headerWrapper.offsetHeight;
        headerWrapper.style.height = `${initialHeaderHeight}px`;
      }
      updateBodyPadding();
    }, 100);
  });

  // Implement sticky header that shrinks on scroll to 20% of initial height
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      if (!headerWrapper.classList.contains('shrink')) {
        // Apply the shrink class
        headerWrapper.classList.add('shrink');

        // If we have the initial height, set the height to 25% of initial
        if (initialHeaderHeight > 0) {
          const targetHeight = initialHeaderHeight * 0.25; // 25% of initial height
          headerWrapper.style.height = `${targetHeight}px`;

          // Update body padding immediately to prevent gap
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            updateBodyPadding();
          }, 50);
        }
      }
    } else {
      if (headerWrapper.classList.contains('shrink')) {
        // Remove the shrink class
        headerWrapper.classList.remove('shrink');

        // Restore to initial height
        if (initialHeaderHeight > 0) {
          headerWrapper.style.height = `${initialHeaderHeight}px`;

          // Update body padding immediately to prevent gap
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            updateBodyPadding();
          }, 50);
        }
      }
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

  // Expose a global function to recalculate header height when content changes
  window.recalculateHeaderHeight = function() {
    console.log('Recalculating header height...');
    headerWrapper.style.height = 'auto';
    const newHeight = headerWrapper.offsetHeight;

    // Update initial height if not shrunk
    if (!headerWrapper.classList.contains('shrink')) {
      initialHeaderHeight = newHeight;
      headerWrapper.style.height = `${newHeight}px`;
    }

    updateBodyPadding();
  };
});
