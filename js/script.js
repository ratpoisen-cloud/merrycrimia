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

  const countdownEls = {
    d: document.getElementById('days'),
    h: document.getElementById('hours'),
    m: document.getElementById('minutes'),
    s: document.getElementById('seconds')
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
    { el: document.querySelector('header'), index: 0 },
    { el: document.getElementById('wishlist'), index: 1 },
    { el: document.getElementById('details'), index: 2 }
  ];

  function activateLayer(index) {
    layers.forEach((layer, i) => {
      layer.classList.toggle('active', i === index);
    });
  }

  // Активируем первый слой по умолчанию
  activateLayer(0);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = sections.find(s => s.el === entry.target);
        if (section) {
          activateLayer(section.index);
        }
      }
    });
  }, {
    rootMargin: '0px 0px -50% 0px',
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
    });
}
if (leafModal) {
    window.addEventListener('click', (e) => {
        if (e.target === leafModal) {
            leafModal.classList.remove('show');
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
                if (dx < 10 && dy < 14) {
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
            previewHtml = `<div class="polaroid-img-preview" style="background-color: #333; display:flex; align-items:center; justify-content:center; color:#fff;"><i class="fas fa-play" style="font-size:12px;"></i></div>`;
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
    loadWishlist();
});

// ===== ИНТЕРАКТИВНЫЙ ВИШ-ЛИСТ =====
const wishlistContainer = document.getElementById('dynamic-wishlist');

function loadWishlist() {
    if (!wishlistContainer) return;

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocal) {
        // Мок для локальной разработки
        let localData = localStorage.getItem('mockWishlistV5');
        if (!localData) {
            localData = [
                {"id": "1", "name": "3D принтер Bambu Lab", "link": "https://market.yandex.ru/card/3d-printer-bambu-lab-a1-mini-bez-ams-sistemy-eu/4657311831?do-waremd5=TbxZYrS2BcxDe7iYBkXrww&cpc=G3IIPaE9ym3c94MZ8vjXNtwRRDyakVBGtaOlApfRVCzz3MNdXS67UOdj5qJ2Z2vrfRnuWF0kkCQiJno5mJofMDfnwoa_uvXHwXJd-uBdERMI1GuwRh2aK-YDd9HnjjIOubCL6xKahI386IZcsYwBs6PiQZeMspyWapkoLi6GE2L5S1FPjX2LvreP8s5e88NMgeiXiISJD3wmOGEjXoOkxHJBi93r1nAhOh0mufNGJo4jmdA7oIBgcpz5Lg9dFJvbKcRtW8OfkXp4VXGiH35_qcmF79LWhxLeEBdtJ3SXaFXyBEOXi8MGIHN10FdJ9kDY6_ZnTp74wesg0IJ0q8THLVJ59oNTVKQCCnYxhLQWN4jtX8ws1poP2zg1l_kefAgOFa1LEsgWqUwyuI_u9H_oJ1j_HpwZJA0e5Ap3c6GdpdpWfEmxTDM6O2wajRd_Zcww&nid=27022410&ogV=-12", "claimed": false, "claimedBy": null},
                {"id": "2", "name": "Кастрюля", "link": "https://www.ozon.ru/product/kokot-savosa-4-8-l-emalirovannaya-chugunnaya-kastryulya-s-kryshkoy-26-sm-savosa-dlya-induktsionnoy-1315535347/", "claimed": false, "claimedBy": null},
                {"id": "3", "name": "Книги с вашими подписями", "claimed": false, "claimedBy": null},
                {"id": "4", "name": "50-ти литровая канистра 95 бензина", "claimed": false, "claimedBy": null},
                {"id": "5", "name": "Заднее правое крыло для Skoda Octavia", "claimed": false, "claimedBy": null}
            ];
            localStorage.setItem('mockWishlistV5', JSON.stringify(localData));
        } else {
            localData = JSON.parse(localData);
        }
        renderWishlist(localData);
        return;
    }

    // Реальный запрос к API
    fetch('api/get_wishlist.php')
        .then(res => res.json())
        .then(data => renderWishlist(data))
        .catch(err => {
            console.error('Ошибка загрузки виш-листа:', err);
            wishlistContainer.innerHTML = '<p style="color:red;text-align:center;">Ошибка загрузки списка подарков.</p>';
        });
}

function renderWishlist(data) {
    wishlistContainer.innerHTML = '';
    
    data.forEach(gift => {
        const item = document.createElement('div');
        item.className = `gift-item ${gift.claimed ? 'claimed' : ''}`;
        
        let actionHtml = '';
        if (gift.claimed) {
            const safeName = gift.claimedBy ? gift.claimedBy.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'Кто-то';
            actionHtml = `<div class="gift-claimed-text">Выбрано (${safeName})</div>`;
        } else {
            actionHtml = `<button class="gift-btn" onclick="claimGift('${gift.id}')">Подарить</button>`;
        }

        let nameHtml = gift.name;
        if (gift.link && !gift.claimed) {
            // Если есть ссылка и подарок не выбран, делаем имя кликабельным
            nameHtml = `<a href="${gift.link}" target="_blank" style="color: var(--forest-sage); text-decoration: underline; transition: color 0.3s;" onmouseover="this.style.color='var(--forest-deep)'" onmouseout="this.style.color='var(--forest-sage)'">${gift.name}</a>`;
        } else if (gift.link && gift.claimed) {
            // Если выбран, просто текст
            nameHtml = `<span>${gift.name}</span>`;
        }

        item.innerHTML = `
            <div class="gift-info">
                <i class="fas fa-leaf"></i> 
                <span>${nameHtml}</span>
            </div>
            <div class="gift-action">
                ${actionHtml}
            </div>
        `;
        wishlistContainer.appendChild(item);
    });
}

window.claimGift = function(id) {
    const guestName = prompt("Введите ваше имя, чтобы мы знали, от кого этот подарок:");
    if (!guestName || guestName.trim() === '') return;

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocal) {
        let localData = JSON.parse(localStorage.getItem('mockWishlistV5') || '[]');
        const gift = localData.find(g => g.id === id);
        if (gift && !gift.claimed) {
            gift.claimed = true;
            gift.claimedBy = guestName.trim();
            localStorage.setItem('mockWishlistV5', JSON.stringify(localData));
            loadWishlist();
        } else {
            alert("Этот подарок уже выбран.");
        }
        return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('guestName', guestName);

    fetch('api/claim_gift.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadWishlist();
        } else {
            alert(data.error || "Произошла ошибка при бронировании подарка.");
        }
    })
    .catch(err => {
        console.error('Ошибка бронирования:', err);
        alert("Ошибка соединения с сервером.");
    });
};
