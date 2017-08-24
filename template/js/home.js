$('.login').on('click', function (e) {

    $("#signin").removeClass('hide');
    $("#signup").addClass('hide');
    $("#intro").addClass('hide');
});

$('.signup').on('click', function (e) {

    $("#signup").removeClass('hide');
    $("#signin").addClass('hide');
    $("#intro").addClass('hide');
});

$(".button-collapse").sideNav();

$('.carousel.carousel-slider').carousel({fullWidth: true});