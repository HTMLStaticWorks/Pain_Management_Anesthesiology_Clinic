// Global JavaScript for Health Store

document.addEventListener('DOMContentLoaded', () => {
  // Theme Manager
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
  const themeIcon = document.getElementById('theme-icon');
  const themeIconMobile = document.getElementById('theme-icon-mobile');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  // Apply initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  function toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobileBtn) {
    themeToggleMobileBtn.addEventListener('click', toggleTheme);
  }

  function updateThemeIcon(theme) {
    [themeIcon, themeIconMobile].forEach(icon => {
      if (!icon) return;
      if (theme === 'light') {
        icon.className = 'fa-regular fa-moon text-xs text-white';
      } else {
        icon.className = 'fa-regular fa-sun text-xs text-white';
      }
    });

    // Update Mobile Switch Track UI
    const themeSwitchTrack = document.getElementById('theme-switch-track');
    if (themeSwitchTrack) {
      if (theme === 'dark') {
        themeSwitchTrack.classList.add('active-theme');
      } else {
        themeSwitchTrack.classList.remove('active-theme');
      }
    }
  }

  // RTL Manager
  const rtlToggleBtn = document.getElementById('rtl-toggle');
  const rtlToggleMobileBtn = document.getElementById('rtl-toggle-mobile');
  const initialIsRtl = localStorage.getItem('rtl') === 'true';

  // Apply initial RTL direction
  updateRtlState(initialIsRtl ? 'rtl' : 'ltr');

  function updateRtlState(dir) {
    document.documentElement.setAttribute('dir', dir);
    const rtlSwitchTrack = document.getElementById('rtl-switch-track');
    if (rtlSwitchTrack) {
      if (dir === 'rtl') {
        rtlSwitchTrack.classList.add('active-rtl');
      } else {
        rtlSwitchTrack.classList.remove('active-rtl');
      }
    }
  }

  function toggleRtl() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem('rtl', newDir === 'rtl' ? 'true' : 'false');
    updateRtlState(newDir);
  }

  if (rtlToggleBtn) {
    rtlToggleBtn.addEventListener('click', toggleRtl);
  }
  if (rtlToggleMobileBtn) {
    rtlToggleMobileBtn.addEventListener('click', toggleRtl);
  }

  // Scroll Progress Indicator
  window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    }

    // Sticky Navbar Styling & Back to Top visibility
    const navbar = document.querySelector('nav');
    const backToTopBtn = document.getElementById('back-to-top');

    if (window.scrollY > 50) {
      navbar?.classList.add('shadow-xl', 'bg-opacity-90', 'border-b', 'border-gray-800');
    } else {
      navbar?.classList.remove('shadow-xl', 'bg-opacity-90', 'border-b', 'border-gray-800');
    }

    if (window.scrollY > 300) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }

    if (backToTopBtn && backToTopBtn.classList.contains('show')) {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const footer = document.querySelector('footer');
      const footerHeight = footer ? footer.offsetHeight : 0;

      if (distanceFromBottom < footerHeight) {
        const offset = footerHeight - distanceFromBottom + 24;
        backToTopBtn.style.bottom = `${offset}px`;
      } else {
        backToTopBtn.style.bottom = '24px';
      }
    }
  });

  // Back to top scroll handler
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile Menu slide toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Inject icons into mobile menu links dynamically
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
  const iconMapping = {
    'index.html': 'fa-solid fa-house',
    'home-2.html': 'fa-solid fa-house-chimney-medical',
    'about.html': 'fa-solid fa-circle-info',
    'medicines.html': 'fa-solid fa-pills',
    'prescriptions.html': 'fa-solid fa-prescription',
    'health-blog.html': 'fa-solid fa-newspaper',
    'doctors.html': 'fa-solid fa-user-doctor',
    'contact.html': 'fa-solid fa-envelope',
    'dashboard.html': 'fa-solid fa-chart-line'
  };

  mobileMenuLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !link.querySelector('i') && !link.classList.contains('mobile-signup-btn')) {
      const filename = href.split('/').pop().split('#')[0].split('?')[0] || 'index.html';
      const iconClass = iconMapping[filename];
      if (iconClass) {
        const iconEl = document.createElement('i');
        iconEl.className = iconClass + ' mr-2 text-xs';
        link.insertBefore(iconEl, link.firstChild);
      }
    }
  });

  // Active Page & Dropdown Highlighter
  const currentPath = window.location.pathname;
  let currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1).split('#')[0].split('?')[0];
  if (!currentPage || currentPage === '/') {
    currentPage = 'index.html';
  }

  const servicePages = ['medicines.html', 'prescriptions.html', 'health-blog.html'];

  // Highlight standard desktop & mobile nav links
  const navLinks = document.querySelectorAll('nav a, #mobile-menu a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const hrefPage = href.split('/').pop().split('#')[0].split('?')[0];
      if (hrefPage === currentPage) {
        link.classList.remove('text-[#CBD5E1]', 'text-[#D1D5DB]', 'text-[#F3F4F6]', 'text-gray-400');
        link.classList.add('text-[#0D9488]', 'font-bold', 'active', 'active-nav-link');

        // Dropdown item styling in desktop dropdown
        if (link.closest('.group') || link.classList.contains('dropdown-item')) {
          link.classList.add('bg-[#0D9488]/15', 'text-[#0D9488]', 'font-semibold', 'dropdown-active-item');
        }

        // Mobile menu item active styling
        if (link.closest('#mobile-menu')) {
          link.classList.add('text-[#0D9488]', 'font-bold', 'active', 'mobile-active-item');
        }
      }
    }
  });

  // Highlight Services parent dropdown button & mobile header if on any services page
  if (servicePages.includes(currentPage)) {
    // Desktop Services Dropdown Button
    const servicesBtns = document.querySelectorAll('.services-dropdown-btn, nav button');
    servicesBtns.forEach(btn => {
      if (btn.textContent.includes('Services')) {
        btn.classList.remove('text-[#CBD5E1]', 'text-[#D1D5DB]');
        btn.classList.add('text-[#0D9488]', 'font-semibold', 'active-services-btn');
      }
    });

    // Mobile Services Header
    const mobileServicesHeaders = document.querySelectorAll('.mobile-services-header, #mobile-menu span');
    mobileServicesHeaders.forEach(header => {
      if (header.textContent.trim().toLowerCase() === 'services') {
        header.classList.remove('text-[#94A3B8]');
        header.classList.add('text-[#0D9488]', 'font-bold');
      }
    });
  }

});
