// data-baieztatu duten formularioek baieztapena eskatzen dute bidali aurretik
document.addEventListener('submit', function (ekitaldia) {
    var mezua = ekitaldia.target.getAttribute('data-baieztatu');
    if (mezua && !confirm(mezua)) {
        ekitaldia.preventDefault();
    }
});
