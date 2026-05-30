/**
 * ═══════════════════════════════════════════════════════════════════════════
 * БУДЕКСПЕРТ — ПРОФЕСІЙНИЙ ІНТЕГРАЦІЙНИЙ СКРИПТ ВЕБ-ЗАСТОСУНКУ
 * ═══════════════════════════════════════════════════════════════════════════
 * Розробник: Senior Web Applications Engineer (AI Expert)
 * Функціонал: 
 *  1. AJAX-відправка Web3Forms без перезавантаження сторінки.
 *  2. Асинхронне завантаження (AJAX Fetch) та рендеринг готових сторінок статей 
 *     у динамічному модальному вікні за класом .ajax-link.
 *  3. Автоматична ін'єкція адаптивних Dark-Gold стилів.
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ════════════════════════════════════════════════════════════
  // 1. КОНСТАНТИ ТА НАЛАШТУВАННЯ ДИЗАЙНУ (DARK-GOLD)
  // ════════════════════════════════════════════════════════════
  const BRAND_COLORS = {
    bg: '#07090F',
    bg2: '#0B0F1A',
    gold: '#D4A843',
    gold2: '#F0C96A',
    text: '#EDE8DF',
    muted: 'rgba(237,232,223,0.45)',
    border: 'rgba(212,168,67,0.15)'
  };

  // ════════════════════════════════════════════════════════════
  // 2. АВТОМАТИЧНА ІН'ЄКЦІЯ CSS СТИЛІВ У DOCUMENT HEAD
  // ════════════════════════════════════════════════════════════
  const injectStyles = () => {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      /* Елементи керування та оверлей модального вікна */
      .be-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(7, 9, 15, 0.88);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        animation: beFadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }
      
      /* Структурне вікно для відображення статті */
      .be-modal-window {
        background: ${BRAND_COLORS.bg2};
        border: 1px solid ${BRAND_COLORS.border};
        border-radius: 16px;
        width: 100%;
        max-width: 850px;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        position: relative;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7);
        transform: scale(0.9);
        animation: beScaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      
      /* Елемент закриття модального вікна */
      .be-modal-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        color: ${BRAND_COLORS.gold};
        font-size: 36px;
        font-weight: 300;
        cursor: pointer;
        z-index: 10100;
        line-height: 1;
        transition: color 0.2s ease, transform 0.2s ease;
      }
      .be-modal-close:hover {
        color: ${BRAND_COLORS.gold2};
        transform: scale(1.15);
      }
      
      /* Контейнер для тіла статті з кастомним скролбаром */
      .be-modal-body {
        padding: 50px 40px;
        overflow-y: auto;
        color: ${BRAND_COLORS.text};
        font-size: 15px;
        line-height: 1.8;
      }
      .be-modal-body h1, .be-modal-body h2, .be-modal-body h3 {
        color: ${BRAND_COLORS.gold};
        margin-bottom: 20px;
        font-family: serif;
      }
      .be-modal-body p {
        margin-bottom: 16px;
      }
      
      /* Інженерна стилізація скролбару */
      .be-modal-body::-webkit-scrollbar {
        width: 6px;
      }
      .be-modal-body::-webkit-scrollbar-track {
        background: ${BRAND_COLORS.bg};
      }
      .be-modal-body::-webkit-scrollbar-thumb {
        background: ${BRAND_COLORS.gold};
        border-radius: 3px;
      }
      .be-modal-body::-webkit-scrollbar-thumb:hover {
        background: ${BRAND_COLORS.gold2};
      }

      /* Спливаючі системні сповіщення (Toasts) */
      .be-toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 11000;
        padding: 16px 28px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: ${BRAND_COLORS.bg};
        display: flex;
        align-items: center;
        max-width: 380px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        transform: translateY(50px);
        opacity: 0;
        animation: beSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      .be-toast.success {
        background: linear-gradient(135deg, ${BRAND_COLORS.gold}, ${BRAND_COLORS.gold2});
        border: 1px solid #8A6820;
      }
      .be-toast.error {
        background: #E74C3C;
        color: #FFFFFF;
        border: 1px solid #C0392B;
      }
      
      /* Анімаційні ефекти та переходи */
      @keyframes beFadeIn { to { opacity: 1; } }
      @keyframes beScaleIn { to { opacity: 1; transform: scale(1); } }
      @keyframes beSlideUp { to { opacity: 1; transform: translateY(0); } }
      
      /* Плавна деструкція вікон при закритті */
      .be-modal-overlay.be-closing, .be-toast.be-closing {
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      }
      
      /* Адаптивність під мобільні пристрої */
      @media (max-width: 600px) {
        .be-modal-window { max-height: 92vh; border-radius: 12px; }
        .be-modal-body { padding: 40px 20px; font-size: 14px; }
        .be-toast { left: 20px; right: 20px; bottom: 20px; max-width: none; }
      }
    `;
    document.head.appendChild(styleTag);
  };

  // ════════════════════════════════════════════════════════════
  // 3. СИСТЕМНІ ТОСТ-СПОВІЩЕННЯ (TOAST NOTIFICATIONS)
  // ════════════════════════════════════════════════════════════
  const showNotification = (text, isSuccess = true, duration = 4000) => {
    const toast = document.createElement('div');
    toast.className = `be-toast ${isSuccess ? 'success' : 'error'}`;
    toast.innerText = text;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('be-closing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // ════════════════════════════════════════════════════════════
  // 4. ЛОГІКА РОБОТИ МОДАЛЬНОГО ВІКНЯ
  // ════════════════════════════════════════════════════════════
  const openModal = (htmlContent) => {
    const currentModal = document.getElementById('articleModal');
    if (currentModal) currentModal.remove();

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'articleModal';
    modalOverlay.className = 'be-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="be-modal-window">
        <button class="be-modal-close" aria-label="Закрити сторінку">&times;</button>
        <div class="be-modal-body">${htmlContent}</div>
      </div>
    `;

    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden'; // Запобігаємо прокрутці фону сторінки

    const closeModal = () => {
      modalOverlay.classList.add('be-closing');
      setTimeout(() => {
        modalOverlay.remove();
        document.body.style.overflow = ''; // Повертаємо нативний скрол
      }, 300);
    };

    // Навішування обробників подій для закриття вікна
    modalOverlay.querySelector('.be-modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) closeModal();
    });
  };

  // ════════════════════════════════════════════════════════════
  // 5. ОБРОБНИК AJAX ВІДПРАВКИ ФОРМИ (WEB3FORMS)
  // ════════════════════════════════════════════════════════════
  const initFormHandler = () => {
    const targetForm = document.getElementById('orderForm');
    if (!targetForm) return;

    targetForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = targetForm.querySelector('.btn-submit');
      const originalButtonContent = submitButton.innerHTML;

      // Старт індикації завантаження
      submitButton.innerText = 'Обробка заявки...';
      submitButton.disabled = true;

      try {
        const formData = new FormData(targetForm);
        const response = await fetch(targetForm.action, {
          method: targetForm.method,
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showNotification('Заявку успішно відправлено! Наш інженер зв\'яжеться з вами найближчим часом.', true);
          targetForm.reset(); // Скидання всіх полів форми
        } else {
          showNotification('Помилка сервера. Спробуйте пізніше або зателефонуйте нам.', false);
        }
      } catch (error) {
        showNotification('Помилка з\'єднання. Перевірте доступ до інтернету.', false);
      } finally {
        // Повернення інтерфейсу кнопки до початкового стану
        submitButton.innerHTML = originalButtonContent;
        submitButton.disabled = false;
      }
    });
  };

  // ════════════════════════════════════════════════════════════
  // 6. ПЕРЕХВАТ КЛІКІВ ТА АСИНХРОННЕ ЗАВАНТАЖЕННЯ СТАТЕЙ (FETCH)
  // ════════════════════════════════════════════════════════════
  const initArticleLinksHandler = () => {
    document.body.addEventListener('click', async (event) => {
      // Ідентифікація кліку по посиланню з класом .ajax-link
      const targetLink = event.target.closest('.ajax-link');
      if (!targetLink) return;

      const destinationUrl = targetLink.getAttribute('href');
      if (!destinationUrl) return;

      event.preventDefault(); // Зупинка нативного переходу браузера
      showNotification('Завантаження матеріалу...', true, 1200);

      try {
        const response = await fetch(destinationUrl);
        if (!response.ok) throw new Error(`Статус відповіді сервера: ${response.status}`);

        const rawHtml = await response.text();
        
        // Розумний парсинг DOM отриманого документа статті
