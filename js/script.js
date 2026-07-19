// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let entryTreeBtn = null;
let faqItems = [];
const isMobile = window.matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MAX_CURSOR_LEAVES = isMobile ? 14 : 26;
const MAX_TIMER_LEAVES = 8;

let cursorLeafCount = 0;
let timerLeafCount = 0;

// Аккордеон FAQ (глобальное)
window.toggleFaq = function(element) {
  const isActive = element.classList.contains('active');
  faqItems.forEach(item => {
    item.classList.remove('active');
  });
  if (!isActive) {
    element.classList.add('active');
  }
};

// ===== ЛОГИКА ВХОДА И ИНИЦИАЛИЗАЦИИ =====
document.addEventListener('DOMContentLoaded', () => {
  const entryPage = document.getElementById('entry-page');
  const mainPage = document.getElementById('main-page');
  const entryOverlay = document.getElementById('entry-overlay-transition');
  entryTreeBtn = document.getElementById('entry-tree-btn');
  faqItems = document.querySelectorAll('.faq-item');

  // Клик теперь вешаем на ДЕРЕВО (кнопку)
  const treeBtn = entryTreeBtn;

  if (treeBtn) {
    treeBtn.addEventListener('click', () => enterMainSite());
  }

  // Клики по навигационным словам
  document.querySelectorAll('.entry-nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const target = this.dataset.target || 'details';
      enterMainSite(() => {
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      });
    });
  });

  // Связанный ховер: дерево + Церемония
  const treeBtnEl = document.getElementById('entry-tree-btn');
  const ceremonyItem = document.getElementById('ceremony-item');
  if (treeBtnEl && ceremonyItem) {
    treeBtnEl.addEventListener('mouseenter', () => ceremonyItem.classList.add('hover-active'));
    treeBtnEl.addEventListener('mouseleave', () => ceremonyItem.classList.remove('hover-active'));
    ceremonyItem.addEventListener('mouseenter', () => treeBtnEl.classList.add('hover-active'));
    ceremonyItem.addEventListener('mouseleave', () => treeBtnEl.classList.remove('hover-active'));
  }

  // Доступность (Enter/Space)
  document.addEventListener('keydown', event => {
    if ((event.code === 'Space' || event.code === 'Enter') && entryPage.style.display !== 'none') {
      enterMainSite();
    }
  });

  function enterMainSite(callback) {
    // Анимация музыки удалена

    // 2. Анимация исчезновения входа
    entryOverlay.style.opacity = '1';
    entryOverlay.style.pointerEvents = 'all';

    // Анимация дерева при клике (увеличение и исчезновение)
    if (treeBtn) {
      treeBtn.style.transform = 'scale(3)';
      treeBtn.style.opacity = '0';
    }

    // 3. Смена экранов
    setTimeout(() => {
      entryPage.style.display = 'none';
      mainPage.style.display = 'block';

      // Запуск логики главной страницы
      initMainScripts();

      // Callback после входа
      if (typeof callback === 'function') callback();
    }, 800);
  }

  // Запуск светлячков на входе
  initEntryFireflies();
});

// Светлячки на входе
function initEntryFireflies() {
  const container = document.getElementById('entry-fireflies');
  if (!container) return;

  const count = prefersReducedMotion ? 12 : (isMobile ? 14 : 25);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const f = document.createElement('div');
    f.className = 'entry-firefly';
    f.style.left = Math.random() * 100 + '%';
    f.style.top = Math.random() * 100 + '%';
    f.style.animationDelay = Math.random() * 5 + 's';
    f.style.opacity = 0.3 + Math.random() * 0.5;
    fragment.appendChild(f);
  }

  container.appendChild(fragment);
}

// ===== СКРИПТЫ ГЛАВНОЙ СТРАНИЦЫ =====
function initMainScripts() {
  // 0. Создание фоновых слоёв (ленивая загрузка)
  const pageBg = document.getElementById('page-bg');
  if (pageBg) {
    const layers = [
      'url("assets/img/aivazovsky.jpg")',
      'url("assets/img/337966@2x.webp")'
    ];
    layers.forEach((img, i) => {
      const layer = document.createElement('div');
      layer.className = 'page-bg-layer' + (i === 0 ? ' active' : '');
      layer.style.backgroundImage = img;
      pageBg.appendChild(layer);
    });
    const overlay = document.createElement('div');
    overlay.className = 'page-bg-layer page-bg-overlay';
    pageBg.appendChild(overlay);
  }

  // 1. Светлячки (основные)
  const container = document.getElementById('fireflies-container');
  const firefliesCount = prefersReducedMotion ? 18 : (isMobile ? 24 : 40);
  const firefliesFragment = document.createDocumentFragment();

  for (let i = 0; i < firefliesCount; i++) {
    const firefly = document.createElement('div');
    firefly.classList.add('firefly');
    firefly.style.left = Math.random() * 100 + '%';
    firefly.style.top = Math.random() * 100 + '%';
    const size = Math.random() * 3 + 3;
    firefly.style.width = size + 'px';
    firefly.style.height = size + 'px';
    firefly.style.setProperty('--x2', Math.random() * 200 - 100 + 'px');
    firefly.style.setProperty('--y2', Math.random() * 200 - 100 + 'px');
    firefly.style.setProperty('--x4', Math.random() * 200 - 100 + 'px');
    firefly.style.setProperty('--y4', Math.random() * 200 - 100 + 'px');
    firefly.style.animationDuration = Math.random() * 10 + 5 + 's';
    firefly.style.animationDelay = Math.random() * 5 + 's';
    firefliesFragment.appendChild(firefly);
  }

  container.appendChild(firefliesFragment);

  // 2. Таймер с падающими листьями
  const weddingDate = new Date('2026-08-02T15:00:00');
  let prevValues = { d: null, h: null, m: null, s: null };
  let prevValues2 = { d: null, h: null, m: null, s: null };

  const countdownEls = {
    d: document.getElementById('days'),
    h: document.getElementById('hours'),
    m: document.getElementById('minutes'),
    s: document.getElementById('seconds')
  };
  const countdownEls2 = {
    d: document.getElementById('days2'),
    h: document.getElementById('hours2'),
    m: document.getElementById('minutes2'),
    s: document.getElementById('seconds2')
  };

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) return;

    const values = {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60)
    };

    Object.keys(values).forEach(key => {
      const el = countdownEls[key];
      if (!el) return;

      if (prevValues[key] !== values[key]) {
        const formattedVal = values[key] < 10 ? '0' + values[key] : values[key];
        el.textContent = formattedVal;

        if (prevValues[key] !== null) {
          spawnTimerLeaf(el.parentElement);
        }

        prevValues[key] = values[key];
      }
    });

    // Второй таймер
    Object.keys(values).forEach(key => {
      const el = countdownEls2[key];
      if (!el) return;

      const formattedVal = values[key] < 10 ? '0' + values[key] : values[key];
      el.textContent = formattedVal;

      if (prevValues2[key] !== null && prevValues2[key] !== values[key]) {
        spawnTimerLeaf(el.parentElement);
      }
      prevValues2[key] = values[key];
    });
  }

  // Функция создания листика для таймера
  function spawnTimerLeaf(containerEl) {
    if (!containerEl || timerLeafCount >= MAX_TIMER_LEAVES) return;

    const leaf = document.createElement('i');
    leaf.classList.add('fas', 'fa-leaf', 'timer-leaf-anim');
    const randomX = Math.random() * 60 - 30 + 'px';
    leaf.style.setProperty('--fall-x', randomX);

    timerLeafCount += 1;
    containerEl.appendChild(leaf);

    setTimeout(() => {
      if (leaf && leaf.parentNode) leaf.remove();
      timerLeafCount = Math.max(0, timerLeafCount - 1);
    }, 1200);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 3. Анимация появления (Fade In)
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.01
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    const checkFadeIn = () => {
      fadeElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add('visible');
        }
      });
    };

    let fadeRaf = null;
    const onScrollFade = () => {
      if (fadeRaf) return;
      fadeRaf = requestAnimationFrame(() => {
        checkFadeIn();
        fadeRaf = null;
      });
    };

    window.addEventListener('scroll', onScrollFade, { passive: true });
    checkFadeIn();
  }

  // 4. Фоновый слой (page-bg)
  initPageBg();
}

function initPageBg() {
  const layers = document.querySelectorAll('.page-bg-layer');
  if (!layers.length) return;

  const sections = [
    { el: document.getElementById('dresscode'), index: 0 },
    { el: document.getElementById('gift'), index: 1 }
  ];

  let activeLayer = 0;

  function activateLayer(index) {
    if (index === activeLayer) return;
    activeLayer = index;
    layers.forEach((layer, i) => {
      layer.classList.toggle('active', i === index);
    });
  }

  activateLayer(0);

  const observer = new IntersectionObserver((entries) => {
    let maxIndex = -1;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = sections.find(s => s.el === entry.target);
        if (section && section.index > maxIndex) {
          maxIndex = section.index;
        }
      }
    });
    if (maxIndex >= 0 && maxIndex !== activeLayer) {
      activateLayer(maxIndex);
    }
  }, {
    rootMargin: '0px',
    threshold: 0
  });

  sections.forEach(s => {
    if (s.el) observer.observe(s.el);
  });
}

// ===== КУРСОР И ЛИСТЬЯ (МОБИЛЬНАЯ ОПТИМИЗАЦИЯ) =====

const cursor = document.getElementById('custom-cursor');
const entryCursor = document.getElementById('entry-cursor');

let lastLeafTime = 0;
const LEAF_INTERVAL_DESKTOP = 80;
const LEAF_INTERVAL_MOBILE = 160;

let mouseRaf = null;
let pendingMouseEvent = null;

function updateCursorPosition(e) {
  const x = e.clientX + 'px';
  const y = e.clientY + 'px';

  if (cursor) {
    cursor.style.left = x;
    cursor.style.top = y;
  }

  if (entryCursor) {
    entryCursor.style.left = x;
    entryCursor.style.top = y;

    if (entryTreeBtn) {
      const rect = entryTreeBtn.getBoundingClientRect();
      const isHovering =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      entryCursor.style.transform = isHovering ? 'scale(1.5)' : 'scale(1)';
      entryCursor.style.color = isHovering ? '#C9A25B' : '#e6c889';
    }
  }
}

// ===== СОЗДАНИЕ ЛИСТА =====
function createLeaf(x, y) {
  if (cursorLeafCount >= MAX_CURSOR_LEAVES) return;

  const leaf = document.createElement('i');
  leaf.classList.add('fas', 'fa-leaf', 'cursor-leaf');

  const colors = ['#283618', '#606c38', '#C9A25B', '#8cac74'];
  leaf.style.color = colors[Math.floor(Math.random() * colors.length)];

  leaf.style.left = x + 'px';
  leaf.style.top = y + 'px';

  leaf.style.setProperty('--tx', Math.random() * 100 - 50 + 'px');
  leaf.style.setProperty('--ty', Math.random() * 100 + 50 + 'px');
  leaf.style.setProperty('--r', Math.random() * 360 + 'deg');

  cursorLeafCount += 1;
  document.body.appendChild(leaf);

  // гарантированное удаление
  setTimeout(() => {
    if (leaf && leaf.parentNode) leaf.remove();
    cursorLeafCount = Math.max(0, cursorLeafCount - 1);
  }, 1200);
}

// ===== ДЕСКТОП =====
if (!isMobile) {
  document.addEventListener('mousemove', e => {
    pendingMouseEvent = e;

    if (!mouseRaf) {
      mouseRaf = requestAnimationFrame(() => {
        if (pendingMouseEvent) {
          updateCursorPosition(pendingMouseEvent);

          if (Date.now() - lastLeafTime > LEAF_INTERVAL_DESKTOP) {
            createLeaf(pendingMouseEvent.pageX, pendingMouseEvent.pageY);
            lastLeafTime = Date.now();
          }
        }

        mouseRaf = null;
      });
    }
  }, { passive: true });
}

// ===== МОБИЛЬНЫЕ =====
if (isMobile) {
  function spawnLeafFromViewport() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createLeaf(x, y);
  }

  document.addEventListener('touchmove', e => {
    if (Date.now() - lastLeafTime > LEAF_INTERVAL_MOBILE) {
      const touch = e.touches[0];
      if (touch) {
        createLeaf(touch.pageX, touch.pageY);
      }
      lastLeafTime = Date.now();
    }
  }, { passive: true });

  // ⭐ листья при скролле страницы
  let scrollLeafRaf = null;
  window.addEventListener('scroll', () => {
    if (scrollLeafRaf) return;
    scrollLeafRaf = requestAnimationFrame(() => {
      if (Date.now() - lastLeafTime > LEAF_INTERVAL_MOBILE) {
        spawnLeafFromViewport();
        lastLeafTime = Date.now();
      }
      scrollLeafRaf = null;
    });
  }, { passive: true });

  document.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    if (touch) createLeaf(touch.pageX, touch.pageY);
  }, { passive: true });

  document.addEventListener('touchend', () => {
    lastLeafTime = 0;
  }, { passive: true });
}

// Легкий параллакс для секции подарков (опционально)
const parallaxBgElements = document.querySelectorAll('.parallax-bg');
if (parallaxBgElements.length) {
  let parallaxRaf = null;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    parallaxBgElements.forEach(bg => {
      const speed = parseFloat(bg.dataset.speed) || 0.15;
      const yPos = -(scrollY * speed);
      bg.style.transform = `translateY(${yPos}px)`;
    });
    parallaxRaf = null;
  };

  window.addEventListener('scroll', () => {
    if (isMobile || prefersReducedMotion) return;
    if (parallaxRaf) return;

    parallaxRaf = requestAnimationFrame(updateParallax);
  }, { passive: true });
}

// RSVP logic removed

// ===== ГОСТЕВАЯ КНИГА =====
const guestbookForm = document.getElementById('guestbook-form');
const guestMediaInput = document.getElementById('guestMedia');
const filePreviewContainer = document.getElementById('file-preview');
const guestbookStatus = document.getElementById('guestbook-status');

const wishingTreeContainer = document.getElementById('wishing-tree-container');
const leafModal = document.getElementById('leaf-modal');
const leafModalBody = document.getElementById('leaf-modal-body');
const closeLeafModal = document.getElementById('close-leaf-modal');

if (closeLeafModal) {
    closeLeafModal.addEventListener('click', () => {
        leafModal.classList.remove('show');
        leafModal.querySelectorAll('video').forEach(v => v.pause());
    });
}
if (leafModal) {
    window.addEventListener('click', (e) => {
        if (e.target === leafModal) {
            leafModal.classList.remove('show');
            leafModal.querySelectorAll('video').forEach(v => v.pause());
        }
    });
}

if (guestMediaInput) {
  guestMediaInput.addEventListener('change', function() {
    filePreviewContainer.innerHTML = '';
    const files = Array.from(this.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        let previewEl;
        if (file.type.startsWith('image/')) {
          previewEl = document.createElement('img');
          previewEl.src = e.target.result;
        } else if (file.type.startsWith('video/')) {
          previewEl = document.createElement('video');
          previewEl.src = e.target.result;
          previewEl.muted = true;
          previewEl.play();
        }
        if (previewEl) {
          filePreviewContainer.appendChild(previewEl);
        }
      }
      reader.readAsDataURL(file);
    });
  });
}

function renderMessages(data) {
  // Очищаем дерево от старых листьев перед обновлением (кроме картинки самого дерева)
  const existingLeaves = wishingTreeContainer.querySelectorAll('.polaroid-leaf');
  existingLeaves.forEach(leaf => leaf.remove());

  if (data.length === 0) {
    return; // пустое дерево
  }
  
  const placedLeaves = []; // Храним координаты уже размещенных листочков
  
  data.forEach((msg, index) => {
    const leaf = document.createElement('div');
    leaf.className = 'polaroid-leaf fade-in';
    setTimeout(() => leaf.classList.add('visible'), 100 * index);

    // Распределяем листья строго по кроне дерева (в форме эллипса)
    // и проверяем, чтобы они не перекрывали друг друга
    let leftPercent, topPercent;
    let isValid = false;
    let attempts = 0;
    
    while (!isValid && attempts < 100) {
        attempts++;
        leftPercent = 15 + Math.random() * 70; // от 15% до 85% по ширине
        topPercent = 5 + Math.random() * 50;   // от 5% до 55% по высоте
        
        // Центр кроны примерно на 50% ширины и 30% высоты
        // Радиусы эллипса кроны: Rx = 35%, Ry = 25%
        const nx = (leftPercent - 50) / 35;
        const ny = (topPercent - 30) / 25;
        
        // Уравнение эллипса: x^2 + y^2 <= 1
        if (nx * nx + ny * ny <= 1) {
            // Проверяем пересечения с другими
            let isOverlapping = false;
            for (let placed of placedLeaves) {
                const dx = Math.abs(placed.x - leftPercent);
                const dy = Math.abs(placed.y - topPercent);
                // Карточка примерно 8-10% в ширину и 10-12% в высоту, берём запас
                if (dx < 8 && dy < 12) {
                    isOverlapping = true;
                    break;
                }
            }
            
            // Если не перекрывается (или мы отчаялись после 80 попыток), ставим
            if (!isOverlapping || attempts > 80) {
                isValid = true;
            }
        }
    }
    
    placedLeaves.push({x: leftPercent, y: topPercent});
    
    leaf.style.top = `${topPercent}%`;
    leaf.style.left = `${leftPercent}%`;
    
    // Разная анимация и поворот для каждого листочка
    const rotation = -10 + Math.random() * 20;
    leaf.style.transform = `rotate(${rotation}deg)`;
    leaf.style.animationDelay = `${Math.random() * 5}s`;

    // Что показывать на превью (картинка или текст)
    let previewHtml = '';
    if (msg.media && msg.media.length > 0) {
        const firstMedia = msg.media[0];
        if (firstMedia.type === 'image') {
            previewHtml = `<div class="polaroid-img-preview" style="background-image: url('${firstMedia.url}');"></div>`;
        } else if (firstMedia.type === 'video') {
            previewHtml = `<div class="polaroid-img-preview" style="background: #2a2a2a; display:flex; align-items:center; justify-content:center; color:#C9A25B; font-size:18px;"><i class="fas fa-video"></i></div>`;
        }
    } else {
        const shortText = msg.text.length > 20 ? msg.text.substring(0, 20) + '...' : msg.text;
        previewHtml = `<div class="polaroid-text-preview">${shortText}</div>`;
    }

    // Защита от XSS
    const safeName = msg.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    leaf.innerHTML = `
        ${previewHtml}
        <div class="polaroid-author">${safeName}</div>
    `;

    // Клик открывает модалку со всем сообщением
    leaf.addEventListener('click', () => {
        let mediaHtml = '';
        if (msg.media && msg.media.length > 0) {
          mediaHtml = '<div class="guest-media-grid">';
          msg.media.forEach(m => {
            if (m.type === 'image') {
              mediaHtml += `<img src="${m.url}" alt="Фото от гостя" onclick="window.open('${m.url}', '_blank')">`;
            } else if (m.type === 'video') {
              mediaHtml += `<video src="${m.url}" controls></video>`;
            }
          });
          mediaHtml += '</div>';
        }

        const safeText = msg.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        leafModalBody.innerHTML = `
            <div class="guest-name">${safeName}</div>
            <div class="guest-text">${safeText}</div>
            ${mediaHtml}
        `;
        leafModal.classList.add('show');
    });

    wishingTreeContainer.appendChild(leaf);
  });
}

function loadGuestbookMessages() {
  if (!wishingTreeContainer) return;
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocal) {
    const mockData = JSON.parse(localStorage.getItem('mockGuestbook') || '[]');
    renderMessages(mockData);
    return;
  }

  fetch('api/get_messages.php')
    .then(res => res.json())
    .then(data => renderMessages(data))
    .catch(err => {
      console.error('Ошибка загрузки пожеланий для дерева:', err);
    });
}

if (guestbookForm) {
  guestbookForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = guestbookForm.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Отправка...';
    guestbookStatus.className = 'guestbook-status';
    guestbookStatus.textContent = '';

    const name = document.getElementById('guestName').value;
    const message = document.getElementById('guestMessage').value;
    const files = guestMediaInput.files;

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
        // КОСТЫЛЬ ДЛЯ ЛОКАЛЬНОГО СЕРВЕРА
        const filePromises = Array.from(files).map(file => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => {
              resolve({
                type: file.type.startsWith('image/') ? 'image' : 'video',
                url: e.target.result
              });
            };
            reader.readAsDataURL(file);
          });
        });

        Promise.all(filePromises).then(media => {
          const mockMsg = {
            id: Date.now(),
            name: name,
            text: message,
            media: media,
            timestamp: Date.now()
          };
          
          let mockData = JSON.parse(localStorage.getItem('mockGuestbook') || '[]');
          mockData.push(mockMsg);
          localStorage.setItem('mockGuestbook', JSON.stringify(mockData));

          guestbookStatus.className = 'guestbook-status success';
          guestbookStatus.textContent = '(Локал) Спасибо! Ваше пожелание добавлено на дерево.';
          guestbookForm.reset();
          filePreviewContainer.innerHTML = '';
          
          loadGuestbookMessages(); // reload tree
          
          btn.disabled = false;
          btn.textContent = 'Отправить';
          setTimeout(() => { guestbookStatus.textContent = ''; }, 5000);
        });
        return;
    }

    // РЕАЛЬНЫЙ ЗАПРОС НА ХОСТИНГ
    const formData = new FormData();
    formData.append('name', name);
    formData.append('message', message);
    
    for (let i = 0; i < files.length; i++) {
      formData.append('guestMedia[]', files[i]);
    }

    fetch('api/submit_message.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        guestbookStatus.className = 'guestbook-status success';
        guestbookStatus.textContent = 'Спасибо! Ваше пожелание добавлено.';
        guestbookForm.reset();
        filePreviewContainer.innerHTML = '';
        loadGuestbookMessages(); // reload feed
      } else {
        guestbookStatus.className = 'guestbook-status error';
        guestbookStatus.textContent = data.error || 'Произошла ошибка при отправке.';
      }
    })
    .catch(err => {
      guestbookStatus.className = 'guestbook-status error';
      guestbookStatus.textContent = 'Ошибка соединения с сервером.';
      console.error(err);
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Отправить';
      setTimeout(() => { guestbookStatus.textContent = ''; }, 5000);
    });
  });

  // Load messages initially
  loadGuestbookMessages();
}

// ===== ПОГОДА =====
async function loadRealWeather() {
  try {
    const lat = 44.4952;
    const lon = 34.1663;
    const url = `https://seasonal-api.open-meteo.com/v1/seasonal?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,windspeed_10m_max,precipitation_sum&timezone=Europe%2FMoscow&forecast_days=30`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const targetDate = '2026-08-02';
    
    let temp = 29;
    let wind = 3;
    let rainSum = 0;
    let code = 0;
    let displayDate = '2 Августа';
    
    if (data && data.daily && data.daily.time) {
      const index = data.daily.time.indexOf(targetDate);
      if (index !== -1) {
        temp = Math.round(data.daily.temperature_2m_max[index]);
        wind = Math.round(data.daily.windspeed_10m_max[index] * 1000 / 3600);
        rainSum = Math.round(data.daily.precipitation_sum[index] * 10) / 10;
        code = data.daily.weathercode[index];
      }
    }
    
    const tempEl = document.getElementById('weather-temp-main');
    if (tempEl) tempEl.textContent = (temp > 0 ? '+' : '') + temp + '°';
    
    const windEl = document.getElementById('weather-wind');
    if (windEl) windEl.textContent = wind + ' м/с';
    
    const rainEl = document.getElementById('weather-rain');
    if (rainEl) rainEl.textContent = rainSum > 0 ? rainSum + ' мм' : '0 мм';

    const badge = document.getElementById('weather-badge');
    if (badge) badge.textContent = 'Прогноз';

    let desc = 'Ясно';
    let iconClass = 'fas fa-sun';
    
    if (code === 1 || code === 2 || code === 3) {
      desc = 'Облачно';
      iconClass = 'fas fa-cloud-sun';
    } else if (code >= 45 && code <= 48) {
      desc = 'Туман';
      iconClass = 'fas fa-smog';
    } else if (code >= 51 && code <= 67) {
      desc = 'Дождь';
      iconClass = 'fas fa-cloud-rain';
    } else if (code >= 71 && code <= 82) {
      desc = 'Снег';
      iconClass = 'fas fa-snowflake';
    } else if (code >= 95 && code <= 99) {
      desc = 'Гроза';
      iconClass = 'fas fa-bolt';
    }

    const descEl = document.getElementById('weather-desc');
    if (descEl) descEl.textContent = desc;

    const iconEl = document.getElementById('weather-icon');
    if (iconEl) {
      iconEl.className = iconClass + ' weather-icon-sun';
      if (code === 0) {
        iconEl.classList.add('spin-icon');
      } else {
        iconEl.classList.remove('spin-icon');
      }
    }
    
    const titleEl = document.getElementById('weather-title');
    if (titleEl) titleEl.textContent = 'Ялта • ' + displayDate;
    
  } catch (error) {
    console.error('Ошибка загрузки погоды:', error);
    const descEl = document.getElementById('weather-desc');
    if (descEl) descEl.textContent = 'Недоступно';
  }
}

document.addEventListener('DOMContentLoaded', () => {
    loadRealWeather();
    initGiftModal();
    initAdmin();
});
function initGiftModal() {
  const items = document.querySelectorAll('.wishlist-item');
  const modal = document.getElementById('gift-modal');
  const close = document.getElementById('gift-modal-close');
  const yes = document.getElementById('gift-modal-yes');
  const no = document.getElementById('gift-modal-no');
  const view = document.getElementById('gift-modal-view');
  const nameEl = document.getElementById('gift-modal-item-name');
  let currentItem = null;

  items.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('gifted')) return;
      currentItem = item;
      nameEl.textContent = item.dataset.item;
      if (item.dataset.link) {
        view.href = item.dataset.link;
        view.style.display = 'inline-block';
      } else {
        view.style.display = 'none';
      }
      modal.classList.add('show');
    });
  });

  function closeModal() {
    modal.classList.remove('show');
    currentItem = null;
  }

  close.addEventListener('click', closeModal);
  no.addEventListener('click', closeModal);

  yes.addEventListener('click', () => {
    if (currentItem) {
      currentItem.classList.add('gifted');
      currentItem.style.pointerEvents = 'none';
      closeModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// ===== АДМИНКА =====
function initAdmin() {
  const btn = document.getElementById('admin-btn');
  const modal = document.getElementById('admin-modal');
  const close = document.getElementById('admin-modal-close');
  const submit = document.getElementById('admin-submit');
  const keyInput = document.getElementById('admin-key');
  const errorEl = document.getElementById('admin-error');
  const listEl = document.getElementById('admin-list');

  btn.addEventListener('click', () => {
    modal.classList.add('show');
    errorEl.textContent = '';
    listEl.innerHTML = '';
    keyInput.value = '';
  });

  close.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  submit.addEventListener('click', () => {
    const key = keyInput.value.trim();
    if (!key) {
      errorEl.textContent = 'Введите ключ доступа';
      return;
    }
    listEl.innerHTML = '<p style="text-align:center;color:#666;">Загрузка...</p>';
    fetch('api/get_messages.php')
      .then(res => res.json())
      .then(messages => {
        if (!messages.length) {
          listEl.innerHTML = '<p style="text-align:center;color:#666;">Нет сообщений</p>';
          return;
        }
        listEl.innerHTML = messages.map(msg => `
          <div class="admin-msg-card" data-id="${msg.id}">
            <div class="admin-msg-info">
              <strong>${msg.name}</strong> · ${new Date(msg.timestamp * 1000).toLocaleDateString()}<br>
              ${msg.text}
            </div>
            <button class="admin-del-btn" onclick="adminDelete('${msg.id}', '${key}')">Удалить</button>
          </div>
        `).join('');
        errorEl.textContent = '';
      })
      .catch(() => {
        listEl.innerHTML = '';
        errorEl.textContent = 'Ошибка загрузки сообщений';
      });
  });
}

window.adminDelete = function(id, key) {
  if (!confirm('Удалить это сообщение?')) return;
  const formData = new FormData();
  formData.append('id', id);
  formData.append('key', key);
  fetch('api/delete_message.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const card = document.querySelector(`.admin-msg-card[data-id="${id}"]`);
        if (card) card.remove();
        loadGuestbookMessages();
      } else {
        alert(data.error || 'Ошибка удаления');
      }
    })
    .catch(() => alert('Ошибка соединения'));
};
