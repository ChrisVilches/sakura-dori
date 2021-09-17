// Script for index page.

function disableFormButton() {
  var $form = $('#message-search-form');
  $form.find('button[type=submit]').prop('disabled', true);
}

$(document).ready(function () {
  // Disable button when form is sending.
  $('#message-search-form').on('submit', disableFormButton);

  // Disable button when clicking on a connected user.
  $('.recent-users-list a').on('click', disableFormButton);
});
