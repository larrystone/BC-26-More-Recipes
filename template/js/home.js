$('.login').on('click', () => {
  location.href = '#top';
  $('#signin').removeClass('hide');
  $('#signup').addClass('hide');
  $('.gone').addClass('hide');
});

$('.signup').on('click', () => {
  location.href = '#top';
  $('#signup').removeClass('hide');
  $('#signin').addClass('hide');
  $('.gone').addClass('hide');
});

$('.card-item').on('click', () => {
  location.href = '#top';
  $('#signup').removeClass('hide');
});

$('.parallax').parallax();

$('.button-collapse').sideNav();

$('.go').on('click', (e) => {
  e.preventDefault();
  window.location.href = 'dashboard.html';
});
