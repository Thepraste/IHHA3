# IHHA Paid Family Caregiver Application

Responsive HTML, CSS and vanilla JavaScript multi-step application based on the supplied five-page IHHA PDF.

## Run locally

Open `index.html` in a modern browser, or serve this folder with a local static server. No build step or package installation is required.

## Files

- `index.html` — application structure and form fields
- `styles.css` — PDF-inspired navy/white/yellow styling and responsive layout
- `app.js` — step navigation, required-field validation, conditional doctor fields and API submission
- `assets/` — supplied IHHA logo and caregiver promotional image

## Backend integration required before launch

1. In `app.js`, set `API_URL` to the agency's HTTPS application endpoint.
2. Confirm the endpoint's expected JSON property names, authentication requirements, response format and error format with the agency's API documentation.
3. Confirm whether the API accepts SSNs in the current format and whether the endpoint requires a different secure transport or encryption scheme.
4. Test successful submissions, validation errors, duplicate submissions, network failures and mobile devices in a staging environment.

This prototype does not persist applicant data in local storage or session storage. Do not launch real collection of SSNs, dates of birth or insurance identifiers until the agency confirms its secure API, access controls, retention policy and privacy requirements. The browser-side checks improve usability but must be repeated and enforced by the backend.

## Notes from the supplied PDF

- Step 1: initial client first and last name.
- Step 2: caregiver information and background-check authorization.
- Step 3: full client information, insurance, Medicaid/primary-care questions, caseworker details and final declaration.
- Michigan (`MI`) is prefilled as the state, matching the supplied draft.
- The supplied PDF says `$18 and up per hour`; a separate promotional image says `$19.00/hr`. The form uses the PDF wording pending agency confirmation.
