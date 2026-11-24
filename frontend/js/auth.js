/**
 * PetSathi Authentication Script (auth.js)
 * Handles Password Visibility Toggles & Mandatory Consent Validation
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

  // 2. Mandatory Privacy Policy & Terms Checkbox Validation
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
