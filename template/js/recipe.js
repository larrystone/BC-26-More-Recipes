$('.button-collapse').sideNav({
  menuWidth: 200,
  edge: 'left',
  closeOnClick: true,
  draggable: true,
});

$('.showInfo').on('click', () => {
  window.location.href = 'recipe_info.html';
});


$('#bookmark').on('click', (e) => {
  if ($(e.target).html() === 'star_border') {
    $(e.target).html('star');
  } else {
    $(e.target).html('star_border');
  }
});

$('#like').on('click', () => {
  const likes = +$('#likes').text() + 1;
  $('#likes').text(likes);
});

$('#dislike').on('click', () => {
  const likes = +$('#dislikes').text() + 1;
  $('#dislikes').text(likes);
});

$(() => {
  setTimeout(() => {
    $('#preload_reviews').css('display', 'none');
    $('#reviews').removeClass('hide');
  }, 3000);
});
