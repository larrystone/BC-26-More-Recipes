$('.button-collapse').sideNav({
  menuWidth: 200,
  edge: 'left',
  closeOnClick: true,
  draggable: true,
});

$('.modal').modal();

$('.show_recipe_info').on('click', () => {
  window.location.href = 'recipe_info.html';
});

$('.delete_recipe').on('click', (e) => {
  $(e.target).closest('div .col').remove();
});

$('#add_ingredient').on('click', (e) => {
  $(e.target).siblings('ul').append(`
    <div class="input-field col s12">
      <li><label for="ingredient2"> Enter ingredient</label>
        <input type="text" class="validate" name="ingredient2" id="ingredient2"/></li>
    </div>`);
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
