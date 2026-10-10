// Global JavaScript for Health Store

document.addEventListener('DOMContentLoaded', () => {
  // Theme Manager
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

  // Attach listener to ALL theme toggle buttons (desktop, header switch, mobile)
  const allThemeButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile, .header-theme-switch, [id^="theme-toggle"]');
  allThemeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });

  function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('#theme-icon, #theme-icon-mobile, .theme-icon');
    themeIcons.forEach(icon => {
      if (!icon) return;
      if (theme === 'light') {
        icon.className = 'fa-regular fa-moon text-xs text-white';
      } else {
        icon.className = 'fa-regular fa-sun text-xs text-white';
      }
    });

    // Update Mobile Switch Track UI
    const themeSwitchTracks = document.querySelectorAll('#theme-switch-track, .theme-switch-track');
    themeSwitchTracks.forEach(track => {
      if (theme === 'dark') {
        track.classList.add('active-theme');
      } else {
        track.classList.remove('active-theme');
      }
    });
  }

  // RTL Manager
  const initialIsRtl = localStorage.getItem('rtl') === 'true';

  // Apply initial RTL direction
  updateRtlState(initialIsRtl ? 'rtl' : 'ltr');

  function updateRtlState(dir) {
    document.documentElement.setAttribute('dir', dir);
    const rtlSwitchTracks = document.querySelectorAll('#rtl-switch-track, .rtl-switch-track');
    rtlSwitchTracks.forEach(track => {
      if (dir === 'rtl') {
        track.classList.add('active-rtl');
      } else {
        track.classList.remove('active-rtl');
      }
    });

    const rtlIcons = document.querySelectorAll('#rtl-icon, .rtl-icon');
    rtlIcons.forEach(icon => {
      if (dir === 'rtl') {
        icon.classList.add('text-[#0D9488]', 'rotate-180');
      } else {
        icon.classList.remove('text-[#0D9488]', 'rotate-180');
      }
    });
  }

  function toggleRtl() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem('rtl', newDir === 'rtl' ? 'true' : 'false');
    updateRtlState(newDir);
  }

  // Attach listener to ALL RTL toggle buttons
  const allRtlButtons = document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile, [id^="rtl-toggle"]');
  allRtlButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleRtl();
    });
  });


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
        link.classList.remove('text-[#CBD5E1]', 'text-[#D1D5DB]', 'text-[#F3F4F6]', 'text-gray-300', 'text-gray-400', 'font-medium');
        link.classList.add('text-[#0D9488]', 'font-bold', 'active', 'active-nav-link');
        link.style.color = '#0D9488';

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

  // Home 2 Quick Procedure Diagnostic Matcher
  const symptomSelect = document.getElementById('symptom-select');
  const procedureRec = document.getElementById('procedure-recommendation');
  if (symptomSelect && procedureRec) {
    procedureRec.style.transition = 'opacity 0.15s ease';
    const procedureMap = {
      'sciatica': '<span class="text-[#0D9488] font-semibold">Recommended:</span> Transforaminal Epidural (TFESI)',
      'herniated': '<span class="text-[#0D9488] font-semibold">Recommended:</span> Cervical / Lumbar ESI & Disc Decompression',
      'facet': '<span class="text-[#0D9488] font-semibold">Recommended:</span> Facet Medial Branch Block & Radiofrequency Ablation',
      'trigeminal': '<span class="text-[#0D9488] font-semibold">Recommended:</span> Occipital Nerve Therapy & Pulsed Neurotomy',
      'failed-back': '<span class="text-[#0D9488] font-semibold">Recommended:</span> Spinal Cord Stimulation (SCS) Trial'
    };

    symptomSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (procedureMap[selected]) {
        procedureRec.style.opacity = '0';
        setTimeout(() => {
          procedureRec.innerHTML = procedureMap[selected];
          procedureRec.style.opacity = '1';
        }, 150);
      }
    });
  }

});

