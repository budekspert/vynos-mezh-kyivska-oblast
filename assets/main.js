/**
 * ═══════════════════════════════════════════════════════════════════════════
 * БУДЕКСПЕРТ — УНІВЕРСАЛЬНИЙ МОНОЛІТНИЙ РОЗУМНИЙ СКРИПТ ВЕБ-ЗАСТОСУНКУ
 * ═══════════════════════════════════════════════════════════════════════════
 * Регіон: Київська область (Васильків, Фастів, Обухів, Біла Церква)
 * Дизайн: Оригінальний преміальний Dark-Gold (Насичені яскраві кольори)
 * Автоматизація: Самоналаштування під покращену форму та автоформат кадастру
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. ОРИГІНАЛЬНА НАЧИСЕНА ПАЛІТРА КОЛЬОРІВ БУДЕКСПЕРТ
  const BRAND_COLORS = {
    bg: '#07090F',       // Насичений глибокий темний
    bg2: '#0B0F1A',      // Фон вікна та карток
    gold: '#D4A843',     // Ярке фірмове золото
    gold2: '#F0C96A',    // Світле золото (ховер)
    text: '#EDE8DF',     // Контрастний чіткий текст
    border: 'rgba(212, 168, 67, 0.35)'
  };

  // 2. ІН'ЄКЦІЯ CSS СТИЛІВ ПОПАПУ (ПОВНЕ ПОВЕРНЕННЯ ОРИГІНАЛУ, ЖОДНОГО СИНЬО-БІЛОГО)
  const injectStyles = () => {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .be-modal-overlay {
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(7, 9, 15, 0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center; padding: 20px;
        opacity: 0; animation: beFadeIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }
      .be-modal-window {
        background: ${BRAND_COLORS.bg2}; border: 2px solid ${BRAND_COLORS.gold};
        border-radius: 16px; width: 100%; max-width: 850px; max-height: 85vh;
        display: flex; flex-direction: column; position: relative;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 168, 67, 0.1);
        transform: scale(0.9); animation: beScaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      .be-modal-close {
        position: absolute; top: 15px; right: 20px; background: none; border: none;
        color: ${BRAND_COLORS.gold}; font-size: 38px; font-weight: 400; cursor: pointer; z-index: 10100;
        line-height: 1; transition: color 0.2s ease, transform 0.2s ease;
      }
      .be-modal-close:hover { color: ${BRAND_COLORS.gold2}; transform: scale(1.15); }
      .be-modal-body {
        padding: 50px 40px; overflow-y: auto; color: ${BRAND_COLORS.text} !important; font-size: 16px; line-height: 1.8;
      }
      .be-modal-body h1, .be-modal-body h2, .be-modal-body h3 {
        color: ${BRAND_COLORS.gold} !important; margin-bottom: 22px; font-family: 'Playfair Display', serif; font-weight: 700;
      }
      .be-modal-body p { margin-bottom: 18px; color: ${BRAND_COLORS.text} !important; }
      
      /* Кнопка лінку на форму в кінці кожної статті */
      .be-modal-form-btn {
        display: inline-flex; align-items: center; justify-content: center; margin-top: 25px;
        background: linear-gradient(135deg, ${BRAND_COLORS.gold}, ${BRAND_COLORS.gold2});
        color: ${BRAND_COLORS.bg} !important; font-weight: 800; text-transform: uppercase;
        letter-spacing: 1px; padding: 16px 32px; border-radius: 8px; border: none;
        cursor: pointer; text-decoration: none; width: 100%; transition: transform 0.2s;
      }
      .be-modal-form-btn:hover { transform: translateY(-2px); }

      /* ПРИМУСОВЕ ВИДАЛЕННЯ ДЕФОЛТНИХ СТИЛІВ БРАУЗЕРА ДЛЯ СЕЛЕКТІВ ТА ПОЛІВ ВСЕРЕДИНІ ПОПАПУ */
      .be-modal-body input, .be-modal-body select, .be-modal-body textarea {
        background-color: ${BRAND_COLORS.bg} !important; color: ${BRAND_COLORS.text} !important;
        border: 1px solid ${BRAND_COLORS.gold} !important;
      }
      select option { background-color: ${BRAND_COLORS.bg} !important; color: ${BRAND_COLORS.text} !important; }

      .be-modal-body::-webkit-scrollbar { width: 6px; }
      .be-modal-body::-webkit-scrollbar-track { background: ${BRAND_COLORS.bg}; }
      .be-modal-body::-webkit-scrollbar-thumb { background: ${BRAND_COLORS.gold}; border-radius: 3px; }
      
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
        <div class="be-modal-body">
          ${htmlContent}
          <button class="be-modal-form-btn">Залишити заявку інженеру</button>
        </div>
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

    // РОЗУМНИЙ СКРОЛ ДО ФОРМИ
    modalOverlay.querySelector('.be-modal-form-btn').addEventListener('click', () => {
      closeModal();
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    });
  };

  // 5. ІДЕАЛЬНИЙ АВТОФОРМАТ КАДАСТРОВОГО НОМЕРА СХЕМОЮ CLAUDE (10:2:3:4)
  const initCadastralMask = () => {
    const CAD_PARTS =;
    const cadInput = document.getElementById('fcadnum') || 
                     document.querySelector('input[id*="cadastral"]') || 
                     document.querySelector('input[name*="cadastral"]') ||
                     document.querySelector('input[placeholder*="кадастр"]');
    if (!cadInput) return;

    cadInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '');
      if (digits.length > 19) digits = digits.slice(0, 19);
      
      let result = '';
      let pos = 0;
      for (let i = 0; i < CAD_PARTS.length; i++) {
        let chunk = digits.slice(pos, pos + CAD_PARTS[i]);
        if (!chunk) break;
        result += (i > 0 ? ':' : '') + chunk;
        pos += CAD_PARTS[i];
      }
      e.target.value = result;
    });
  };

  // 6. РОЗУМНИЙ ОБРОБНИК ФОРМИ (ЗАЯВКИ ПРИХОДЯТЬ НА EMAIL БЕЗ REFRESH СТОРІНКИ)
  const initFormHandler = () => {
    const targetForm = document.querySelector('form');
    if (!targetForm) return;

    if (!targetForm.getAttribute('action')) {
      targetForm.setAttribute('action', 'https://web3forms.com');
    }

    targetForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = targetForm.querySelector('button[type="submit"]') || targetForm.querySelector('.btn-submit');
      const originalButtonContent = submitButton ? submitButton.innerHTML : 'Надіслати заявку';

      if (submitButton) {
        submitButton.innerText = 'Обробка заявки...';
        submitButton.disabled = true;
      }

      try {
        const formData = new FormData(targetForm);
        
        // Гарантуємо наявність потрібних ключів для Web3Forms
        if (!formData.has('access_key')) {
          formData.append('access_key', '7a7c94a8-8935-4659-88d0-1e900cb9460b');
        }
        if (!formData.has('email')) {
          formData.append('email', 'no-reply@budekspert.com'); 
        }

        const response = await fetch(targetForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        const resultData = await response.json();

        if (response.ok && resultData.success) {
          showNotification('Заявку успішно відправлено! Наш інженер зв\'яжеться з вами найближчим часом.', true);
          targetForm.reset();
        } else {
          showNotification('Помилка Web3Forms. Перевірте Access Key.', false);
        }
      } catch (error) {
        showNotification('Помилка з\'єднання. Перевірте доступ до інтернету.', false);
      } finally {
        if (submitButton) {
          submitButton.innerHTML = originalButtonContent;
          submitButton.disabled = false;
        }
      }
    });
  };


       
