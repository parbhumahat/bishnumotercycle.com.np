/**
 * Bishnu Motorcycle Workshop - Interactive Script
 * Vanilla JavaScript ES6+
 * Clean, lightweight, modular, framework-free
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (LIGHT ↔ DARK MODE WITH LOCALSTORAGE)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve stored theme preference or check system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    rootElement.setAttribute('data-theme', 'dark');
  } else {
    rootElement.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  /* --------------------------------------------------------------------------
     2. MOBILE MENU NAVIGATION TOGGLE
     -------------------------------------------------------------------------- */
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('active');
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    navMenu.classList.add('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    mobileToggleBtn.setAttribute('aria-label', 'Close Navigation Menu');
  }

  function closeMobileMenu() {
    navMenu.classList.remove('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    mobileToggleBtn.setAttribute('aria-label', 'Open Navigation Menu');
  }

  /* --------------------------------------------------------------------------
     3. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], header[id]');

  function handleScrollSpy() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  /* --------------------------------------------------------------------------
     4. VANILLA JS LIGHTBOX MODAL FOR GALLERY
     -------------------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = [];

  // Gather gallery metadata
  galleryItems.forEach((item, index) => {
    const src = item.getAttribute('data-src') || item.querySelector('img')?.src || '';
    const caption = item.getAttribute('data-caption') || item.querySelector('.gallery-caption')?.textContent || '';
    
    galleryData.push({ src, caption });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (!lightboxModal || galleryData.length === 0) return;
    currentGalleryIndex = index;

    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent page scroll
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const current = galleryData[currentGalleryIndex];
    if (lightboxImg) lightboxImg.src = current.src;
    if (lightboxCaption) lightboxCaption.textContent = current.caption;
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  /* --------------------------------------------------------------------------
     5. CONTACT FORM VALIDATION & CONFIRMATION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      const nameInput = document.getElementById('form-name');
      const phoneInput = document.getElementById('form-phone');
      const messageInput = document.getElementById('form-message');

      // Clear previous error states
      [nameInput, phoneInput, messageInput].forEach(input => {
        if (input) {
          const parent = input.closest('.form-group');
          if (parent) parent.classList.remove('has-error');
        }
      });

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        showFieldError(nameInput);
        isValid = false;
      }

      // Validate Phone
      if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.trim().length < 6) {
        showFieldError(phoneInput);
        isValid = false;
      }

      // Validate Message
      if (!messageInput || !messageInput.value.trim()) {
        showFieldError(messageInput);
        isValid = false;
      }

      if (isValid) {
        const userName = nameInput.value.trim();
        
        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>Inquiry Received!</strong><br>
            Thank you, <b>${escapeHtml(userName)}</b>. Your message has been logged. For urgent requests or immediate assistance, please call <b>9857032691</b> directly.
          `;
        }

        contactForm.reset();
      }
    });
  }

  function showFieldError(inputElement) {
    if (!inputElement) return;
    const parentGroup = inputElement.closest('.form-group');
    if (parentGroup) {
      parentGroup.classList.add('has-error');
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  /* --------------------------------------------------------------------------
     6. CURRENT YEAR FOOTER UPDATE
     -------------------------------------------------------------------------- */
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     7. IMAGE FALLBACK LISTENER FOR MISSING LOCAL IMAGES
     -------------------------------------------------------------------------- */
  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    img.addEventListener('error', function() {
      this.classList.add('img-fallback');
    });
  });

  /* --------------------------------------------------------------------------
     8. ADMIN BUTTON LISTENER
     -------------------------------------------------------------------------- */
  const navAdminLink = document.getElementById('nav-admin-link');

  function handleAdminClick(e) {
    if (e) e.preventDefault();
    alert('Admin Portal reserved for future use.');
  }

  if (navAdminLink) navAdminLink.addEventListener('click', handleAdminClick);

  /* --------------------------------------------------------------------------
     9. CUSTOMER ASSISTANT CHATBOT (VANILLA JS ONLY)
     -------------------------------------------------------------------------- */
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatSuggestBtns = document.querySelectorAll('.chat-suggest-btn');

  let isChatInitialized = false;

  const chatbotKnowledge = {
    services: {
      text: "At Bishnu Motorcycle Workshop, we provide expert motorcycle care including:\n\n• Routine Servicing & Safety Tune-ups\n• Engine Diagnostics, Tuning & Overhauls\n• Brake Pad, Disc & Suspension Repairs\n• Electrical Wiring, Battery & Starter Maintenance\n• Genuine Spare Parts Replacement\n• Tyre Replacement & Wheel Balancing",
      actions: [
        { label: "Call Workshop: 9857032691", href: "tel:+9779857032691", isTel: true },
        { label: "Get Directions", href: "https://maps.app.goo.gl/6HdbfaxdrhAWPo7e9", isMap: true }
      ]
    },
    location: {
      text: "Bishnu Motorcycle Workshop is located at Butwal-12, Tamnagar, Rupandehi, Nepal with direct roadside access for bike servicing and repairs.",
      actions: [
        { label: "Get Directions", href: "https://maps.app.goo.gl/6HdbfaxdrhAWPo7e9", isMap: true }
      ]
    },
    contact: {
      text: "You can reach us directly by phone or call our workshop directly for service inquiries at 9857032691:",
      actions: [
        { label: "Call: 9857032691", href: "tel:+9779857032691", isTel: true },
        { label: "Get Directions", href: "https://maps.app.goo.gl/6HdbfaxdrhAWPo7e9", isMap: true }
      ]
    },
    hours: {
      text: "Bishnu Motorcycle Workshop Opening Hours:\n\nSunday – Friday: 07:00 AM – 08:00 PM\nSaturday: Closed",
      actions: [
        { label: "Call Now: 9857032691", href: "tel:+9779857032691", isTel: true }
      ]
    },
    directions: {
      text: "Our workshop is located at Butwal-12, Tamnagar, Rupandehi, Nepal. Click below to view our location on Google Maps:",
      actions: [
        { label: "Get Directions", href: "https://maps.app.goo.gl/6HdbfaxdrhAWPo7e9", isMap: true }
      ]
    },
    servicing: {
      text: "Yes, we offer complete motorcycle servicing at Butwal-12, Tamnagar! Standard servicing includes engine oil change, air/oil filter cleaning, brake inspection, drive chain cleaning & tensioning, and safety checks.",
      actions: [
        { label: "Call 9857032691", href: "tel:+9779857032691", isTel: true },
        { label: "Get Directions", href: "https://maps.app.goo.gl/6HdbfaxdrhAWPo7e9", isMap: true }
      ]
    }
  };

  function findChatbotResponse(input) {
    const q = input.toLowerCase().trim();

    if (/service|repair|maintenance|overhaul|engine|tune|tuning|brake|brakes|suspension|battery|part|parts|tyre|tire|wheel|clutch|chain|oil/i.test(q)) {
      return chatbotKnowledge.services;
    }
    if (/where|location|address|place|located|find|locality|tamnagar|butwal|rupandehi/i.test(q)) {
      return chatbotKnowledge.location;
    }
    if (/direction|directions|map|maps|google|route|navigate/i.test(q)) {
      return chatbotKnowledge.directions;
    }
    if (/contact|phone|call|number|reach|mobile|whatsapp/i.test(q)) {
      return chatbotKnowledge.contact;
    }
    if (/hour|hours|time|times|open|opening|close|closing|schedule|timing|day|sunday/i.test(q)) {
      return chatbotKnowledge.hours;
    }
    if (/servicing|motorcycle servicing|bike servicing|routine service/i.test(q)) {
      return chatbotKnowledge.servicing;
    }

    // Default Fallback
    return {
      text: "For immediate assistance or specialized repairs, please contact Bishnu Motorcycle Workshop directly at 9857032691 or visit us in Butwal-12, Tamnagar, Rupandehi, Nepal.",
      actions: [
        { label: "Call: 9857032691", href: "tel:+9779857032691", isTel: true },
        { label: "Get Directions", href: "https://maps.app.goo.gl/6HdbfaxdrhAWPo7e9", isMap: true }
      ]
    };
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendBotMessage(responseObj) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot';

    const textDiv = document.createElement('div');
    textDiv.className = 'chat-msg-text';
    textDiv.textContent = responseObj.text;
    msgDiv.appendChild(textDiv);

    if (responseObj.actions && responseObj.actions.length > 0) {
      const actionGroup = document.createElement('div');
      actionGroup.className = 'chat-action-group';

      responseObj.actions.forEach(act => {
        const a = document.createElement('a');
        a.className = 'chat-action-btn';
        a.href = act.href;
        if (!act.isTel) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }

        if (act.isTel) {
          a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> <span>${act.label}</span>`;
        } else {
          a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> <span>${act.label}</span>`;
        }

        actionGroup.appendChild(a);
      });

      msgDiv.appendChild(actionGroup);
    }

    const timeSpan = document.createElement('span');
    timeSpan.className = 'chat-msg-time';
    timeSpan.textContent = formatTime(new Date());
    msgDiv.appendChild(timeSpan);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendUserMessage(text) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user';

    const textDiv = document.createElement('div');
    textDiv.className = 'chat-msg-text';
    textDiv.textContent = text;
    msgDiv.appendChild(textDiv);

    const timeSpan = document.createElement('span');
    timeSpan.className = 'chat-msg-time';
    timeSpan.textContent = formatTime(new Date());
    msgDiv.appendChild(timeSpan);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    if (!chatMessages) return null;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot chat-typing-msg';
    typingDiv.id = 'chat-typing-indicator';
    typingDiv.innerHTML = `<div class="chat-msg-text" style="display:flex; align-items:center; gap:4px; font-style:italic; color:var(--text-muted);"><span style="animation: pulse 1s infinite;">•</span><span style="animation: pulse 1s infinite 0.2s;">•</span><span style="animation: pulse 1s infinite 0.4s;">•</span> <span style="font-size:0.75rem; margin-left:4px;">Workshop's AI is thinking...</span></div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing-indicator');
    if (indicator) indicator.remove();
  }

  async function handleUserQuery(queryText) {
    if (!queryText || !queryText.trim()) return;
    appendUserMessage(queryText);

    showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: queryText }),
      });

      removeTypingIndicator();

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          appendBotMessage({
            text: data.reply,
            actions: [
              { label: "Call: 9857032691", href: "tel:+9779857032691", isTel: true },
              { label: "Get Directions", href: "https://maps.app.goo.gl/6HdbfaxdrhAWPo7e9", isMap: true }
            ]
          });
          return;
        }
      }

      // Fallback if response not ok or no reply
      const fallback = findChatbotResponse(queryText);
      appendBotMessage(fallback);
    } catch (error) {
      console.warn('Gemini AI endpoint error, using local knowledge base:', error);
      removeTypingIndicator();
      const fallback = findChatbotResponse(queryText);
      appendBotMessage(fallback);
    }
  }

  function openChat() {
    if (!chatWindow || !chatToggleBtn) return;
    chatWindow.classList.add('active');
    chatWindow.setAttribute('aria-hidden', 'false');
    chatToggleBtn.classList.add('active');
    chatToggleBtn.setAttribute('aria-expanded', 'true');

    if (!isChatInitialized) {
      isChatInitialized = true;
      appendBotMessage({
        text: "Hello! Welcome to Bishnu Motorcycle Workshop in Butwal-12, Tamnagar, Rupandehi, Nepal. I'm Workshop's AI Assistant. How can I help you today?",
        actions: [
          { label: "Call 9857032691", href: "tel:+9779857032691", isTel: true },
          { label: "Get Directions", href: "https://maps.app.goo.gl/6HdbfaxdrhAWPo7e9", isMap: true }
        ]
      });
    }

    if (chatInput) {
      setTimeout(() => chatInput.focus(), 150);
    }
  }

  function closeChat() {
    if (!chatWindow || !chatToggleBtn) return;
    chatWindow.classList.remove('active');
    chatWindow.setAttribute('aria-hidden', 'true');
    chatToggleBtn.classList.remove('active');
    chatToggleBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleChat() {
    if (chatWindow && chatWindow.classList.contains('active')) {
      closeChat();
    } else {
      openChat();
    }
  }

  if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', closeChat);

  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!chatInput) return;
      const val = chatInput.value;
      if (val.trim()) {
        handleUserQuery(val);
        chatInput.value = '';
      }
    });
  }

  chatSuggestBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const q = this.getAttribute('data-question') || this.textContent;
      handleUserQuery(q);
    });
  });

  // ESC key listener for Chatbot Window
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && chatWindow && chatWindow.classList.contains('active')) {
      closeChat();
    }
  });

});
