$(document).ready(function() {
  $('.input').on('focus', function() {
    $('.user').addClass('clicked');
  });
  $('.user').on('submit', function(e) {
    e.preventDefault();
    $('.user').removeClass('clicked').addClass('loading');
  });
});