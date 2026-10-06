import { test, expect, vi, afterEach } from 'vitest';
import { apiFetch } from './apiClient.js';
import { setSession, getSession } from './authSession.js';

afterEach(() => { setSession(null); vi.unstubAllGlobals(); });
test('attaches bearer token and preserves caller headers', async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] });
  vi.stubGlobal('fetch', fetch);
  setSession({ token: 'test-token', user: { role: 'staff' } });
  await apiFetch('/api/requests', { headers: { 'X-Test': 'yes' } });
  expect(fetch.mock.calls[0][1].headers).toMatchObject({ Authorization: 'Bearer test-token', 'Content-Type': 'application/json', 'X-Test': 'yes' });
});
test('401 clears expired session and exposes API error', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'expired' }) }));
  setSession({ token: 'expired', user: { role: 'staff' } });
  await expect(apiFetch('/api/requests/REQ-001')).rejects.toMatchObject({ status: 401, message: 'expired' });
  expect(getSession()).toBeNull();
});
test('public requests omit Authorization and 204 has no JSON body', async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true, status: 204 });
  vi.stubGlobal('fetch', fetch);
  expect(await apiFetch('/api/requests')).toBeNull();
  expect(fetch.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
});
