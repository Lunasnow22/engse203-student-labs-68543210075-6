import { test, expect, beforeEach } from 'vitest';
import { loadSeed } from '../../src/services/requestService.js';
import { configureProductionStaff } from '../../src/services/productionStaff.js';
import { login } from '../../src/services/authService.js';

beforeEach(async () => { await loadSeed(); });
test.each([undefined, '', 'staff1234', 'short'])('production rejects missing/weak staff credential %s', (value) => {
  expect(() => configureProductionStaff(value)).toThrow('STAFF_PASSWORD');
});
test('production replaces public classroom password with private credential', () => {
  configureProductionStaff('isolated-test-password-123');
  expect(login('staff@rmutl.ac.th', 'staff1234')).toBeNull();
  expect(login('staff@rmutl.ac.th', 'isolated-test-password-123')).toHaveProperty('token');
});
