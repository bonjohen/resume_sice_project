/**
 * Lottie Animation Integration
 * Phase II Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Create a container for the Lottie animation
  const lottieContainer = document.createElement('div');
  lottieContainer.className = 'lottie-container';
  lottieContainer.setAttribute('id', 'lottie-animation');
  
  // Find the hero content element to append the animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && heroContent.querySelector('h1')) {
    // Insert the Lottie container next to the h1
    const h1 = heroContent.querySelector('h1');
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    
    // Wrap the h1 and add the Lottie container
    h1.parentNode.insertBefore(wrapper, h1);
    wrapper.appendChild(h1);
    wrapper.appendChild(lottieContainer);
    
    // Load the Lottie library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js';
    script.integrity = 'sha512-yAr4fN9WZH6hESbOwoFZjyqmypIgqdbCBCVLeLBmCKqV8lpFxdDSLNQXdOXwP3l6qBHLvCt3WlYgQHYY5ZKbWQ==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.fetchpriority = 'low';
    script.onload = () => {
      // Initialize Lottie animation once the library is loaded
      lottie.loadAnimation({
        container: document.getElementById('lottie-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets5.lottiefiles.com/packages/lf20_w51pcehl.json', // Simple code animation
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      });
    };
    
    document.body.appendChild(script);
  }
});
