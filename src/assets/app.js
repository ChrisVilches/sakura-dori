import '@js/index.js';
//-import '@js/daterangepicker.js';

/** Initialize tooltips. */
$(document).ready(() => {
  $('[data-bs-toggle="tooltip"]').each((_, tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
});
