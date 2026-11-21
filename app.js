/* IHHA caregiver application
 * Set API_URL to the agency's HTTPS endpoint when the API documentation is supplied.
 * This front end deliberately does not save SSNs or other form data in browser storage.
 */
const API_URL = ""; // Example: https://api.agency.com/applications/caregiver

const form = document.querySelector("#caregiver-form");
const steps = [...document.querySelectorAll(".form-step")];
const progressFill = document.querySelector("#progress-fill");
const stepLabel = document.querySelector("#step-label");
const progressPercent = document.querySelector("#progress-percent");
const progressTrack = document.querySelector(".progress-track");
const stepNames = ["Client information", "Caregiver information", "Client details"];
const errorBox = document.querySelector("#form-error");
const submitButton = document.querySelector("#submit-button");
const successPanel = document.querySelector("#success-panel");
let currentStep = 0;

function showError(message = "Please complete all required fields correctly before continuing.") {
  errorBox.textContent = message;
  errorBox.hidden = false;
  errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
}
function clearError() { errorBox.hidden = true; errorBox.textContent = ""; }
function updateStep() {
  steps.forEach((step, index) => {
    const active = index === currentStep;
    step.hidden = !active;
    step.classList.toggle("active", active);
  });
  const percent = Math.round(((currentStep + 1) / steps.length) * 100);
  const sectionNav = document.querySelector("#section-nav");
  const headerTitle = document.querySelector("#header-title");
  sectionNav.hidden = currentStep === 0;
  headerTitle.hidden = currentStep !== 0;
  document.querySelectorAll(".intro-copy").forEach(paragraph => { paragraph.hidden = currentStep !== 0; });
  // Remove the entire intro card on Sections 2 and 3 so no empty white panel remains below the navigation.
  document.querySelector("#intro").hidden = currentStep !== 0;
  // Keep the main promotional heading and hourly-rate badge on Section 1 only.
  document.querySelector("#intro h1").hidden = currentStep !== 0;
  document.querySelector("#intro .rate").hidden = currentStep !== 0;
  progressFill.style.width = `${percent}%`;
  stepLabel.textContent = `Section ${currentStep + 1} of ${steps.length} · ${stepNames[currentStep]}`;
  progressTrack.setAttribute("aria-valuenow", String(percent));
  progressPercent.textContent = `${percent}%`;
  clearError();
  document.querySelector(".application-area").scrollIntoView({ behavior: "smooth", block: "start" });
}
function validateStep(index) {
  const controls = [...steps[index].querySelectorAll("input, select, textarea")];
  let firstInvalid = null;
  for (const control of controls) {
    if (control.disabled || control.closest("[hidden]")) continue;
    if (!control.checkValidity()) {
      firstInvalid = control;
      control.reportValidity();
      break;
    }
  }
  if (firstInvalid) {
    firstInvalid.focus({ preventScroll: false });
    showError("Some information is missing or invalid. Please check the highlighted field.");
    return false;
  }
  return true;
}

document.querySelectorAll("[data-next]").forEach(button => button.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;
  if (currentStep < steps.length - 1) { currentStep += 1; updateStep(); }
}));
document.querySelectorAll("[data-prev]").forEach(button => button.addEventListener("click", () => {
  if (currentStep > 0) { currentStep -= 1; updateStep(); }
}));

// The doctor details are requested only when the applicant answers Yes.
form.querySelectorAll('input[name="hasPrimaryDoctor"]').forEach(radio => radio.addEventListener("change", event => {
  const show = event.target.value === "Yes";
  document.querySelectorAll(".doctor-field").forEach(field => {
    field.hidden = !show;
    const input = field.querySelector("input");
    input.required = false;
    if (!show) input.value = "";
  });
}));

// Light formatting for US SSN input. The field remains masked on screen.
["caregiverSsn", "clientSsn"].forEach(name => {
  const input = form.elements[name];
  input.addEventListener("input", () => {
    const digits = input.value.replace(/\D/g, "").slice(0, 9);
    input.value = digits.length > 5 ? `${digits.slice(0,3)}-${digits.slice(3,5)}-${digits.slice(5)}` : digits.length > 3 ? `${digits.slice(0,3)}-${digits.slice(3)}` : digits;
  });
});

function collectFormData() {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
    else data[key] = value;
  });
  return data;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!validateStep(currentStep)) return;
  if (!API_URL) {
    showError("Online application submission is not available right now. Your application has not been sent. Please contact our office at 248 275 1102 for assistance.");
    return;
  }
  if (!API_URL.startsWith("https://")) {
    showError("For security, application details must be submitted through a secure HTTPS endpoint.");
    return;
  }
  submitButton.disabled = true;
  submitButton.textContent = "Submitting…";
  clearError();
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(collectFormData())
    });
    if (!response.ok) throw new Error(`Submission failed (${response.status}).`);
    steps.forEach(step => step.hidden = true);
    document.querySelector(".progress-wrap").hidden = true;
    document.querySelector("#intro").hidden = true;
    successPanel.hidden = false;
    successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    showError(error.message || "We could not submit your application. Please try again or contact the agency.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Application";
  }
});

updateStep();
