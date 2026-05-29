document.addEventListener('DOMContentLoaded', () => {

    /* ====================================================================
       1. ІН'ЄКЦІЯ CSS-СТИЛІВ ДЛЯ МОДАЛОК ТА СПОВІЩЕНЬ
       ==================================================================== */
    const style = document.createElement('style');
    style.innerHTML = `
        /* Стилі для системи сповіщень (Toast) */
        .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .toast {
            background: var(--bg2, #0B0F1A);
            color: var(--text, #EDE8DF);
            border-left: 4px solid var(--gold, #D4A843);
            border-radius: 8px;
            padding: 16px 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            font-family: 'Syne', sans-serif;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }
        .toast.error {
            border-left-color: #ff4d4d;
        }

        /* Стилі для модального вікна (AJAX Статті) */
        .ajax-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(7, 9, 15, 0.85); /* var(--bg) з прозорістю */
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .ajax-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .ajax-modal-container {
            position: relative;
            width: 100%;
            max-width: 900px;
            background: var(--bg, #07090F);
            border: 1px solid rgba(212, 168, 67, 0.2); /* var(--border) */
            border-radius: 16px;
            margin: 40px 20px;
            min-height: 200px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            transform: translateY(30px) scale(0.95);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ajax-modal-overlay.active .ajax-modal-container {
            transform: translateY(0) scale(1);
        }
        .ajax-modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(212, 168, 67, 0.1);
            border: 1px solid rgba(212, 168, 67, 0.3);
            border-radius: 50%;
            color: var(--gold, #D4A843);
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s;
        }
        .ajax-modal-close:hover {
            background: var(--gold, #D4A843);
            color: var(--bg, #07090F);
            transform: rotate(90deg);
        }
        .ajax-modal-content {
            padding: 40px 20px;
            color: var(--text, #EDE8DF);
        }
        .ajax-modal-loader {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            color: var(--gold, #D4A843);
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
    `;
    document.head.appendChild(style);

    /* ====================================================================
       2. ЛОГІКА СПОВІЩЕНЬ (TOAST)
       ==================================================================== */
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Викликаємо анімацію появи через невелику затримку (для відпрацювання DOM)
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Видаляємо сповіщення через 5 секунд
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Чекаємо завершення CSS-транзиції
        }, 5000);
    }

    /* ====================================================================
       3. ЗАВДАННЯ 1: AJAX ВІДПРАВКА ФОРМИ (WEB3FORMS)
       ==================================================================== */
    const form = document.querySelector('form[action="https://api.web3forms.com/submit"]');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Зупиняємо стандартне перезавантаження
            
            // Збираємо дані з форми
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Візуальний зворотний зв'язок під час відправки
            submitBtn.innerHTML = 'Відправка...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    form.reset(); // Очищуємо форму
                    showToast("Заявку успішно відправлено! Ми зв'яжемося з вами найближчим часом.", "success");
                } else {
                    showToast("Помилка відправки. Спробуйте пізніше.", "error");
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showToast("Помилка відправки. Перевірте з'єднання з інтернетом.", "error");
            } finally {
                // Повертаємо кнопку в початковий стан
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    /* ====================================================================
       4. ЗАВДАННЯ 2: АСИНХРОННЕ ВІДКРИТТЯ СТАТЕЙ У МОДАЛЬНОМУ ВІКНІ
       ==================================================================== */
    
    // Створюємо базову структуру модального вікна та додаємо в DOM
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'ajax-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="ajax-modal-container">
            <button class="ajax-modal-close" aria-label="Закрити">&times;</button>
            <div class="ajax-modal-content"></div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const modalContent = modalOverlay.querySelector('.ajax-modal-content');
    const btnClose = modalOverlay.querySelector('.ajax-modal-close');

    // Функція закриття модалки
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Відновлюємо скрол головної сторінки
        setTimeout(() => modalContent.innerHTML = '', 300); // Очищуємо контент після анімації
    };

    // Слухачі подій для закриття (клік по хрестику або темному фону)
    btnClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Делегування подій для всіх посилань із класом .ajax-link
    document.body.addEventListener('click', async (e) => {
        const link = e.target.closest('a.ajax-link');
        
        if (link) {
            e.preventDefault(); // Забороняємо стандартний перехід
            const url = link.href;

            // Відкриваємо модалку в стані завантаження
            document.body.style.overflow = 'hidden'; // Блокуємо скрол головної сторінки
            modalContent.innerHTML = '<div class="ajax-modal-loader">Завантаження...</div>';
            modalOverlay.classList.add('active');

            try {
                // Завантажуємо HTML сторінки за URL
                const response = await fetch(url);
                if (!response.ok) throw new Error('Помилка мережі');
                
                const htmlText = await response.text();
                
                // Парсимо отриманий текст у DOM-дерево
                const parser = new DOMParser();
                const doc = parser.parseDocumentFromString(htmlText, 'text/html');

                // Витягуємо основний контейнер .page (який містить hero та контент)
                const pageWrapper = doc.querySelector('.page');
                
                if (pageWrapper) {
                    // Щоб модалка не була перевантаженою, видаляємо зайві глобальні блоки:
                    // шапку, футер, секцію контактів, форму і блок фотографій з завантаженого DOM
                    const elementsToRemove = pageWrapper.querySelectorAll('header, footer, #form, #contacts, #photos');
                    elementsToRemove.forEach(el => el.remove());

                    // Вставляємо очищений контент у модалку
                    modalContent.innerHTML = pageWrapper.innerHTML;
                } else {
                    // Fallback: якщо структури .page немає, беремо просто body
                    modalContent.innerHTML = doc.body.innerHTML;
                }
            } catch (error) {
                console.error('AJAX Load Error:', error);
                modalContent.innerHTML = '<div class="ajax-modal-loader" style="color: #ff4d4d;">Помилка завантаження сторінки.</div>';
            }
        }
    });

});
