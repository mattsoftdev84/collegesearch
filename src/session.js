// Keeps the WebForms session alive while someone is using the page, and tracks
// whether it has expired so the app can offer a reload.
//
// The server session times out after 10 minutes. We ping KeepAlive every 4 minutes,
// but only while the tab is visible and the user has done something in the last
// 10 minutes, so an unattended PC still times out as intended.
//
// Preview only: add ?keepalive=10s to the page URL (before the #) to ping every
// 10 seconds instead, to watch it work.

import { useEffect, useSyncExternalStore } from 'react';
import { keepAlive } from './api.js';

function intervals() {
  const fast = window.SapienPreview && /[?&]keepalive=(\d+)s\b/.exec(window.location.search);
  if (fast) {
    const ping = Math.max(1, Number(fast[1])) * 1000;
    return { ping, active: ping * 2.5 };
  }
  return { ping: 4 * 60_000, active: 10 * 60_000 };
}

// ---- Expired flag (shared across the app) ----------------------------------
let expired = false;
const subs = new Set();

export function markExpired() {
  if (expired) return;
  expired = true;
  subs.forEach((fn) => fn());
}

function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function useSessionExpired() {
  return useSyncExternalStore(subscribe, () => expired);
}

// Reloading keeps the URL hash, so the same mode and search come back.
export function reloadPage() {
  window.location.reload();
}

// ---- Keep-alive -------------------------------------------------------------
const ACTIVITY = ['keydown', 'pointerdown', 'pointermove', 'wheel', 'scroll', 'touchstart'];

export function useKeepAlive() {
  useEffect(() => {
    const { ping, active } = intervals();
    let lastActivity = Date.now();
    let lastPing = Date.now(); // loading the page counted as a server visit
    let busy = false;

    const visible = () => document.visibilityState !== 'hidden';

    const check = () => {
      const now = Date.now();
      if (expired || busy || !visible()) return;
      if (now - lastActivity > active) return; // idle: let the session lapse
      if (now - lastPing < ping) return;
      busy = true;
      lastPing = now;
      keepAlive().then(
        () => (busy = false),
        (err) => {
          busy = false;
          if (err && err.expired) markExpired();
          // Other failures (network blip) are ignored; the next tick tries again.
        }
      );
    };

    const onActivity = () => (lastActivity = Date.now());
    // Coming back to the tab counts as activity, and pings straight away if it's due.
    const onVisible = () => {
      if (!visible()) return;
      onActivity();
      check();
    };

    ACTIVITY.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true, capture: true }));
    document.addEventListener('visibilitychange', onVisible);
    const timer = setInterval(check, Math.min(15_000, ping / 4));

    return () => {
      ACTIVITY.forEach((ev) => window.removeEventListener(ev, onActivity, { capture: true }));
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(timer);
    };
  }, []);
}
