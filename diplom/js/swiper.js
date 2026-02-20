const swiper = new Swiper('.special__swiper', {
    spaceBetween: 0,
    slidesPerView: 1,
    // If we need pagination
    pagination: {
        el: '.special__pagination',
        type: 'fraction'
    },

    // Navigation arrows
    navigation: {
        nextEl: '.special__next',
        prevEl: '.special__prev',
    },
});