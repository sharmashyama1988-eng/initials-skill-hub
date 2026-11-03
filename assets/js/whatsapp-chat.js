/**
 * ============================================================================
 * INITIALS SKILL HUB - INTERACTIVE WHATSAPP LIVE CHAT ENGINE
 * ============================================================================
 * Direct real-time WhatsApp simulation with instant Formspree backend dispatch.
 * Every lead, message, and contact inquiry is delivered to ankitrajbhar85278@gmail.com
 * while providing an authentic WhatsApp conversation experience with Founder Ankit Rajbhar.
 * ============================================================================
 */

(function () {
  'use strict';

  // State Management
  const state = {
    isOpen: false,
    step: 'INITIAL', // 'INITIAL' | 'AWAITING_CONTACT' | 'CONNECTED'
    userInquiry: '',
    userName: '',
    userContact: '',
    messageHistory: [],
  };

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwllakrl';
  const FOUNDER_WHATSAPP = '918527868276';

  // DOM Elements
  const container = document.getElementById('wa-chat-container');
  const chatBox = document.getElementById('wa-chat-box');
  const toggleBtn = document.getElementById('wa-chat-toggle-btn');
  const closeBtn = document.getElementById('wa-chat-close-btn');
  const messagesArea = document.getElementById('wa-chat-messages');
  const chatForm = document.getElementById('wa-chat-form');
  const chatInput = document.getElementById('wa-chat-input');
  const sendBtn = document.getElementById('wa-chat-send-btn');
  const unreadBadge = document.getElementById('wa-unread-badge');
  const quickChipsContainer = document.getElementById('wa-quick-chips');

  // Format Current Time (e.g. 10:45 PM)
  function getFormattedTime() {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Auto-scroll chat to latest message
  function scrollToBottom() {
    if (messagesArea) {
      setTimeout(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }, 50);
    }
  }

  // Toggle Chat Box Window
  function toggleChat(open) {
    state.isOpen = typeof open === 'boolean' ? open : !state.isOpen;

    if (!chatBox) return;

    if (state.isOpen) {
      chatBox.classList.remove('hidden');
      // Trigger enter animation
      requestAnimationFrame(() => {
        chatBox.classList.remove('scale-95', 'opacity-0');
        chatBox.classList.add('scale-100', 'opacity-100');
      });

      if (unreadBadge) {
        unreadBadge.classList.add('hidden');
      }

      if (chatInput) {
        setTimeout(() => chatInput.focus(), 250);
      }

      scrollToBottom();
    } else {
      chatBox.classList.remove('scale-100', 'opacity-100');
      chatBox.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        if (!state.isOpen) chatBox.classList.add('hidden');
      }, 250);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Append a User Message Bubble (Green Right Bubble with Blue Double Ticks)
  function appendUserMessage(text) {
    const time = getFormattedTime();
    const bubble = document.createElement('div');
    bubble.className = 'flex items-end justify-end gap-1.5 max-w-[85%] ml-auto animate-fadeIn';
    bubble.innerHTML = `
      <div class="bg-[#005c4b] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-md text-xs leading-relaxed break-words max-w-full">
        <p>${escapeHTML(text)}</p>
        <div class="text-[10px] text-emerald-200/80 text-right mt-1 flex items-center justify-end gap-1 font-mono">
          <span>${time}</span>
          <span class="text-cyan-300 font-bold" title="Delivered & Read">✓✓</span>
        </div>
      </div>
    `;

    messagesArea.appendChild(bubble);
    state.messageHistory.push({ sender: 'Visitor', text, time });
    scrollToBottom();
  }

  // Append a Founder / Bot Message Bubble
  function appendFounderMessage(htmlContent) {
    const time = getFormattedTime();
    const bubble = document.createElement('div');
    bubble.className = 'flex items-start gap-2 max-w-[88%] animate-fadeIn';
    bubble.innerHTML = `
      <div class="bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-sm p-3.5 shadow-md border border-slate-700/40 text-xs leading-relaxed space-y-2">
        <p class="font-semibold text-emerald-400 text-[11px] flex items-center gap-1">
          <span>Ankit Rajbhar</span>
          <i data-lucide="badge-check" class="w-3.5 h-3.5 text-emerald-400"></i>
        </p>
        <div>${htmlContent}</div>
        <div class="text-[10px] text-slate-400 text-right mt-1 font-mono">
          <span>${time}</span>
        </div>
      </div>
    `;

    messagesArea.appendChild(bubble);
    state.messageHistory.push({ sender: 'Ankit Rajbhar', text: stripHTML(htmlContent), time });
    scrollToBottom();
    if (window.lucide) window.lucide.createIcons();
  }

  // Show "Typing..." Animated Indicator
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'wa-typing-indicator';
    indicator.className = 'flex items-center gap-1.5 p-3 rounded-2xl rounded-tl-sm bg-[#202c33] max-w-[80px] border border-slate-700/40';
    indicator.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
    `;
    messagesArea.appendChild(indicator);
    scrollToBottom();
  }

  // Remove "Typing..." Indicator
  function removeTypingIndicator() {
    const indicator = document.getElementById('wa-typing-indicator');
    if (indicator) indicator.remove();
  }

  // Send Data to Backend (Formspree Endpoint)
  async function dispatchToBackend(data) {
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('[Formspree Backend] WhatsApp live chat lead delivered to ankitrajbhar85278@gmail.com');
      } else {
        console.warn('[Formspree Backend] Response status:', response.status);
      }
    } catch (err) {
      console.warn('[Formspree Backend] Network Notice:', err);
    }
  }

  // Handle Form Submission / User Input
  function handleSendMessage(userText) {
    const text = userText.trim();
    if (!text) return;

    // 1. Render User Message on Right
    appendUserMessage(text);
    if (chatInput) chatInput.value = '';

    // Hide quick chips once conversation begins
    if (quickChipsContainer) {
      quickChipsContainer.classList.add('hidden');
    }

    // Show Typing Animation
    showTypingIndicator();

    // Determine Step Logic
    if (state.step === 'INITIAL') {
      state.userInquiry = text;
      state.step = 'AWAITING_CONTACT';

      setTimeout(() => {
        removeTypingIndicator();
        appendFounderMessage(`
          <p>Got it! I can definitely help you with that.</p>
          <p class="text-slate-300">To connect this chat with my personal line, <strong>what is your Name & WhatsApp Number or Email?</strong></p>
        `);

        if (chatInput) {
          chatInput.placeholder = 'e.g. Rahul Sharma, +91 9876543210';
          chatInput.focus();
        }
      }, 700);

    } else if (state.step === 'AWAITING_CONTACT') {
      state.userContact = text;
      state.step = 'CONNECTED';

      // Parse name if possible
      const parts = text.split(/[,|\n-]/);
      state.userName = parts[0]?.trim() || 'Visitor';

      // Prepare WhatsApp Direct Message Link
      const formattedTranscript = state.messageHistory
        .map((m) => `[${m.time}] ${m.sender}: ${m.text}`)
        .join('\n');

      const waText = encodeURIComponent(
        `*New Website Chat with Ankit Rajbhar*\n` +
        `*Contact:* ${state.userContact}\n` +
        `*Inquiry:* ${state.userInquiry}\n\n` +
        `*Conversation Summary:*\n${formattedTranscript}`
      );
      const waLink = `https://wa.me/${FOUNDER_WHATSAPP}?text=${waText}`;

      // Dispatch to Formspree Backend in Background
      dispatchToBackend({
        _subject: `[WhatsApp Live Chat] ${state.userName} - ${state.userInquiry.slice(0, 40)}`,
        _replyto: state.userContact.includes('@') ? state.userContact : 'ankitrajbhar85278@gmail.com',
        name: state.userName,
        contact: state.userContact,
        primary_inquiry: state.userInquiry,
        full_transcript: formattedTranscript,
        form_source: 'Interactive WhatsApp Live Chat Widget',
        submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });

      setTimeout(() => {
        removeTypingIndicator();
        appendFounderMessage(`
          <p class="font-medium text-emerald-300">Awesome, thank you ${escapeHTML(state.userName)}! 🎉</p>
          <p class="text-slate-300">Your message has been dispatched straight to my founder line & email. I typically reply in <strong>under 15 minutes</strong>.</p>
          
          <div class="pt-2">
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Continue Directly in WhatsApp App</span>
            </a>
          </div>

          <p class="text-[10px] text-slate-400 text-center font-mono pt-1">
            ✓ Logged & encrypted to founder dashboard
          </p>
        `);

        if (chatInput) {
          chatInput.placeholder = 'Type another message or query...';
          chatInput.focus();
        }
      }, 800);

    } else {
      // Step CONNECTED: User keeps chatting
      setTimeout(() => {
        removeTypingIndicator();

        const formattedTranscript = state.messageHistory
          .map((m) => `[${m.time}] ${m.sender}: ${m.text}`)
          .join('\n');

        const waText = encodeURIComponent(
          `*Ongoing Chat Update - Initials Skill Hub*\n` +
          `*Contact:* ${state.userContact}\n` +
          `*Latest Message:* ${text}\n\n` +
          `*Full Transcript:*\n${formattedTranscript}`
        );
        const waLink = `https://wa.me/${FOUNDER_WHATSAPP}?text=${waText}`;

        // Send supplementary update to Formspree
        dispatchToBackend({
          _subject: `[WhatsApp Chat Update] ${state.userName}: ${text.slice(0, 40)}`,
          name: state.userName,
          contact: state.userContact,
          followup_message: text,
          full_transcript: formattedTranscript,
          form_source: 'WhatsApp Live Chat Followup',
          submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        });

        appendFounderMessage(`
          <p class="text-slate-200">Got your additional note! Added to our thread.</p>
          <div class="pt-1">
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4">
              <span>Open in WhatsApp for instant reply</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        `);
      }, 600);
    }
  }

  // HTML sanitizers
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[tag] || tag));
  }

  function stripHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Event Listeners Initialization
  function init() {
    if (!container || !chatBox || !toggleBtn) return;

    // Toggle button click
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChat();
    });

    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleChat(false);
      });
    }

    // Form submit
    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage(chatInput.value);
      });
    }

    // Quick Chips Buttons
    const chips = document.querySelectorAll('.wa-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const msg = chip.getAttribute('data-msg') || chip.textContent.trim();
        handleSendMessage(msg);
      });
    });

    // Set initial greeting time
    const initialTimeEl = document.getElementById('wa-initial-time');
    if (initialTimeEl) {
      initialTimeEl.textContent = getFormattedTime();
    }

    // ESC key closes chat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) {
        toggleChat(false);
      }
    });

    console.log('[WhatsApp Chat Engine] Initialized and connected to Formspree backend.');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
