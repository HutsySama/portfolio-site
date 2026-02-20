// Запускаем код, когда вся страница загружена
document.addEventListener('DOMContentLoaded', () => {
    // Находим кнопку "Показать ещё"
    const newsButton = document.querySelector('.news__button');
    // Находим все скрытые новости
    const hiddenNewsItems = document.querySelectorAll('.news__item.news-hidden');

    // Если на странице нет кнопки или скрытых новостей — выходим
    if (!newsButton || !hiddenNewsItems.length) return;

    // Вешаем обработчик клика на кнопку
    newsButton.addEventListener('click', (e) => {
        e.preventDefault(); // отменяем действие ссылки (чтобы не кидало вверх страницы)

        // Убираем класс .news-hidden со всех скрытых новостей
        hiddenNewsItems.forEach((item) => {
            item.classList.remove('news-hidden'); // показываем карточку
            item.classList.add('fade-in');        // плавное появление
        });

        // Скрываем кнопку после клика
        newsButton.style.display = 'none';
    });
});