// Điều hướng trên điện thoại, giữ nguyên liên kết và xử lý thành viên hiện có.
(() => {
  const header = document.querySelector('header');
  const nav = header?.querySelector('nav');
  const brandrow = header?.querySelector('.brandrow');
  if (!nav || !brandrow) return;

  nav.id = 'site-navigation';
  nav.setAttribute('aria-label', 'Điều hướng chính');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'menu-toggle';
  toggle.setAttribute('aria-controls', nav.id);
  toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Menu</span>';
  const setOpen = (open) => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setOpen(false);
      if (window.matchMedia('(max-width: 900px)').matches) toggle.focus({ preventScroll: true });
    }
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(max-width: 900px)').addEventListener('change', () => setOpen(false));
  setOpen(false);
  brandrow.append(toggle);
  header.classList.add('navigation-ready');
})();
