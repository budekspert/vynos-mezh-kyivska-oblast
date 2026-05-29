document.addEventListener('DOMContentLoaded', () => {
  
  // ════════════════════════════════════════════════════════════
  // 1. АСИНХРОННА ВІДПРАВКА ФОРМИ (WEB3FORMS)
  // ════════════════════════════════════════════════════════════
  const form = document.getElementById('orderForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.btn-submit');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerText = 'Відправка...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showNotification('Заявку успішно відправлено! Наш інженер зв\'яжеться з вами найближчим часом.', true);
          form.reset();
        } else {
          showNotification('Помилка відправки. Спробуйте пізніше або зателефонуйте нам.', false);
        }
      } catch (error) {
        showNotification('Помилка з\'єднання. Перевірте інтернет.', false);
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // 2. АСИНХРОННЕ ВІДКРИТТЯ СТАТЕЙ ЗА РЕКОМЕНДАЦІЄЮ GEMINI (КЛАС .ajax-link)
  // ════════════════════════════════════════════════════════════
  document.body.addEventListener('click', async (e) => {
    // Скрипт шукає клік саме по посиланнях з класом .ajax-link
    const link = e.target.closest('.ajax-link');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (href) {
      e.preventDefault();
      
      showNotification('Завантаження статті...', true, 1500);

      try {
        const response = await fetch(href);
        if (!response.ok) throw new Error('Стаття не знайдена');
        
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Витягуємо чистий контент: шукаємо тег <main>, секцію статті або беремо <body>
        const mainContent = doc.querySelector('main') || doc.querySelector('.article-content') || doc.body;
        const htmlText = mainContent ? mainContent.innerHTML : text;
        
        openModal(htmlText);
      } catch (error) {
        showNotification('Не вдалося завантажити статтю. Спробуйте пізніше.', false);
      }
    }
  });

  // Функція створення модального вікна (Дизайн: Dark-Gold)
  function openModal(content) {
    const oldModal = document.getElementById('articleModal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'articleModal';
    modal.className = 'be-modal-overlay';
    modal.innerHTML = `
      <div class="be-modal-window">
        <button class="be-modal-close" aria-label="Закрити">&times;</button>
        <div class="be-modal-body">${content}</div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; 

    const closeBtn = modal.querySelector('.be-modal-close');
    const closeModal = () => {
      modal.classList.add('be-closing');
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Функція для спливаючих сповіщень
  function showNotification(text, isSuccess = true, duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `be-toast ${isSuccess ? 'success' : 'error'}`;
    toast.innerText = text;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('be-closing');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // Додаємо стилі в документ для красивого відображення попапів
  const style = document.createElement('style');
  style.textContent = `
    .be-modal-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(7, 9, 15, 0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; padding: 20px;
      animation: beFadeIn 0.3s ease forwards;
    }
    .be-modal-window {
      background: #0B0F1A; border: 1px solid rgba(212, 168, 67, 0.25);
      border-radius: 16px; width: 100%; max-width: 800px; max-height: 85vh;
      display: flex; flex-direction: column; position: relative;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      animation: beScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    .be-modal-close {
      position: absolute; top: 15px; right: 20px;
      background: none; border: none; color: #D4A843; font-size: 32px; font-weight: 300; cursor: pointer; z-index: 10;
      transition: color 0.2s, transform 0.2s;
    }
    .be-modal-close:hover { color: #F0C96A; transform: scale(1.1); }
    .be-modal-body { padding: 40px 30px; overflow-y: auto; color: #EDE8DF; font-size: 15px; line-height: 1.7; }
    .be-modal-body::-webkit-scrollbar { width: 6px; }
    .be-modal-body::-webkit-scrollbar-track { background: #07090F; }
    .be-modal-body::-webkit-scrollbar-thumb { background: #D4A843; border-radius: 3px; }
    .be-toast {
      position: fixed; bottom: 30px; right: 30px; z-index: 11000;
      padding: 16px 24px; border-radius: 8px; font-size: 13px; font-weight: 600;
      color: #07090F; display: flex; align-items: center; max-width: 350px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      animation: beSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    .be-toast.success { background: linear-gradient(135deg, #D4A843, #F0C96A); border: 1px solid #8A6820; }
    .be-toast.error { background: #e74c3c; color: #fff; }
    @keyframes beFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes beScaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
    @keyframes beSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .be-modal-overlay.be-closing, .be-toast.be-closing { opacity: 0; transition: opacity 0.3s ease; }
  `;
  document.head.appendChild(style);
});
