/**
 * ═══════════════════════════════════════════════════════════════════════════
 * БУДЕКСПЕРТ — ОФІЦІЙНИЙ МОНОЛІТНИЙ СКРИПТ ВЕБ-ЗАСТОСУНКУ
 * ═══════════════════════════════════════════════════════════════════════════
 * Дизайн: Оригінальний преміальний Dark-Gold (Насичені яскраві кольори)
 * Функціонал: Маска кадастру + AJAX Web3Forms + AJAX Попап Статей (.ajax-link)
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. ОРИГІНАЛЬНА ФІРМОВА ПАЛІТРА КОЛЬОРІВ БУДЕКСПЕРТ (МАКСИМАЛЬНА НАЦИЧЕНІСТЬ)
  const BRAND_COLORS = {
    bg: '#07090F',       // Насичений глибокий темний фон
    bg2: '#0B0F1A',      // Фон карток та вікна
    gold: '#D4A843',     // Ярке фірмове золото (акценти, рамки, заголовки)
    gold2: '#F0C96A',    // Світле золото (ховер ефекти)
    text: '#EDE8DF',     // Максимально чіткий, контрастний кремово-білий текст
    muted: 'rgba(237, 232, 223, 0.7)', // Насичений читаємий підтекст
    border: 'rgba(212, 168, 67, 0.35)' // Чіткі золоті кордони
  };

  // 2. ІН'ЄКЦІЯ CSS СТИЛІВ (ПОВНЕ ВИДЕННЯ СИНЬО-БІЛОГО ФОНУ, ПОВНЕ ПОВЕРНЕННЯ ОРИГІНАЛУ)
  const injectStyles = () => {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      /* Головний темний оверлей модального вікна з розмиттям */
      .be-modal-overlay {
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(7, 9, 15, 0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center; padding: 20px;
        opacity: 0; animation: beFadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }
      
      /* Вікно статті у фірмовому стилі БудЕксперт */
      .be-modal-window {
        background: ${BRAND_COLORS.bg2}; border: 2px solid ${BRAND_COLORS.gold};
        border-radius: 16px; width: 100%; max-width: 850px; max-height: 85vh;
        display: flex; flex-direction: column; position: relative;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 168, 67, 0.1);
        transform: scale(0.9); animation: beScaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      
      /* Кнопка закриття (Яскраве Золото) */
      .be-modal-close {
        position: absolute; top: 15px; right: 20px; background: none; border: none;
        color: ${BRAND_COLORS.gold}; font-size: 38px; font-weight: 400; cursor: pointer; z-index: 10100;
        line-height: 1; transition: color 0.2s ease, transform 0.2s ease;
      }
      .be-modal-close:hover { color: ${BRAND_COLORS.gold2}; transform: scale(1.15); }
      
      /* Тіло статті — Чіткий, контрастний текст, який не змушує щуритись */
      .be-modal-body {
        padding: 50px 40px; overflow-y: auto; color: ${BRAND_COLORS.text} !important; font-size: 16px; line-height: 1.8;
      }
      .be-modal-body h1, .be-modal-body h2, .be-modal-body h3, .be-modal-body em {
        color: ${BRAND_COLORS.gold} !important; margin-bottom: 22px; font-family: 'Playfair Display', serif; font-weight: 700;
      }
      .be-modal-body p { margin-bottom: 18px; color: ${BRAND_COLORS.text} !important; }
      .be-modal-body strong { color: ${BRAND_COLORS.gold2} !important; font-weight: 700; }
      .be-modal-body ul, .be-modal-body ol { margin-left: 20px; margin-bottom: 20px; color: ${BRAND_COLORS.text} !important; }
      .be-modal-body li { margin-bottom: 8px; }
      
      /* ПРИМУСОВИЙ ФІРМОВИЙ СТИЛЬ ДЛЯ ВСІХ ФОРМ, СЕЛЕКТІВ ТА ІНПУТІВ ВСЕРЕДИНІ ПОПАПУ (ПОВНЕ ЗНИЩЕННЯ СИНЬО-БІЛОГО) */
      .be-modal-body form { background: ${BRAND_COLORS.bg2} !important; }
      .be-modal-body .field input, 
      .be-modal-body .field select, 
      .be-modal-body .field textarea,
      .be-modal-body input, 
      .be-modal-body select, 
      .be-modal-body textarea {
        width: 100% !important; background: ${BRAND_COLORS.bg} !important; 
        border: 1px solid ${BRAND_COLORS.gold} !important; border-radius: 8px !important; 
        padding: 14px !important; color: ${BRAND_COLORS.text} !important; 
        font-family: sans-serif !important; font-size: 15px !important; outline: none !important;
      }
      .be-modal-body select option {
        background: ${BRAND_COLORS.bg} !important; color: ${BRAND_COLORS.text} !important;
      }
      .be-modal-body label {
        display: block !important; font-size: 12px !important; color: ${BRAND_COLORS.gold} !important; 
        margin-bottom: 8px !important; text-transform: uppercase !important; letter-spacing: 1px !important;
      }
      
      /* Преміальний золотий скролбар для довгих текстів */
      .be-modal-body::-webkit-scrollbar { width: 6px; }
      .be-modal-body::-webkit-scrollbar-track { background: ${BRAND_COLORS.bg}; }
      .be-modal-body::-webkit-scrollbar-thumb { background: ${BRAND_COLORS.gold}; border-radius: 3px; }
      .be-modal-body::-webkit-scrollbar-thumb:hover { background: ${BRAND_COLORS.gold2}; }

      /* Фірмові спливаючі сповіщення (Золотий градієнт) */
      .be-toast {
        position: fixed; bottom: 30px; right: 30px; z-index: 11000; padding: 18px 30px;
        border-radius: 8px; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.bg};
        display: flex; align-items: center; max-width: 400px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
        transform: translateY(50px); opacity: 0; animation: beSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      .be-toast.success { background: linear-gradient(135deg, ${BRAND_COLORS.gold}, ${BRAND_COLORS.gold2}); border: 1px solid #8A6820; }
      .be-toast.error { background: #E74C3C; color: #FFFFFF; border: 1px solid #C0392B; }
      
      @keyframes beFadeIn { to { opacity: 1; } }
      @keyframes beScaleIn { to { opacity: 1; transform: scale(1); } }
      @keyframes beSlideUp { to { opacity: 1; transform: translateY(0); } }
      .be-modal-overlay.be-closing, .be-toast.be-closing { opacity: 0; transition: opacity 0.3s ease; }
      
      @media (max-width: 600px) {
        .be-modal-window { max-height: 92vh; border-radius: 12px; }
        .be-modal-body { padding: 40px 20px; font-size: 15px; }
        .be-toast { left: 20px; right: 20px; bottom: 20px; max-width: none; }
      }
    `;
    document.head.appendChild(styleTag);
  };

  // 3. СИСТЕМНІ ТОСТ-СПОВІЩЕННЯ
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

  // 4. ДИНАМІЧНЕ МОДАЛЬНЕ ВІКНО СТАТТІ
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
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
      modalOverlay.classList.add('be-closing');
      setTimeout(() => {
        modalOverlay.remove();
        document.body.style.overflow = '';
      }, 300);
    };
    modalOverlay.querySelector('.be-modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  };

  // 5. АВТОМАТИЧНА МАСКА ДЛЯ КАДАСТРОВОГО НОМЕРА (ПРАЦЮЄ НА НАПИСАННЯ ЦИФР)
  const initCadastralMask = () => {
    const cadInput = document.getElementById('cadastral_number') || document.querySelector('input[name="cadastral_number"]');
    if (!cadInput) return;

    cadInput.setAttribute('placeholder', 'XXXXXXXXXX:XX:XXX:XXXX');
    cadInput.setAttribute('maxlength', '24');

    cadInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^0-9]/g, '');
      let formatted = '';

      if (value.length > 0) {
        formatted += value.substring(0, 10);
        if (value.length > 10) {
          formatted += ':' + value.substring(10, 12);
          if (value.length > 12) {
            formatted += ':' + value.substring(12, 15);
            if (value.length > 15) {
              formatted += ':' + value.substring(15, 19);
            }
          }
        }
      }
      e.target.value = formatted;
    });
  };

  // 6. НАДІЙНИЙ ОБРОБНИК ФОРМИ ДЛЯ WEB3FORMS (ЗАЯВКИ 100% ПРИХОДЯТЬ)
  const initFormHandler = () => {
    const targetForm = document.getElementById('orderForm');
    if (!targetForm) return;

    targetForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = targetForm.querySelector('.btn-submit');
      const originalButtonContent = submitButton.innerHTML;

      submitButton.innerText = 'Обробка заявки...';
      submitButton.disabled = true;

      try {
        const formData = new FormData(targetForm);
        
        if (!formData.has('email')) {
          formData.append('email', 'no-reply@budekspert.com'); 
        }
        if (!formData.has('subject')) {
          formData.append('subject', 'Нова заявка з сайту БудЕксперт');
        }

        const response = await fetch(targetForm.action, {
          method: targetForm.method,
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        const resultData = await response.json();

        if (response.ok && resultData.success) {

       
