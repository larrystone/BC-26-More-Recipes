const hideIntro = () => {
  $('#intro').addClass('hide');
};

$('.login').on('click', () => {
  $('#signin').removeClass('hide');
  $('#signup').addClass('hide');
  hideIntro();
});

$('.signup').on('click', () => {
  $('#signup').removeClass('hide');
  $('#signin').addClass('hide');
  hideIntro();
});

