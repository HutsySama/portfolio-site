(function () {
    const items = document.querySelectorAll('.accordion__item');

    items.forEach(item => {
        const top = item.querySelector('.accordion__top');
        const content = item.querySelector('.accordion__content');

        top.addEventListener('click', (e) => {
            e.preventDefault()
            const isOpen = item.classList.contains('active');

            // закрываем все вкладки
            items.forEach(el => {
                el.classList.remove('active');
                const inner = el.querySelector('.accordion__content');
                inner.style.maxHeight = null;
            });

            // если кликнули на закрытую — открываем её
            if (!isOpen) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
})();