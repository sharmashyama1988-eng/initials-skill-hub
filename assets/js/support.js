/**
 * Initials Skill Hub - Support & Helpdesk JavaScript
 * Author: Ankit Rajbhar
 * Handles FAQ accordions, ticket generation, SLA notifications, and validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- Accordion Logic ---
  const accordionButtons = document.querySelectorAll('.faq-toggle-btn');

  accordionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls');
      const targetContent = document.getElementById(targetId);
      const icon = btn.querySelector('.faq-icon');

      // Close all other accordion items for clean single-view accordion behavior
      accordionButtons.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherTargetId = otherBtn.getAttribute('aria-controls');
          const otherTargetContent = document.getElementById(otherTargetId);
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherTargetContent) {
            otherTargetContent.classList.remove('open');
          }
          if (otherIcon) {
            otherIcon.classList.remove('rotate-180', 'text-indigo-400');
            otherIcon.classList.add('text-slate-400');
          }
        }
      });

      // Toggle current
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (targetContent) targetContent.classList.remove('open');
        if (icon) {
          icon.classList.remove('rotate-180', 'text-indigo-400');
          icon.classList.add('text-slate-400');
        }
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (targetContent) targetContent.classList.add('open');
        if (icon) {
          icon.classList.add('rotate-180', 'text-indigo-400');
          icon.classList.remove('text-slate-400');
        }
      }
    });
  });

  // --- Support Ticket Submission & Validation ---
  const ticketForm = document.getElementById('support-ticket-form');
  const ticketResultBox = document.getElementById('ticket-result-box');
  const copyTicketBtn = document.getElementById('btn-copy-ticket');

  if (ticketForm) {
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('ticket-name')?.value.trim();
      const email = document.getElementById('ticket-email')?.value.trim();
      const phone = document.getElementById('ticket-phone')?.value.trim();
      const category = document.getElementById('ticket-category')?.value;
      const priority = document.getElementById('ticket-priority')?.value || 'Normal';
      const subject = document.getElementById('ticket-subject')?.value.trim();
      const message = document.getElementById('ticket-message')?.value.trim();

      if (!name || !email || !phone || !category || !subject || !message) {
        showToast('Please complete all required fields.', 'warning');
        return;
      }

      // Generate Random Ticket ID
      const ticketNumber = 'ISH-TK-' + Math.floor(10000 + Math.random() * 90000);
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';

      // Fill in Confirmation details
      const idElement = document.getElementById('display-ticket-id');
      const timeElement = document.getElementById('display-ticket-time');
      const categoryElement = document.getElementById('display-ticket-category');
      const priorityElement = document.getElementById('display-ticket-priority');
      const subjectElement = document.getElementById('display-ticket-subject');
      const waButton = document.getElementById('ticket-whatsapp-button');

      if (idElement) idElement.textContent = ticketNumber;
      if (timeElement) timeElement.textContent = currentTime;
      if (categoryElement) categoryElement.textContent = category;
      if (priorityElement) {
        priorityElement.textContent = priority;
        priorityElement.className = `px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          priority === 'Urgent'
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            : priority === 'High'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        }`;
      }
      if (subjectElement) subjectElement.textContent = subject;

      // Construct instant WhatsApp sync link
      const waBody = encodeURIComponent(
        `*New Support Inquiry - Initials Skill Hub*\n` +
        `*Ticket Ref:* ${ticketNumber}\n` +
        `*Name:* ${name}\n` +
        `*Category:* ${category}\n` +
        `*Priority:* ${priority}\n` +
        `*Phone:* ${phone}\n` +
        `*Email:* ${email}\n` +
        `*Subject:* ${subject}\n\n` +
        `*Message:* ${message}`
      );

      if (waButton) {
        waButton.href = `https://wa.me/918527868276?text=${waBody}`;
      }

      // Transition views
      ticketForm.classList.add('hidden');
      if (ticketResultBox) {
        ticketResultBox.classList.remove('hidden');
        ticketResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Dispatch to Formspree Endpoint (Direct Live Delivery to ankitrajbhar85278@gmail.com)
      fetch('https://formspree.io/f/mwllakrl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form_type: 'Support Ticket Dispatch',
          ticket_id: ticketNumber,
          client_name: name,
          client_email: email,
          client_phone: phone,
          category: category,
          priority: priority,
          subject: subject,
          description: message,
          timestamp: currentTime,
        }),
      }).then((res) => {
        if (res.ok) {
          console.log('[Formspree] Ticket delivered successfully to ankitrajbhar85278@gmail.com');
        }
      }).catch((err) => {
        console.warn('[Formspree] Dispatch warning:', err);
      });

      showToast(`Support Ticket ${ticketNumber} dispatched directly via Formspree!`, 'success');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Copy Ticket reference handler
  if (copyTicketBtn) {
    copyTicketBtn.addEventListener('click', () => {
      const ticketId = document.getElementById('display-ticket-id')?.textContent || '';
      if (ticketId) {
        navigator.clipboard.writeText(ticketId).then(() => {
          showToast(`Copied reference ${ticketId} to clipboard!`, 'info');
        }).catch(() => {
          showToast(`Reference ID: ${ticketId}`, 'info');
        });
      }
    });
  }

  // Reset / Create Another Ticket button
  const resetTicketBtn = document.getElementById('btn-reset-ticket');
  if (resetTicketBtn && ticketForm && ticketResultBox) {
    resetTicketBtn.addEventListener('click', () => {
      ticketForm.reset();
      ticketResultBox.classList.add('hidden');
      ticketForm.classList.remove('hidden');
      ticketForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
