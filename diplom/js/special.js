



// special-controls.js — рабочая версия на основе твоего кода
document.addEventListener('DOMContentLoaded', () => {

    /* ========== УТИЛИТЫ ========== */

    // Читаем число из строки вида "59 990 ₽" или "59990" — возвращаем Number
    const parsePrice = (text = '') => {
        if (typeof text !== 'string') text = String(text);
        const digits = text.replace(/\s/g, '').replace(/[^\d]/g, '');
        return digits ? Number(digits) : 0;
    };

    // Безопасный getText
    const getText = el => (el && el.textContent) ? el.textContent.trim() : '';

    /* ========== SHOW MORE (категории) ========== */
    (function initShowMore() {
        const categoriesList = document.querySelector('.special__categories');
        const btnMore = document.querySelector('.special__more');

        if (!categoriesList || !btnMore) return;

        btnMore.addEventListener('click', (ev) => {
            ev.preventDefault();
            const openClass = 'special__all';
            categoriesList.classList.toggle(openClass);
            btnMore.textContent = categoriesList.classList.contains(openClass) ? 'Скрыть' : 'Показать ещё';
        });
    })();

    /* ========== DROPDOWN сортировки (список вариантов) ========== */
    (function initDropdown() {
        const searchWrapper = document.querySelector('.search'); // контейнер который открывается/закрывается
        const wayTrigger = document.querySelector('.special__way'); // триггер
        const variantsPanel = document.querySelector('.variants'); // панель вариантов
        const wayText = document.querySelector('.way-text'); // где показываем выбранный текст

        // Если нет триггера/панели — ничего не делаем
        if (!wayTrigger || !variantsPanel) return;

        // toggle открытия панели
        wayTrigger.addEventListener('click', (ev) => {
            ev.preventDefault();
            if (searchWrapper) searchWrapper.classList.toggle('search__all');
            variantsPanel.classList.toggle('variants--open');
            wayTrigger.classList.toggle('special__way--open');
        });

        // Закрыть при клике вне панели
        document.addEventListener('click', (ev) => {
            if (!variantsPanel.contains(ev.target) && !wayTrigger.contains(ev.target)) {
                variantsPanel.classList.remove('variants--open');
                wayTrigger.classList.remove('special__way--open');
                if (searchWrapper) searchWrapper.classList.remove('search__all');
            }
        });
    })();

    /* ========== СОРТИРОВКА карточек ========== */
    (function initSorting() {
        const container = document.querySelector('.special__list');
        if (!container) return;

        // собираем карточки с метаданными
        const collectNodes = () => {
            const nodes = Array.from(container.querySelectorAll('.special__item-list'));
            return nodes.map((node, idx) => {
                const priceEl = node.querySelector('.price');
                const price = priceEl ? parsePrice(getText(priceEl)) : (node.dataset.price ? Number(node.dataset.price) : 0);
                const rating = node.dataset.rating ? Number(node.dataset.rating) : (node.dataset.rate ? Number(node.dataset.rate) : 0);
                const date = node.dataset.date ? new Date(node.dataset.date) : (node.dataset.timestamp ? new Date(Number(node.dataset.timestamp)) : null);
                const popularity = node.dataset.popularity ? Number(node.dataset.popularity) : (nodes.length - idx);
                return { node, price, rating, date, popularity, initialIndex: idx };
            });
        };

        // сортируем по ключу
        const sortNodes = (items, key) => {
            const arr = [...items];
            switch (key) {
                case 'price_asc':
                    arr.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    arr.sort((a, b) => b.price - a.price);
                    break;
                case 'rating_desc':
                    arr.sort((a, b) => b.rating - a.rating);
                    break;
                case 'novinki':
                    arr.sort((a, b) => {
                        if (a.date && b.date) return b.date - a.date;
                        return a.initialIndex - b.initialIndex;
                    });
                    break;
                case 'pop':
                default:
                    arr.sort((a, b) => b.popularity - a.popularity);
                    break;
            }
            return arr;
        };

        // переставляем DOM узлы в новом порядке
        const applyOrder = (sortedItems) => {
            const frag = document.createDocumentFragment();
            sortedItems.forEach(item => frag.appendChild(item.node));
            container.innerHTML = '';
            container.appendChild(frag);

            // Если используется Swiper — обновляем его (попытки нескольких вариантов)
            try {
                if (window.swiper && typeof window.swiper.update === 'function') window.swiper.update();
                document.querySelectorAll('.swiper').forEach(s => { if (s.swiper && typeof s.swiper.update === 'function') s.swiper.update(); });
            } catch (err) {
                // silent
            }
        };

        // Популярные варианты сортировки — делегирование: ловим клик по .variants__link
        document.addEventListener('click', (ev) => {
            const variant = ev.target.closest('.variants__link, .variants__item, [data-sort]');
            if (!variant) return;

            // предотвратить переход для ссылок
            if (variant.tagName.toLowerCase() === 'a') ev.preventDefault();

            // определяем ключ сортировки: data-sort если есть, иначе по тексту
            const sortKey = variant.dataset.sort || guessKeyFromText(getText(variant));

            // закрываем панель сортировки (если есть)
            const panel = document.querySelector('.variants');
            const searchWrap = document.querySelector('.search');
            const wayTrigger = document.querySelector('.special__way');
            if (panel) panel.classList.remove('variants--open');
            if (searchWrap) searchWrap.classList.remove('search__all');
            if (wayTrigger) wayTrigger.classList.remove('special__way--open');

            // Обновляем текст триггера
            const wayText = document.querySelector('.way-text');
            if (wayText) wayText.textContent = getText(variant);

            // Active state
            document.querySelectorAll('.variants__link, .variants__item').forEach(el => el.classList.remove('active'));
            variant.classList.add('active');

            // Сортируем и применяем
            const items = collectNodes();
            const sorted = sortNodes(items, sortKey);
            applyOrder(sorted);
        });

        function guessKeyFromText(text) {
            const t = (text || '').toLowerCase();
            if (t.includes('деш')) return 'price_asc';
            if (t.includes('дорог')) return 'price_desc';
            if (t.includes('новин')) return 'novinki';
            if (t.includes('рейтинг')) return 'rating_desc';
            return 'pop';
        }
    })();

    /* ========== СЧЁТЧИК (плюс/минус) — делегирование на контейнер карточек ========== */
    (function initCounter() {
        const listContainer = document.querySelector('.special__list');
        if (!listContainer) return;

        listContainer.addEventListener('click', (ev) => {
            // плюс
            const plus = ev.target.closest('.img-plus');
            if (plus) {
                ev.preventDefault();
                const qtyWrap = plus.closest('.special__quantity');
                if (!qtyWrap) return;
                const counter = qtyWrap.querySelector('.more-more');
                if (!counter) return;
                const current = parseInt(counter.textContent.replace(/\D/g, '')) || 0;
                counter.textContent = current + 1;

                // активируем минус если есть
                const minusBtn = qtyWrap.querySelector('.img-minus');
                if (minusBtn) minusBtn.classList.add('enabled');
                return;
            }

            // минус
            const minus = ev.target.closest('.img-minus');
            if (minus) {
                ev.preventDefault();
                const qtyWrap = minus.closest('.special__quantity');
                if (!qtyWrap) return;
                const counter = qtyWrap.querySelector('.more-more');
                if (!counter) return;
                let current = parseInt(counter.textContent.replace(/\D/g, '')) || 0;
                if (current > 1) {
                    current = current - 1;
                    counter.textContent = current;
                } else {
                    // можно оставить 0 или 1 в зависимости от UX — у тебя было >1
                    counter.textContent = 1;
                    minus.classList.remove('enabled');
                }
                return;
            }

        });
    })();

    /* ========== готово ========== */
    // console.log('special-controls: initialized');

}); // DOMContentLoaded end


 /* ========== ДОБАВЛЕНИЕ В КОРЗИНУ ========== */
    (function initCart() {
        const cartIcon = document.querySelector('.header__icon');
        if (!cartIcon) return;

        let cartTotalCount = 0;

        // создаем бейдж при первом добавлении
        function ensureBadge() {
            let badge = cartIcon.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartIcon.appendChild(badge);
            }
            return badge;
        }

        // обновляем бейдж
        function updateBadge() {
            const badge = ensureBadge();
            if (cartTotalCount > 0) {
                badge.textContent = `Добавлено (${cartTotalCount})`;
                badge.classList.add('visible');
            } else {
                badge.textContent = '';
                badge.classList.remove('visible');
            }
        }

        // делегирование кликов по кнопкам "В корзину"
        document.body.addEventListener('click', (ev) => {
            const basket = ev.target.closest('.special__basket');
            if (!basket) return;

            ev.preventDefault();

            const card = basket.closest('.special__item-list');
            if (!card) return;

            // считаем текущее количество из счётчика
            const counter = card.querySelector('.more-more');
            let count = parseInt(counter?.textContent.replace(/\D/g, '')) || 1;

            // увеличиваем общий счётчик
            cartTotalCount += count;
            updateBadge();

            // меняем надпись на кнопке
            const text = basket.querySelector('.basket-text');
            if (text) {
                text.textContent = 'Добавлено';
                basket.classList.add('added');
            }

            // (опционально) можно добавить временный эффект
            basket.classList.add('pulse');
            setTimeout(() => basket.classList.remove('pulse'), 400);
        });
    })();