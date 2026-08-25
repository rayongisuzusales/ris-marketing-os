/**
 * RIS Marketing OS — shared client logic
 * ใส่ URL ของ Apps Script Web App ที่ deploy แล้ว (ลงท้ายด้วย /exec)
 */
const API_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

const BRANCH_LABELS = {
  ALL: 'ภาพรวมทุกสาขา',
  RY: 'RY', FC: 'FC', MP: 'MP', CK: 'CK', NS: 'NS',
  PD: 'PD', BK: 'BK', NK: 'NK', FR: 'FR'
};

function api(action, payload) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight on Apps Script
    body: JSON.stringify(Object.assign({ action: action }, payload || {}))
  }).then(r => r.json());
}

function getToken() { return localStorage.getItem('ris_mos_token') || ''; }
function setToken(t) { localStorage.setItem('ris_mos_token', t); }
function clearToken() { localStorage.removeItem('ris_mos_token'); }

function getCachedUser() {
  try { return JSON.parse(localStorage.getItem('ris_mos_user') || 'null'); }
  catch (e) { return null; }
}
function setCachedUser(u) { localStorage.setItem('ris_mos_user', JSON.stringify(u)); }

function requireAuth() {
  const token = getToken();
  if (!token) { window.location.href = 'index.html'; return null; }
  return token;
}

function logout() {
  api('logout', { token: getToken() }).finally(() => {
    clearToken();
    localStorage.removeItem('ris_mos_user');
    window.location.href = 'index.html';
  });
}

function toast(msg, isErr) {
  const el = document.createElement('div');
  el.className = 'toast' + (isErr ? ' err' : '');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}
