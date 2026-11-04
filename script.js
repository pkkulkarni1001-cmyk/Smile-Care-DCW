/* =========================================================
   SMILECARE DENTAL STUDIO — INTERACTIONS
   ========================================================= */

"use strict";

const WHATSAPP_NUMBER = "917498796538";

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
  } else {
    navLinks.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
  }
});

// Close mobile menu when a link is selected.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close menu with Escape key.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// If the viewport grows to desktop size, reset the mobile menu state.
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

// Reveal elements as they enter the viewport.
// Fallback keeps content visible if IntersectionObserver is unavailable.
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("active"));
}

// Appointment enquiry form.
// This opens WhatsApp with the visitor's enquiry; it does not store or confirm bookings.
const appointmentForm = document.getElementById("appointmentForm");
const formFeedback = document.getElementById("formFeedback");

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent = "";

  if (!appointmentForm.reportValidity()) return;

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();
  const consent = document.getElementById("consent").checked;

  if (name.length < 2) {
    formFeedback.textContent = "Please enter a name with at least 2 characters.";
    document.getElementById("name").focus();
    return;
  }

  const phonePattern = /^[0-9+\s()-]{10,16}$/;

  if (!phonePattern.test(phone)) {
    formFeedback.textContent = "Please enter a valid phone number.";
    document.getElementById("phone").focus();
    return;
  }

  if (!service) {
    formFeedback.textContent = "Please choose a service.";
    document.getElementById("service").focus();
    return;
  }

  if (!consent) {
    formFeedback.textContent = "Please confirm that you agree to share these details via WhatsApp.";
    document.getElementById("consent").focus();
    return;
  }

  const whatsappMessage = [
    "Hello SmileCare Dental Studio, I would like to make an enquiry.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Message: ${message || "No additional message."}`,
    "",
    "Please contact me regarding availability."
  ].join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const newWindow = window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );

  if (!newWindow) {
    formFeedback.textContent = "Your browser blocked the WhatsApp window. Please allow pop-ups or use the WhatsApp button.";
    return;
  }

  formFeedback.textContent = "Your enquiry is ready in WhatsApp. Review it and press Send.";
});

// Add a subtle active state to the nav link for the section in view.
const observedSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeId = entry.target.id;

      navLinks.querySelectorAll("a[href^='#']").forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${activeId}`
        );
      });
    });
  }, {
    rootMargin: "-35% 0px -55% 0px"
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}