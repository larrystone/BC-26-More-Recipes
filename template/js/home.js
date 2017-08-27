$('.login').on('click', () => {
  $('#signin').removeClass('hide');
  $('#signup').addClass('hide');
  $('.gone').addClass('hide');
});

$('.signup').on('click', () => {
  $('#signup').removeClass('hide');
  $('#signin').addClass('hide');
  $('.gone').addClass('hide');
});

$('.slider').slider({ interval: 2000 });

$('.go').on('click', (e) => {
  e.preventDefault();
  window.location.href = 'recipes.html';
});
