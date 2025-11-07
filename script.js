/**
 * Kanana Construction - Website JavaScript
 * Handles mobile menu, project filtering, and pagination
 */

/**
 * Toggles the mobile navigation menu
 * Also updates ARIA attributes for accessibility
 */
function toggleMenu() {
  const el = document.getElementById('mobileMenu');
  const btn = document.querySelector('.menu-btn');
  
  if (!el || !btn) {
    console.warn('Mobile menu elements not found');
    return;
  }
  
  const isHidden = el.style.display === 'none' || !el.style.display;
  
  if (isHidden) {
    el.style.display = 'block';
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close Menu');
  } else {
    el.style.display = 'none';
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open Menu');
  }
}

/**
 * Filters project cards by category
 * @param {string} cat - Category to filter ('all', 'residential', 'commercial')
 */
function filterCategory(cat) {
  const cards = document.querySelectorAll("#projectGrid .card");
  
  if (!cards.length) {
    console.warn('No project cards found');
    return;
  }
  
  // Show/hide cards based on category
  let visibleCount = 0;
  cards.forEach((c) => {
    const shouldShow = cat === "all" || c.dataset.category === cat;
    c.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount++;
  });

  // Update active button state
  const buttons = document.querySelectorAll(".btn.secondary");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute('aria-pressed', 'false');
  });

  // Add active class to clicked button
  if (event && event.target) {
    event.target.classList.add("active");
    event.target.setAttribute('aria-pressed', 'true');
  }
  
  // Check pagination visibility after filtering
  checkPaginationVisibility();
  
  // Announce to screen readers
  const announcement = `Showing ${visibleCount} ${cat === 'all' ? '' : cat} projects`;
  announceToScreenReader(announcement);
}

/**
 * Checks if Load More button should be displayed
 * Shows button only when there are more than 6 projects
 */
function checkPaginationVisibility() {
  const grid = document.getElementById("projectGrid");
  const loadMoreContainer = document.getElementById("loadMoreContainer");
  
  if (!grid || !loadMoreContainer) {
    return;
  }
  
  const totalProjects = grid.querySelectorAll('.project-card').length;
  
  // Show Load More button only if there are more than 6 projects
  if (totalProjects > 6) {
    loadMoreContainer.style.display = 'block';
  } else {
    loadMoreContainer.style.display = 'none';
  }
}

/**
 * Loads more projects into the grid
 * Creates placeholder project cards
 */
function paginate() {
  const grid = document.getElementById("projectGrid");
  
  if (!grid) {
    console.warn('Project grid not found');
    return;
  }
  
  const categories = ['residential', 'commercial'];
  const locations = ['Nairobi', 'Kiambu', 'Mombasa', 'Nakuru'];
  
  for (let i = 0; i < 3; i++) {
    const category = categories[i % 2];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const projectNum = Math.floor(Math.random() * 100);
    
    const a = document.createElement("a");
    a.className = "card project-card";
    a.href = "project.html";
    a.setAttribute("data-category", category);
    a.setAttribute("aria-label", `View ${category} project ${projectNum} in ${location}`);
    
    a.innerHTML = `<img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4MDAnIGhlaWdodD0nNjAwJz4KICA8cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZTVlN2ViJy8+CiAgPHRleHQgeD0nNTAlJyB5PSc1MCUnIGRvbWluYW50LWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnIGZpbGw9JyM5Y2EzYWYnIGZvbnQtZmFtaWx5PSdBcmlhbCcgZm9udC1zaXplPScxNCc+UHJvamVjdDwvdGV4dD4KPC9zdmc+' alt='Project placeholder'>
      <div class="content">
        <div class="project-meta">
          <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
          <span>${location}</span>
        </div>
        <h3>Project ${projectNum}</h3>
      </div>`;
    
    grid.appendChild(a);
  }
  
  // Check if we need to hide the button after loading more
  checkPaginationVisibility();
  
  // Announce to screen readers
  announceToScreenReader('3 more projects loaded');
}

/**
 * Announces a message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
  const announcement = document.getElementById('aria-announcement');
  if (announcement) {
    announcement.textContent = message;
  }
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Show all elements immediately if user prefers reduced motion
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.style.opacity = '1';
    });
    return;
  }
  
  // Create intersection observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animated class to trigger animation
        entry.target.classList.add('animated');
        
        // Get animation type from data attribute or use default
        const animationType = entry.target.dataset.animation || 'fade-in-up';
        entry.target.classList.add(animationType);
        
        // Stop observing this element after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  // Create aria-live region for announcements
  const liveRegion = document.createElement('div');
  liveRegion.id = 'aria-announcement';
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); border: 0;';
  document.body.appendChild(liveRegion);
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Check pagination visibility on page load
  checkPaginationVisibility();
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const menu = document.getElementById('mobileMenu');
    const btn = document.querySelector('.menu-btn');
    
    if (menu && btn && menu.style.display === 'block') {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        toggleMenu();
      }
    }
  });
  
  // Close mobile menu on escape key
  document.addEventListener('keydown', function(e) {
    const menu = document.getElementById('mobileMenu');
    if (e.key === 'Escape' && menu && menu.style.display === 'block') {
      toggleMenu();
    }
  });
});
