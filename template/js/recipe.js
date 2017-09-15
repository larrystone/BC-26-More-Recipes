$('.modal').modal();

$('.show_recipe_info').on('click', () => {
  window.location.href = 'recipe_details.html';
});

$('.delete_recipe').on('click', (e) => {
  $(e.target).closest('div .col .s6').remove();
});

$('#add_ingredient').on('click', (e) => {
  $(e.target).siblings('ul').append(`
    <div class="input-field col s12">
      <li><label for="ingredient2"> Enter ingredient</label>
        <input type="text" class="validate" 
        name="ingredient2" id="ingredient2"/></li>
    </div>`);
});

$('#bookmark').on('click', (e) => {
  if ($(e.target).html() === 'star_border') {
    $(e.target).html('star');
    $(e.target).addClass('yellow-text');
  } else {
    $(e.target).html('star_border');
    $(e.target).removeClass('yellow-text');
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
    $('#preload').css('display', 'none');
    $('.load').removeClass('hide');
  }, 2000);
});

$('.edit_recipe').on('click', () => {
  $('div > #title').html('Edit Recipe');
});

$('#create_recipe').on('click', () => {
  $('div > #title').html('Create New Recipe');
});

$('.parallax').parallax();

$('.button-collapse').sideNav();
