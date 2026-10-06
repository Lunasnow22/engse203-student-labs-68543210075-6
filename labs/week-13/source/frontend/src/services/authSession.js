import { useSyncExternalStore } from 'react';

const KEY = 'campus-week13-session';
let session = null;
try { session = JSON.parse(sessionStorage.getItem(KEY)); } catch { /* no saved session */ }
const listeners = new Set();
export const getSession = () => session;
export function setSession(value) {
  session = value;
  try {
    if (value) sessionStorage.setItem(KEY, JSON.stringify(value));
    else sessionStorage.removeItem(KEY);
  } catch { /* in-memory login works when storage is unavailable */ }
  listeners.forEach((listener) => listener());
}
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export const useSession = () => useSyncExternalStore(subscribe, getSession, () => null);
