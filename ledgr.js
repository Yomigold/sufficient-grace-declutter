'use strict';

// Apply saved theme + font size immediately on script load
(function() {
  try {
    const p = JSON.parse(localStorage.getItem('ledgr_prefs')) || {};
    document.documentElement.dataset.theme    = p.theme    || 'dark';
    document.documentElement.dataset.fontSize = p.fontSize || 'medium';
  } catch(e) {}
})();

// ─── PWA: installable, standalone, offline-capable ──────────────────────────
let _installPrompt = null;

(function initPWA() {
  const head = document.head;
  function meta(name, content) {
    if (document.querySelector(`meta[name="${name}"]`)) return;
    const m = document.createElement('meta');
    m.name = name; m.content = content; head.appendChild(m);
  }
  function link(rel, href, extra) {
    const l = document.createElement('link');
    l.rel = rel; l.href = href;
    if (extra) Object.assign(l, extra);
    head.appendChild(l);
  }
  // Cover the notch / safe areas
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp && !/viewport-fit/.test(vp.content)) vp.content += ', viewport-fit=cover';
  // Standalone app chrome
  meta('theme-color', '#0b0b13');
  meta('mobile-web-app-capable', 'yes');
  meta('apple-mobile-web-app-capable', 'yes');
  meta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  meta('apple-mobile-web-app-title', 'Ledgr');
  if (!document.querySelector('link[rel="manifest"]')) link('manifest', '/manifest.webmanifest');
  if (!document.querySelector('link[rel="apple-touch-icon"]')) link('apple-touch-icon', '/icon-192.png');

  // Capture Android install prompt — don't let Chrome auto-mini-bar it
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (!isStandalone) {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      _installPrompt = e;
      showInstallBanner();
    });
    window.addEventListener('appinstalled', () => {
      _installPrompt = null;
      const b = document.getElementById('pwa-install-bar');
      if (b) b.remove();
    });
  }

  // Register the service worker (offline shell + Android install prompt)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        if (reg.waiting) showUpdateBanner(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner(nw);
            }
          });
        });
      }).catch(() => {});
      // Reload once the new SW takes control
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!reloading) { reloading = true; location.reload(); }
      });
    });
  }
})();

function showInstallBanner() {
  if (document.getElementById('pwa-install-bar')) return;
  const bar = document.createElement('div');
  bar.id = 'pwa-install-bar';
  bar.innerHTML = `
    <div class="pwa-install-left">
      <svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22" style="color:var(--gold);flex-shrink:0"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      <div>
        <div class="pwa-install-title">Install Ledgr</div>
        <div class="pwa-install-sub">Add to home screen for the best experience</div>
      </div>
    </div>
    <div class="pwa-install-actions">
      <button id="pwa-install-btn">Install</button>
      <button id="pwa-dismiss-btn" aria-label="Dismiss">✕</button>
    </div>`;
  document.body.appendChild(bar);
  document.getElementById('pwa-install-btn').addEventListener('click', async () => {
    if (!_installPrompt) return;
    _installPrompt.prompt();
    const { outcome } = await _installPrompt.userChoice;
    if (outcome === 'accepted') {
      _installPrompt = null;
      bar.remove();
    }
  });
  document.getElementById('pwa-dismiss-btn').addEventListener('click', () => bar.remove());
}

function showUpdateBanner(worker) {
  if (document.getElementById('sw-update-bar')) return;
  const bar = document.createElement('div');
  bar.id = 'sw-update-bar';
  bar.innerHTML = '<span>New version available</span><button id="sw-update-btn">Update now</button>';
  document.body.appendChild(bar);
  bar.querySelector('#sw-update-btn').addEventListener('click', () => {
    bar.remove();
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
}

// ─── Storage ────────────────────────────────────────────────────────────────────────────────
const LS = { ITEMS: 'ledgr_items', NOTIFICATIONS: 'ledgr_notifs', PREFS: 'ledgr_prefs' };
const LS_PROFILE     = 'ledgr_profile';
const LS_REPORT_SENT = 'ledgr_report_sent';
const LS_AUTH        = 'ledgr_auth';
const SS_TOKEN       = 'ledgr_token';
const LS_TOKEN       = 'ledgr_token_r';
const LS_IG_SYNC     = 'ledgr_ig_sync';

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// One-time migration: convert any SGD items to NGN
(function migrateSGDtoNGN() {
  try {
    const items = JSON.parse(localStorage.getItem(LS.ITEMS)) || [];
    let changed = false;
    items.forEach(item => {
      if (!item.sellersCurrency || item.sellersCurrency === 'SGD') {
        item.sellersCurrency = 'NGN';
        changed = true;
      }
    });
    if (changed) localStorage.setItem(LS.ITEMS, JSON.stringify(items));
  } catch(e) {}
})();

function getItems() {
  try { return JSON.parse(localStorage.getItem(LS.ITEMS)) || []; } catch { return []; }
}
function setItems(items) { localStorage.setItem(LS.ITEMS, JSON.stringify(items)); }
function getItem(id) { return getItems().find(i => i.id === id) || null; }

function saveItem(data) {
  const items = getItems();
  const idx = items.findIndex(i => i.id === data.id);
  const now = new Date().toISOString();
  if (idx >= 0) {
    const prev = items[idx];
    items[idx] = { ...prev, ...data, updatedAt: now };
    if (prev.status !== data.status && data.notifyOnChange) {
      pushNotification({
        itemId: data.id, itemName: data.name,
        message: `"${data.name}" moved from ${cap(prev.status)} → ${cap(data.status)}`,
        type: 'status_change',
      });
    }
  } else {
    const item = { ...data, id: data.id || uid(), createdAt: now, updatedAt: now };
    items.unshift(item);
    if (data.notifyOnChange) {
      pushNotification({
        itemId: item.id, itemName: item.name,
        message: `"${item.name}" added as ${cap(item.status)}`,
        type: 'new_item',
      });
    }
  }
  setItems(items);
}

function deleteItem(id) { setItems(getItems().filter(i => i.id !== id)); }

function getNotifications() {
  try { return JSON.parse(localStorage.getItem(LS.NOTIFICATIONS)) || []; } catch { return []; }
}
function setNotifications(n) { localStorage.setItem(LS.NOTIFICATIONS, JSON.stringify(n)); }
function pushNotification({ itemId, itemName, message, type }) {
  const n = getNotifications();
  n.unshift({ id: uid(), itemId, itemName, message, type, read: false, createdAt: new Date().toISOString() });
  setNotifications(n);
}
function markRead(id) { setNotifications(getNotifications().map(n => n.id === id ? { ...n, read: true } : n)); }
function markAllRead() { setNotifications(getNotifications().map(n => ({ ...n, read: true }))); }
function clearNotifications() { setNotifications([]); }
function unreadCount() { return getNotifications().filter(n => !n.read).length; }

function getStats() {
  const items = getItems();
  const sold  = items.filter(i => i.status === 'sold');
  return {
    total:     items.length,
    listed:    items.filter(i => i.status === 'listed').length,
    available: items.filter(i => i.status === 'available').length,
    sold:      sold.length,
    revenue:   sold.reduce((s, i) => s + (Number(i.sellersAmount) || 0), 0),
    margin:    sold.reduce((s, i) => s + (Number(i.sgdMargin) || 0), 0),
    profit:    sold.reduce((s, i) => {
      const sale = Number(i.sellersAmount) || 0;
      const cost = Number(i.costPrice) || 0;
      return s + (cost > 0 ? sale - cost : (Number(i.sgdMargin) || 0));
    }, 0),
  };
}

const CURRENCY_SYMBOLS = { SGD: 'S$', NGN: '₦', USD: 'US$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', HKD: 'HK$', CNY: 'CN¥' };

function formatSGD(n) {
  return 'S$' + Number(n || 0).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatAmount(amount, currency = 'NGN') {
  const sym = CURRENCY_SYMBOLS[currency] || (currency + ' ');
  const dec = currency === 'JPY' ? 0 : 2;
  return sym + Number(amount || 0).toLocaleString('en-SG', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
}
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function esc(s) {
  const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML;
}

function refreshNavBadge() {
  const badge = document.querySelector('.notif-badge');
  if (!badge) return;
  const c = unreadCount();
  badge.textContent = c > 9 ? '9+' : c;
  badge.hidden = c === 0;
}

// ─── Profile & Theme ────────────────────────────────────────────────────────────────────────
function getPrefs() {
  try { return JSON.parse(localStorage.getItem(LS.PREFS)) || {}; } catch { return {}; }
}
function setPrefs(p) { localStorage.setItem(LS.PREFS, JSON.stringify(p)); }

function getProfile() {
  try { return JSON.parse(localStorage.getItem(LS_PROFILE)) || {}; } catch { return {}; }
}
function setProfile(p) { localStorage.setItem(LS_PROFILE, JSON.stringify(p)); }

function initTheme() {
  const prefs = getPrefs();
  document.documentElement.dataset.theme = prefs.theme || 'dark';
}

function refreshNavAvatar() {
  const el = document.getElementById('navAvatarWrap');
  if (!el) return;
  const profile = getProfile();
  if (profile.pic) {
    el.innerHTML = `<img src="${profile.pic}" class="nav-avatar-img" alt="Profile">`;
  } else {
    const initial = (profile.displayName || '').charAt(0).toUpperCase() || '?';
    el.innerHTML = `<div class="nav-avatar-initials">${initial}</div>`;
  }
}

// ─── Bulk Select ──────────────────────────────────────────────────────────────
let _selectedIds = new Set();

function onCardSelect(id, checked) {
  if (checked) _selectedIds.add(id); else _selectedIds.delete(id);
  _updateBulkBar();
}

function _updateBulkBar() {
  let bar = document.getElementById('bulkBar');
  if (_selectedIds.size === 0) { if (bar) bar.remove(); return; }
  if (!bar) { bar = document.createElement('div'); bar.id = 'bulkBar'; bar.className = 'bulk-bar'; document.body.appendChild(bar); }
  bar.innerHTML = `
    <span class="bulk-count">${_selectedIds.size} selected</span>
    <button class="btn btn-sm btn-ghost" onclick="selectAllVisible()">Select all</button>
    <button class="btn btn-sm btn-ghost" onclick="clearSelection()">Clear</button>
    <button class="btn btn-sm btn-available" onclick="bulkSetStatus('available')">Mark Available</button>
    <button class="btn btn-sm btn-sold" onclick="bulkSetStatus('sold')">Mark Sold</button>
    <button class="btn btn-sm btn-listed" onclick="bulkSetStatus('listed')">Mark Listed</button>
    <button class="btn btn-sm btn-danger" onclick="confirmBulkDel()">Delete</button>`;
}

function bulkSetStatus(newStatus) {
  const ids = new Set(_selectedIds);
  ids.forEach(id => {
    const item = getItem(id);
    if (item) {
      const updates = { ...item, status: newStatus };
      if (newStatus === 'sold') {
        const sale = Number(item.sellersAmount) || 0;
        const cost = Number(item.costPrice) || 0;
        updates.sgdMargin = cost > 0 ? sale - cost : sale * 0.10;
      }
      saveItem(updates);
    }
  });
  clearSelection();
  showToast(`${ids.size} item${ids.size > 1 ? 's' : ''} marked as ${newStatus}`, 'success');
  if (typeof onStatsChange === 'function') onStatsChange();
}

function selectAllVisible() {
  document.querySelectorAll('.card-checkbox').forEach(cb => {
    cb.checked = true;
    _selectedIds.add(cb.dataset.id);
  });
  _updateBulkBar();
}

function clearSelection() {
  document.querySelectorAll('.card-checkbox').forEach(cb => { cb.checked = false; });
  _selectedIds.clear();
  _updateBulkBar();
}

function confirmBulkDel() {
  const count = _selectedIds.size;
  showDialog('Delete Items', `Delete <strong>${count} item${count > 1 ? 's' : ''}</strong>? This cannot be undone.`, () => {
    const ids = new Set(_selectedIds);
    ids.forEach(id => deleteItem(id));
    document.querySelectorAll('.item-card').forEach(card => { if (ids.has(card.dataset.id)) card.remove(); });
    _selectedIds.clear();
    _updateBulkBar();
    showToast(`${ids.size} item${ids.size > 1 ? 's' : ''} deleted`);
    if (typeof onStatsChange === 'function') onStatsChange();
  });
}

function renderCard(item) {
  const nextBtns = {
    listed:    `<button class="btn btn-xs btn-available" onclick="setStatus('${item.id}','available')">Available</button><button class="btn btn-xs btn-sold" onclick="setStatus('${item.id}','sold')">Sold</button>`,
    available: `<button class="btn btn-xs btn-listed" onclick="setStatus('${item.id}','listed')">Listed</button><button class="btn btn-xs btn-sold" onclick="setStatus('${item.id}','sold')">Sold</button>`,
    sold:      `<button class="btn btn-xs btn-listed" onclick="setStatus('${item.id}','listed')">Listed</button><button class="btn btn-xs btn-available" onclick="setStatus('${item.id}','available')">Available</button>`,
  };
  const igBadge = item.source === 'instagram' && item.instagramPostUrl
    ? `<a href="${esc(item.instagramPostUrl)}" target="_blank" rel="noopener noreferrer" class="ig-badge" title="View on Instagram">IG</a>`
    : '';
  const currency = item.sellersCurrency || 'NGN';
  const price = item.sellersAmount ? formatAmount(item.sellersAmount, currency) : '—';

  // Profit line: use costPrice if available, else fall back to stored margin
  let profitTag = '';
  if (item.status === 'sold') {
    const sale   = Number(item.sellersAmount) || 0;
    const cost   = Number(item.costPrice) || 0;
    const profit = cost > 0 ? sale - cost : (Number(item.sgdMargin) || 0);
    const sign   = profit >= 0 ? '+' : '';
    const cls    = profit >= 0 ? 'card-margin' : 'card-margin loss';
    profitTag = `<span class="${cls}">${sign}${formatAmount(profit, currency)} profit</span>`;
  }

  // Cost price line (only if set and not sold yet)
  const costLine = item.costPrice && item.status !== 'sold'
    ? `<div class="meta-row"><label>Cost</label><span>${formatAmount(item.costPrice, currency)}</span></div>`
    : '';

  // Payment status badge for sold items
  const payBadge = item.status === 'sold'
    ? `<span class="pay-badge pay-${item.paymentStatus || 'pending'}">${item.paymentStatus === 'paid' ? 'Paid' : item.paymentStatus === 'partial' ? 'Part-paid' : 'Pending'}</span>`
    : '';

  // Buyer contact info
  const buyerLine = item.buyerPhone
    ? `<div class="meta-row"><label>Buyer</label><span>${esc(item.buyerPhone)}</span></div>`
    : item.buyerRef
    ? `<div class="meta-row"><label>Buyer Ref</label><span>${esc(item.buyerRef)}</span></div>`
    : '';

  // Notes snippet
  const notesSnippet = item.notes
    ? `<div class="card-notes">${esc(item.notes.length > 80 ? item.notes.slice(0, 80) + '…' : item.notes)}</div>`
    : '';

  // WhatsApp share button
  const waText = encodeURIComponent(`${item.name} — ${price}${item.notes ? '\n' + item.notes : ''}`);
  const waBtn = `<a href="https://wa.me/?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-wa" title="Share on WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>`;

  return `
<div class="item-card status-${item.status}" data-id="${esc(item.id)}">
  <div class="card-bar"></div>
  <div class="card-body">
    <div class="card-top">
      <input type="checkbox" class="card-checkbox" data-id="${esc(item.id)}" onchange="onCardSelect('${esc(item.id)}',this.checked)" title="Select item">
      <div class="card-title-wrap">
        <span class="status-badge badge-${item.status}">${item.status}</span>
        ${payBadge}
        <h3 class="card-name">${esc(item.name)}</h3>
      </div>
      <button class="notify-btn${item.notifyOnChange ? ' active' : ''}" onclick="toggleNotify('${item.id}')" title="${item.notifyOnChange ? 'Notifications on' : 'Notifications off'}">
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
      </button>
    </div>
    <div class="card-price">${price}${profitTag}</div>
    <div class="card-meta">
      <div class="meta-row"><label>Ref</label><span>${esc(item.sellerRef || '—')}</span></div>
      ${costLine}
      ${buyerLine}
      <div class="meta-row"><label>Date</label><span>${timeAgo(item.updatedAt || item.createdAt)}</span></div>
    </div>
    ${notesSnippet}
  </div>
  <div class="card-footer">
    <div class="card-actions">
      ${nextBtns[item.status]}
      ${igBadge}
      ${waBtn}
      <a href="add.html?id=${esc(item.id)}" class="btn btn-xs btn-ghost" title="Edit">
        <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
      </a>
      <button class="btn btn-xs btn-danger" onclick="confirmDel('${item.id}')" title="Delete">
        <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
      </button>
    </div>
  </div>
</div>`;
}

function setStatus(id, newStatus) {
  const item = getItem(id);
  if (!item) return;
  const updates = { ...item, status: newStatus };
  if (newStatus === 'sold') {
    const sale = Number(item.sellersAmount) || 0;
    const cost = Number(item.costPrice) || 0;
    updates.sgdMargin = cost > 0 ? sale - cost : sale * 0.10;
  }
  saveItem(updates);
  const card = document.querySelector(`.item-card[data-id="${id}"]`);
  if (card) { card.outerHTML = renderCard(getItem(id)); }
  showToast(`Moved to ${cap(newStatus)}`, 'success');
  refreshNavBadge();
  if (typeof onStatsChange === 'function') onStatsChange();
}

function toggleNotify(id) {
  const item = getItem(id);
  if (!item) return;
  const next = !item.notifyOnChange;
  saveItem({ ...item, notifyOnChange: next });
  const btn = document.querySelector(`.item-card[data-id="${id}"] .notify-btn`);
  if (btn) { btn.classList.toggle('active', next); btn.title = next ? 'Notifications on' : 'Notifications off'; }
  showToast(next ? 'Notifications enabled' : 'Notifications off', 'info');
}

function confirmDel(id) {
  const item = getItem(id);
  if (!item) return;
  showDialog('Delete Item', `Delete <strong>${esc(item.name)}</strong>? This cannot be undone.`, () => {
    deleteItem(id);
    document.querySelector(`.item-card[data-id="${id}"]`)?.remove();
    showToast('Item deleted');
    if (typeof onStatsChange === 'function') onStatsChange();
  });
}

function showToast(msg, type = 'success') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2800);
}

function showDialog(title, html, onOk, okLabel = 'Delete') {
  const overlay = document.createElement('div');
  overlay.className = 'dialog-overlay';
  overlay.innerHTML = `
    <div class="dialog" role="dialog" aria-modal="true">
      <h3>${title}</h3>
      <p>${html}</p>
      <div class="dialog-actions">
        <button class="btn btn-ghost" id="dlgNo">Cancel</button>
        <button class="btn btn-danger" id="dlgYes">${okLabel}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#dlgNo').onclick  = () => overlay.remove();
  overlay.querySelector('#dlgYes').onclick = () => { overlay.remove(); onOk(); };
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
}

// ─── Daily Email Report ───────────────────────────────────────────────────────────────────
function sendDailyReport(isTest = false) {
  const prefs = getPrefs();
  if (!prefs.reportEmail) { if (isTest) showToast('Add your email in Settings first', 'error'); return; }
  const stats = getStats();
  const items = getItems();
  const date = new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' });
  if (isTest) showToast('Sending report…', 'info');
  fetch('/api/send-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: prefs.reportEmail, stats, items, date }),
  }).then(r => r.json()).then(data => {
    if (data.sent) {
      if (isTest) showToast('Report sent! Check your inbox', 'success');
      localStorage.setItem(LS_REPORT_SENT, new Date().toDateString());
    } else {
      if (isTest) showToast(data.error || 'Send failed — check Settings', 'error');
    }
  }).catch(() => {
    if (isTest) showToast('Could not reach email service', 'error');
  });
}

function startReportScheduler() {
  function check() {
    const prefs = getPrefs();
    if (!prefs.reportEnabled || !prefs.reportEmail || !prefs.reportTime) return;
    const now = new Date();
    const [h, m] = prefs.reportTime.split(':').map(Number);
    if (now.getHours() !== h || now.getMinutes() !== m) return;
    const lastSent = localStorage.getItem(LS_REPORT_SENT);
    if (lastSent === now.toDateString()) return;
    sendDailyReport(false);
  }
  setInterval(check, 60000);
}

// ─── Auth ──────────────────────────────────────────────────────────────────────────────────
function getAuth() {
  try { return JSON.parse(localStorage.getItem(LS_AUTH)); } catch { return null; }
}

function checkAuth() {
  const auth = getAuth();
  if (!auth) { location.replace('login.html'); return; }
  const ssToken = sessionStorage.getItem(SS_TOKEN);
  const lsToken = localStorage.getItem(LS_TOKEN);
  const token   = ssToken || lsToken;
  if (token !== auth.token) { location.replace('login.html'); return; }
  // Auto-persist: if the session is valid but only in sessionStorage, promote it to
  // localStorage so a browser restart doesn't force re-login after an app update.
  if (ssToken && !lsToken) localStorage.setItem(LS_TOKEN, ssToken);
}

function logout() {
  const auth = getAuth();
  if (auth) {
    auth.token = uid();
    localStorage.setItem(LS_AUTH, JSON.stringify(auth));
  }
  sessionStorage.removeItem(SS_TOKEN);
  localStorage.removeItem(LS_TOKEN);
  location.replace('login.html');
}

// ─── Instagram Connection ────────────────────────────────────────────────────────────
const LS_IG_TOKEN    = 'ledgr_ig_token';
const LS_IG_USER_ID  = 'ledgr_ig_user_id';
const LS_IG_USERNAME = 'ledgr_ig_username';
const LS_IG_EXPIRES  = 'ledgr_ig_expires';

function getIgConnection() {
  const token  = localStorage.getItem(LS_IG_TOKEN);
  const userId = localStorage.getItem(LS_IG_USER_ID);
  if (!token || !userId) return null;
  return {
    token,
    userId,
    username: localStorage.getItem(LS_IG_USERNAME) || '',
    expires:  Number(localStorage.getItem(LS_IG_EXPIRES)) || 0,
  };
}

function setIgConnection({ token, userId, username, expires }) {
  localStorage.setItem(LS_IG_TOKEN, token);
  localStorage.setItem(LS_IG_USER_ID, userId);
  if (username) localStorage.setItem(LS_IG_USERNAME, username);
  if (expires)  localStorage.setItem(LS_IG_EXPIRES, String(expires));
}

function clearIgConnection() {
  [LS_IG_TOKEN, LS_IG_USER_ID, LS_IG_USERNAME, LS_IG_EXPIRES].forEach(k => localStorage.removeItem(k));
}

// ─── Instagram Sync ───────────────────────────────────────────────────────────────────────────
async function syncFromInstagram(manual = false, opts = {}) {
  const lastSync = localStorage.getItem(LS_IG_SYNC);
  if (!manual && lastSync) {
    const age = Date.now() - new Date(lastSync).getTime();
    if (age < 5 * 60 * 1000) return;
  }
  if (manual) showToast('Syncing Instagram…', 'info');
  try {
    const conn = getIgConnection();
    const params = [];
    if (conn) {
      params.push(`token=${encodeURIComponent(conn.token)}`);
      params.push(`user_id=${encodeURIComponent(conn.userId)}`);
    }
    if (opts.since) params.push(`since=${opts.since}`);
    if (opts.until) params.push(`until=${opts.until}`);
    if (opts.days && opts.days.length) params.push(`days=${opts.days.join(',')}`);
    let url = '/api/ig-sync' + (params.length ? '?' + params.join('&') : '');
    const res = await fetch(url);
    if (!res.ok) { if (manual) showToast('Instagram sync unavailable', 'error'); return; }
    const data = await res.json();
    const { items, error, status, rawCount } = data;
    if (status === 'not_configured') { if (manual) showToast('Connect your Instagram in Settings first', 'error'); return; }
    if (error) { if (manual) showToast('Instagram sync failed', 'error'); return; }
    if (!items?.length) {
      localStorage.setItem(LS_IG_SYNC, new Date().toISOString());
      if (manual) {
        const hint = rawCount > 0
          ? `${rawCount} post${rawCount > 1 ? 's' : ''} found on IG but none matched the ITEM: format`
          : 'No posts returned from Instagram';
        showToast(hint, 'info');
      }
      return;
    }
    const igPrefs = getPrefs();
    // Manual sync always refreshes price + name; prefs only govern automatic syncs
    const updatePrice   = manual || !!igPrefs.igUpdatePrice;
    const updateCaption = manual || !!igPrefs.igUpdateCaption;
    let added = 0, updated = 0, statusChanged = 0;
    const current = getItems();
    items.forEach(igItem => {
      const existingIdx = current.findIndex(i => i.id === igItem.id || i.instagramMediaId === igItem.instagramMediaId);
      if (existingIdx >= 0) {
        const prev = current[existingIdx];
        let merged = { ...prev, updatedAt: igItem.updatedAt };
        let dirty = false;
        if (prev.status !== igItem.status) {
          merged.status = igItem.status;
          statusChanged++;
          dirty = true;
          if (prev.notifyOnChange) pushNotification({ itemId: prev.id, itemName: prev.name, message: `"${prev.name}" marked as ${cap(igItem.status)} on Instagram`, type: 'status_change' });
        }
        if (updatePrice && igItem.sellersAmount && prev.sellersAmount !== igItem.sellersAmount) {
          merged.sellersAmount   = igItem.sellersAmount;
          merged.sellersCurrency = igItem.sellersCurrency || 'NGN';
          dirty = true;
        }
        if (updateCaption && igItem.name && prev.name !== igItem.name) {
          merged.name  = igItem.name;
          merged.notes = igItem.notes || prev.notes;
          dirty = true;
        }
        if (dirty) { current[existingIdx] = merged; if (!statusChanged || dirty) updated++; }
      } else {
        current.unshift({ ...igItem });
        added++;
      }
    });
    // Dedup updated from statusChanged
    const netUpdated = Math.max(0, updated - statusChanged);
    if (added || statusChanged || netUpdated) {
      setItems(current);
      const parts = [];
      if (added)        parts.push(`${added} new`);
      if (statusChanged) parts.push(`${statusChanged} status change${statusChanged > 1 ? 's' : ''}`);
      if (netUpdated)   parts.push(`${netUpdated} updated`);
      showToast(parts.join(' · ') + ' from Instagram', added ? 'info' : 'success');
      refreshNavBadge();
      if (typeof onStatsChange === 'function') onStatsChange();
    } else if (manual) {
      showToast(`Already up to date (${items.length} item${items.length > 1 ? 's' : ''} on Instagram)`, 'info');
    }
    localStorage.setItem(LS_IG_SYNC, new Date().toISOString());
  } catch (e) {
    console.warn('Instagram sync failed:', e.message);
    if (manual) showToast('Instagram sync failed', 'error');
  }
}

function startInstagramSync() {
  syncFromInstagram(false);
}
