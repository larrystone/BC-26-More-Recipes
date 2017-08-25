$('.button-collapse').sideNav({
  menuWidth: 200,
  edge: 'left',
  closeOnClick: true,
  draggable: true,
});

$('.showInfo').on('click', () => {
  window.location.href = 'recipe_info.html';
});
