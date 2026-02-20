document.addEventListener('DOMContentLoaded', () => {
    // Сколько элементов показывать изначально (можно переопределять через data-visible на контейнере)
    const DEFAULT_VISIBLE = 2;

    // Находим все блоки с галереями
    const blocks = document.querySelectorAll('.reviews__fotos');

    blocks.forEach(block => {
        const gallery = block.querySelector('.reviews__gallery');
        const btn = block.querySelector('.reviews__show-all');

        if (!gallery || !btn) return; // если чего-то нет — пропускаем этот блок

        // Можно задать в HTML: <div class="reviews__fotos" data-visible="3"> чтобы подправить для конкретного блока
        const visibleCount = parseInt(block.dataset.visible, 10) || DEFAULT_VISIBLE;

        const items = Array.from(gallery.children); // li элементы

        // Инициализация: скрываем элементы начиная с visibleCount
        items.forEach((li, idx) => {
            if (idx >= visibleCount) {
                li.classList.add('hidden');
            } else {
                li.classList.remove('hidden');
            }
            li.classList.remove('fade-in'); // чистим на случай повторного клика
        });

        // Устанавливаем начальный текст кнопки в зависимости от наличия скрытых элементов
        const SHOW_TEXT = 'Смотреть все фото';
        const HIDE_TEXT = 'Скрыть фото';
        btn.textContent = gallery.querySelector('.hidden') ? SHOW_TEXT : HIDE_TEXT;

        // Обработчик переключения для конкретного блока
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            const hasHiddenNow = gallery.querySelector('.hidden');

            if (hasHiddenNow) {
                // Показать все
                items.forEach(li => {
                    li.classList.remove('hidden');
                    li.classList.add('fade-in');
                });
                btn.textContent = HIDE_TEXT;
            } else {
                // Спрятать обратно: все элементы начиная с visibleCount
                items.forEach((li, idx) => {
                    if (idx >= visibleCount) {
                        li.classList.add('hidden');
                        li.classList.remove('fade-in');
                    }
                });
                btn.textContent = SHOW_TEXT;
                // опционально: прокинуть фокус к началу галереи
                gallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
});

// ======================

    const showMoreButton = document.querySelector('.reviews__button');
    const hiddenReviews = document.querySelectorAll('.info-hidden');
    
    showMoreButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        hiddenReviews.forEach((review, index) => {
            // Добавляем небольшую задержку для анимации
            setTimeout(() => {
                review.classList.remove('info-hidden');
                review.style.opacity = '0';
                review.style.transition = 'opacity 0.5s ease';
                
                // Запускаем анимацию появления
                setTimeout(() => {
                    review.style.opacity = '1';
                }, 50);
            }, index * 100);
        });
        
        // Скрываем кнопку
        this.style.display = 'none';
});