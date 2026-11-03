/**
 * Initials Skill Hub - Global JavaScript Engine
 * Author: Ankit Rajbhar
 * Handles navigation, modals, animations, validation, and user interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle (Light / Dark Mode) ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  const updateThemeUI = (isDark) => {
    themeToggleBtns.forEach((btn) => {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      updateThemeUI(false);
      showToast('Switched to Light Mode', 'info');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      updateThemeUI(true);
      showToast('Switched to Dark Mode', 'info');
    }
    if (window.lucide) window.lucide.createIcons();
  };

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });

  updateThemeUI(document.documentElement.classList.contains('dark'));

  // Initialize Lucide Icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- Sticky Navigation Glass Effect ---
  const navbar = document.getElementById('main-navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        navbar.classList.add('shadow-xl', 'shadow-indigo-950/20', 'border-b', 'border-slate-800/80');
        navbar.classList.remove('border-transparent');
      } else {
        navbar.classList.remove('shadow-xl', 'shadow-indigo-950/20', 'border-b', 'border-slate-800/80');
        navbar.classList.add('border-transparent');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- Mobile Drawer Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

  const toggleMobileMenu = (open) => {
    if (!mobileMenuDrawer) return;
    if (open) {
      mobileMenuDrawer.classList.remove('translate-x-full');
      if (mobileBackdrop) {
        mobileBackdrop.classList.remove('opacity-0', 'pointer-events-none');
        mobileBackdrop.classList.add('opacity-100', 'pointer-events-auto');
      }
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenuDrawer.classList.add('translate-x-full');
      if (mobileBackdrop) {
        mobileBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
        mobileBackdrop.classList.add('opacity-0', 'pointer-events-none');
      }
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
  }
  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));
  }

  // Close mobile drawer when clicking internal nav links
  document.querySelectorAll('#mobile-menu-drawer a').forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // --- Registration / Enrollment Modal System ---
  const registerModal = document.getElementById('register-modal');
  const registerBackdrop = document.getElementById('modal-backdrop');
  const openModalBtns = document.querySelectorAll('[data-open-modal="register"]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal="register"]');
  const registrationForm = document.getElementById('registration-form');
  const registrationSuccessView = document.getElementById('registration-success-view');

  const openModal = (defaultCategory = 'business') => {
    if (!registerModal) return;
    registerModal.classList.remove('hidden');
    setTimeout(() => {
      registerModal.classList.remove('opacity-0');
      const dialog = registerModal.querySelector('.modal-dialog');
      if (dialog) dialog.classList.remove('scale-95', 'opacity-0');
    }, 10);
    document.body.style.overflow = 'hidden';

    // Pre-select category if specified
    const categoryInput = document.querySelector(`input[name="registrationRole"][value="${defaultCategory}"]`);
    if (categoryInput) {
      categoryInput.checked = true;
      updateRegistrationRoleFields(defaultCategory);
    }
  };

  const closeModal = () => {
    if (!registerModal) return;
    const dialog = registerModal.querySelector('.modal-dialog');
    if (dialog) dialog.classList.add('scale-95', 'opacity-0');
    registerModal.classList.add('opacity-0');
    setTimeout(() => {
      registerModal.classList.add('hidden');
      document.body.style.overflow = '';
      // Reset form and view state after close
      if (registrationForm && registrationSuccessView) {
        registrationForm.reset();
        registrationForm.classList.remove('hidden');
        registrationSuccessView.classList.add('hidden');
      }
    }, 280);
  };

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.getAttribute('data-category') || 'business';
      openModal(category);
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  if (registerBackdrop) {
    registerBackdrop.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (registerModal && !registerModal.classList.contains('hidden')) {
        closeModal();
      }
      if (mobileMenuDrawer && !mobileMenuDrawer.classList.contains('translate-x-full')) {
        toggleMobileMenu(false);
      }
    }
  });

  // Role toggle inside Modal (Business vs Student)
  const roleRadios = document.querySelectorAll('input[name="registrationRole"]');
  const serviceSelect = document.getElementById('reg-interest-select');
  const roleLabelHelper = document.getElementById('reg-role-helper');

  const updateRegistrationRoleFields = (role) => {
    if (!serviceSelect) return;
    if (role === 'student') {
      if (roleLabelHelper) roleLabelHelper.textContent = "Tell us about your learning background and career goals:";
      serviceSelect.innerHTML = `
        <option value="" disabled selected>Select Skill Development Track</option>
        <option value="Digital Marketing & Ads Practical Training">Digital Marketing & Ads Practical Training</option>
        <option value="Modern Web Development (HTML/CSS/JS/React)">Modern Web Development Bootcamp</option>
        <option value="Search Engine Optimization (SEO) & Analytics">SEO Masterclass & Real Projects</option>
        <option value="Content Strategy & Creative Brand Design">Content Strategy & Creative Design</option>
        <option value="Full IT & Digital Career Mentorship">Comprehensive IT & Digital Career Mentorship</option>
      `;
    } else {
      if (roleLabelHelper) roleLabelHelper.textContent = "Tell us about your company and project requirements:";
      serviceSelect.innerHTML = `
        <option value="" disabled selected>Select IT or Marketing Service</option>
        <option value="Custom Website & Web App Development">Custom Website & Web App Development</option>
        <option value="Performance SEO & Organic Ranking">Performance SEO & Organic Search Growth</option>
        <option value="Performance Paid Ads (Meta, Google, PPC)">Performance Paid Ads & ROI Campaigns</option>
        <option value="Brand Identity & Content Production">Creative Content & Brand Strategy</option>
        <option value="Complete Digital Transformation">End-to-End Digital Transformation</option>
      `;
    }
  };

  roleRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      updateRegistrationRoleFields(e.target.value);
    });
  });

  // Handle Registration Form Submission
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const role = document.querySelector('input[name="registrationRole"]:checked')?.value || 'Client';
      const name = document.getElementById('reg-fullname')?.value.trim();
      const email = document.getElementById('reg-email')?.value.trim();
      const phone = document.getElementById('reg-phone')?.value.trim();
      const interest = document.getElementById('reg-interest-select')?.value;
      const message = document.getElementById('reg-message')?.value.trim() || 'No additional details provided.';

      if (!name || !email || !phone || !interest) {
        showToast('Please fill in all required fields accurately.', 'warning');
        return;
      }

      // Generate reference ID
      const refId = 'ISH-' + Math.floor(100000 + Math.random() * 900000);
      
      // Update success view details
      const summaryName = document.getElementById('summary-applicant-name');
      const summaryRef = document.getElementById('summary-applicant-ref');
      const summaryTrack = document.getElementById('summary-applicant-track');
      const whatsappActionBtn = document.getElementById('success-whatsapp-cta');

      if (summaryName) summaryName.textContent = name;
      if (summaryRef) summaryRef.textContent = refId;
      if (summaryTrack) summaryTrack.textContent = interest;

      // Construct WhatsApp link with prefilled application details
      const formattedText = encodeURIComponent(
        `Hello Initials Skill Hub,\n\nI have just submitted my registration on the website!\n*Ref Code:* ${refId}\n*Name:* ${name}\n*Role:* ${role.toUpperCase()}\n*Interest:* ${interest}\n*Phone:* ${phone}\n*Email:* ${email}\n*Notes:* ${message}`
      );
      if (whatsappActionBtn) {
        whatsappActionBtn.href = `https://wa.me/918527868276?text=${formattedText}`;
      }

      // Show loading indicator on submit button
      const submitBtn = registrationForm.querySelector('button[type="submit"]') || document.getElementById('reg-submit-btn');
      const submitText = submitBtn ? submitBtn.querySelector('.submit-text') : null;
      const submitIcon = submitBtn ? submitBtn.querySelector('.submit-icon') : null;
      const originalText = submitText ? submitText.textContent : 'Submit Registration Application';

      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'Submitting to Ankit Rajbhar...';
      }

      // Dispatch to Formspree Endpoint (Direct Live Delivery to ankitrajbhar85278@gmail.com)
      fetch('https://formspree.io/f/mwllakrl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _subject: `[New ISH Application] ${name} - ${interest} (${role}) [${refId}]`,
          _replyto: email,
          name: name,
          email: email,
          phone: phone,
          role: role,
          interest_track: interest,
          message: message,
          reference_code: refId,
          source_page: window.location.pathname.includes('support') ? 'Support Page Registration Modal' : 'Homepage Registration Modal',
          submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      }).then((res) => {
        if (res.ok) {
          console.log('[Formspree] Registration delivered successfully to ankitrajbhar85278@gmail.com');
          showToast('Application delivered directly to Founder Ankit Rajbhar!', 'success');
        } else {
          showToast('Application saved! You can also confirm directly on WhatsApp.', 'info');
        }
      }).catch((err) => {
        console.warn('[Formspree] Dispatch notice:', err);
        showToast('Application logged! Please verify on WhatsApp.', 'info');
      }).finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = originalText;
        }

        // Transition to success state
        registrationForm.classList.add('hidden');
        if (registrationSuccessView) {
          registrationSuccessView.classList.remove('hidden');
        }
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }

  // --- Services Filter Tabs (On index.html) ---
  const filterButtons = document.querySelectorAll('[data-service-filter]');
  const serviceCards = document.querySelectorAll('[data-service-card]');

  if (filterButtons.length > 0 && serviceCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetCategory = btn.getAttribute('data-service-filter');

        filterButtons.forEach((b) => {
          b.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/25');
          b.classList.add('bg-slate-800/60', 'text-slate-300', 'hover:bg-slate-800');
        });

        btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/25');
        btn.classList.remove('bg-slate-800/60', 'text-slate-300', 'hover:bg-slate-800');

        serviceCards.forEach((card) => {
          const cardType = card.getAttribute('data-service-type');
          if (targetCategory === 'all' || cardType === targetCategory || cardType === 'both') {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
          }
        });
      });
    });
  }

  // --- Active Nav Highlight on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('text-indigo-400');
                link.classList.remove('text-slate-300');
              } else {
                link.classList.remove('text-indigo-400');
                link.classList.add('text-slate-300');
              }
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach((section) => observer.observe(section));
  }
});

// --- Toast Notification Utility ---
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-300 transform translate-y-4 opacity-0 text-sm ${
    type === 'success'
      ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
      : type === 'warning'
      ? 'bg-slate-900/95 border-amber-500/40 text-amber-200'
      : 'bg-slate-900/95 border-indigo-500/40 text-indigo-200'
  }`;

  const iconName = type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'info';

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 shrink-0 mt-0.5 ${
      type === 'success' ? 'text-emerald-400' : type === 'warning' ? 'text-amber-400' : 'text-indigo-400'
    }"></i>
    <div class="flex-1 text-slate-200 font-medium leading-relaxed">${message}</div>
    <button class="text-slate-400 hover:text-white shrink-0 ml-2" onclick="this.parentElement.remove()" aria-label="Close notification">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4800);
}
