/**
 * PetSathi Authentication Script (auth.js)
 * Handles Password Visibility Toggles, Soft Custom Select Dropdowns,
 * and Mandatory Consent Validation
 */
document.addEventListener("DOMContentLoaded", function () {
  // 1. Password Visibility Toggle
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", function () {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");

      const icon = toggleBtn.querySelector("i");
      if (icon) {
        if (isPassword) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }

      toggleBtn.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );
      toggleBtn.setAttribute(
        "title",
        isPassword ? "Hide password" : "Show password"
      );
    });
  }

  // 2. Soft Custom Role Select Dropdown
  initCustomSelects();

  // 3. Mandatory Privacy Policy & Terms Checkbox Validation
  const authForm = document.querySelector(".auth-form");
  const termsCheckbox = document.getElementById("termsConsent");
  const termsError = document.getElementById("termsError");

  if (authForm && termsCheckbox) {
    // Clear error dynamically when the checkbox is checked
    termsCheckbox.addEventListener("change", function () {
      if (termsCheckbox.checked) {
        if (termsError) {
          termsError.style.display = "none";
        }
        termsCheckbox.setCustomValidity("");
      }
    });

    authForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Check mandatory consent checkbox
      if (!termsCheckbox.checked) {
        if (termsError) {
          termsError.style.display = "flex";
        }
        termsCheckbox.focus();
        termsCheckbox.setCustomValidity(
          "Please accept the Privacy Policy and Terms & Conditions to continue."
        );
        return false;
      }

      // Checkbox is checked; clear error
      if (termsError) {
        termsError.style.display = "none";
      }
      termsCheckbox.setCustomValidity("");

      // Proceed with existing PetSathi preview notification
      alert(
        "This is a UI preview. Account functionality will be available in a future development level."
      );
    });
  }
});

/**
 * Initializes soft, accessible custom select dropdowns
 * Matches PetSathi header dropdown styling and behaviors
 */
function initCustomSelects() {
  const wrappers = document.querySelectorAll(".custom-select-wrapper");

  wrappers.forEach(function (wrapper) {
    const trigger = wrapper.querySelector(".custom-select-trigger");
    const dropdown = wrapper.querySelector(".custom-select-dropdown");
    const options = wrapper.querySelectorAll(".custom-select-option");
    const leadIcon = trigger ? trigger.querySelector(".select-lead-icon") : null;
    const labelSpan = trigger ? trigger.querySelector(".select-label") : null;
    const hiddenSelect = wrapper.querySelector("select");

    if (!trigger || !dropdown || !options.length) return;

    function openDropdown() {
      // Close other open dropdowns
      document.querySelectorAll(".custom-select-wrapper.is-open").forEach(function (other) {
        if (other !== wrapper) {
          other.classList.remove("is-open");
          const otherTrigger = other.querySelector(".custom-select-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });

      wrapper.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");

      const selectedOption = wrapper.querySelector(".custom-select-option.is-selected");
      if (selectedOption) {
        selectedOption.focus();
      }
    }

    function closeDropdown() {
      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function selectOption(opt) {
      const val = opt.getAttribute("data-value");
      const iconClass = opt.getAttribute("data-icon");
      const titleSpan = opt.querySelector(".option-title");
      const title = titleSpan ? titleSpan.textContent.trim() : opt.textContent.trim();

      // Update options selection state
      options.forEach(function (o) {
        const isTarget = o === opt;
        o.classList.toggle("is-selected", isTarget);
        o.setAttribute("aria-selected", isTarget ? "true" : "false");
      });

      // Update trigger label & leading icon
      if (labelSpan) labelSpan.textContent = title;
      if (leadIcon && iconClass) {
        leadIcon.className = "fa-solid " + iconClass + " select-lead-icon";
      }

      // Update native select and dispatch change event
      if (hiddenSelect) {
        hiddenSelect.value = val;
        hiddenSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }

      closeDropdown();
      trigger.focus();
    }

    // Toggle on trigger click
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (wrapper.classList.contains("is-open")) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Option interactions
    options.forEach(function (opt, index) {
      opt.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        selectOption(opt);
      });

      opt.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectOption(opt);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = options[index + 1] || options[0];
          next.focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = options[index - 1] || options[options.length - 1];
          prev.focus();
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeDropdown();
          trigger.focus();
        }
      });
    });

    // Keyboard navigation on trigger button
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDropdown();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeDropdown();
      }
    });

    // Synchronize if native select is changed programmatically
    if (hiddenSelect) {
      hiddenSelect.addEventListener("change", function () {
        const currentVal = hiddenSelect.value;
        const matchingOpt = Array.from(options).find(function (o) {
          return o.getAttribute("data-value") === currentVal;
        });
        if (matchingOpt && !matchingOpt.classList.contains("is-selected")) {
          selectOption(matchingOpt);
        }
      });
    }
  });

  // Global click to close open dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".custom-select-wrapper")) {
      document.querySelectorAll(".custom-select-wrapper.is-open").forEach(function (w) {
        w.classList.remove("is-open");
        const trig = w.querySelector(".custom-select-trigger");
        if (trig) trig.setAttribute("aria-expanded", "false");
      });
    }
  });
}
