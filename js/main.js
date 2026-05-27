/* ============================================================
   성광진 캠프 공통 JS — main.js
   data.js(SKJ_DATA)를 script 태그로 먼저 로드한 뒤 사용
   ============================================================ */
'use strict';

/* ── 데이터 접근 (동기, fetch 없음) ── */
function getData() {
  return Promise.resolve(SKJ_DATA);
}

/* ── 네비게이션 ── */
function initNav() {
  const nav       = document.querySelector('.site-nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* 현재 페이지 active 표시 */
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && location.pathname.endsWith(href.split('/').pop())) {
      link.classList.add('active');
    }
  });
}

/* ── D-day 배너 ── */
function initDday() {
  const banner    = document.getElementById('dday-banner');
  if (!banner) return;

  const electionDate = new Date('2026-06-03T00:00:00+09:00');
  const earlyStart   = new Date('2026-05-29T06:00:00+09:00');
  const earlyEnd     = new Date('2026-05-30T18:00:00+09:00');
  const countEl      = document.getElementById('dday-count');
  const messageEl    = document.getElementById('dday-message');
  const closeBtn     = document.getElementById('dday-close');

  if (closeBtn) closeBtn.addEventListener('click', () => { banner.style.display = 'none'; });

  function update() {
    const now    = new Date();
    const diffMs = electionDate - now;

    if (now >= earlyStart && now <= earlyEnd) {
      if (messageEl) messageEl.textContent = '🗳 지금 사전투표가 진행 중입니다!';
      if (countEl)   countEl.textContent   = '투표하러 가세요';
    } else if (diffMs <= 0) {
      if (messageEl) messageEl.textContent = '🗳 오늘이 선거일 6월 3일입니다!';
      if (countEl)   countEl.textContent   = '대전교육 대전환의 날';
    } else {
      const days    = Math.floor(diffMs / 86400000);
      const hours   = Math.floor((diffMs % 86400000) / 3600000);
      const minutes = Math.floor((diffMs % 3600000)  / 60000);
      const seconds = Math.floor((diffMs % 60000)    / 1000);
      if (countEl)   countEl.textContent   = `D-${days}`;
      if (messageEl) messageEl.textContent =
        `선거일 6월 3일까지 ${days}일 ${hours}시간 ${minutes}분 ${seconds}초 · 사전투표 5/29~30`;
    }
  }
  update();
  setInterval(update, 1000);
}

/* ── Fade-in 스크롤 옵저버 ── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ── 공통 네비 HTML ── */
function buildNav(base) {
  return `
  <a href="#main-content" class="skip-nav">본문 바로가기</a>
  <nav class="site-nav" aria-label="주 메뉴">
    <div class="nav-inner">
      <a href="${base}index.html" class="nav-logo" aria-label="성광진 캠프 홈">
        준비된 교육감 <span class="logo-accent">성광진</span>
      </a>
      <div class="nav-links" role="list">
        <a href="${base}pages/candidate.html"  role="listitem">후보 소개</a>
        <a href="${base}pages/promises.html"   role="listitem">3대 약속</a>
        <a href="${base}pages/policies.html"   role="listitem">대전교육 9하기</a>
        <a href="${base}pages/news.html"       role="listitem">뉴스/알림</a>
        <a href="${base}pages/together.html"   role="listitem" class="nav-cta">🗳 함께하기</a>
      </div>
      <button class="nav-hamburger" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobile-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <nav class="nav-mobile" id="mobile-nav" aria-label="모바일 메뉴">
    <a href="${base}pages/candidate.html">후보 소개</a>
    <a href="${base}pages/promises.html">3대 약속</a>
    <a href="${base}pages/policies.html">대전교육 9하기</a>
    <a href="${base}pages/news.html">뉴스/알림</a>
    <a href="${base}pages/together.html" class="nav-cta">🗳 함께하기 · 투표 안내</a>
  </nav>`;
}

/* ── 공통 푸터 HTML ── */
function buildFooter(base) {
  const d = SKJ_DATA.sns;
  const togetherLink = base + 'pages/together.html';
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-logo">준비된 교육감 성광진</div>
      <p style="font-size:.875rem;margin-top:.35rem;opacity:.75">
        대전광역시교육감선거 · 민주진보 교육감 단일후보<br>
        미래교육을 위한 대전시민 교육감 단일화 시민회의 추대 (성광진, 강재구 참여)
      </p>
      <div style="display:flex;gap:1.25rem;margin-top:1.25rem;flex-wrap:wrap">
        <a href="${d.youtube}"   target="_blank" rel="noopener" class="footer-sns-link">▶ 유튜브</a>
        <a href="${d.facebook}"  target="_blank" rel="noopener" class="footer-sns-link">f 페이스북</a>
        <a href="${d.instagram}" target="_blank" rel="noopener" class="footer-sns-link">📸 인스타그램</a>
        <a href="${d.threads}"   target="_blank" rel="noopener" class="footer-sns-link">@ 스레드</a>
        <a href="${d.blog}"      target="_blank" rel="noopener" class="footer-sns-link">N 블로그</a>
      </div>
      <div class="footer-notice">
        ※ 본 웹사이트는 2026년 제9회 전국동시지방선거 대전광역시교육감선거 성광진 후보 공식 캠프 사이트입니다.<br>
        ※ 게재된 정책 내용은 선거공보 원문을 기반으로 하며 선거법의 범위 내에서 운영됩니다.<br>
        ※ 선거기간 중 허위사실 유포 및 불법 선거운동은 공직선거법에 따라 처벌받을 수 있습니다.
      </div>
    </div>
  </footer>
  <div class="dday-banner" id="dday-banner" role="complementary" aria-label="선거일 D-day">
    <span class="dday-label" id="dday-message">선거일 6월 3일까지</span>
    <span class="dday-count" id="dday-count">계산 중...</span>
    <a href="${togetherLink}" class="btn-sm">투표 안내 보기</a>
    <button class="dday-close" id="dday-close" aria-label="배너 닫기">✕</button>
  </div>`;
}

/* ── 페이지 초기화 ── */
function initPage() {
  const isSubPage = location.pathname.includes('/pages/');
  const base      = isSubPage ? '../' : './';

  const navEl  = document.getElementById('nav-placeholder');
  const footEl = document.getElementById('footer-placeholder');
  if (navEl)  navEl.innerHTML  = buildNav(base);
  if (footEl) footEl.innerHTML = buildFooter(base);

  initNav();
  initFadeIn();
  initDday();
}

document.addEventListener('DOMContentLoaded', initPage);
