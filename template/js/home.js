$('.login').on('click', (e) => {
  $('#signin').removeClass('hide');
  $('#signup').addClass('hide');
  $('#intro').addClass('hide');
});

$('.signup').on('click', (e) => {
  $('#signup').removeClass('hide');
  $('#signin').addClass('hide');
  $('#intro').addClass('hide');
});

$('.button-collapse').sideNav();

$('.carousel.carousel-slider').carousel({ fullWidth: true });
