import { afterEach, expect, test, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { config } from '../../src/config.js';
import { AppError, asyncHandler, errorHandler } from '../../src/middleware/errorHandler.js';

const originalIsProd = config.isProd;
afterEach(() => {
  config.isProd = originalIsProd;
  vi.restoreAllMocks();
});

function errorApp(error) {
  const app = express();
  app.get('/fail', asyncHandler(async () => { throw error; }));
  app.use(errorHandler);
  return app;
}

test('production masks unexpected errors and never sends stack traces', async () => {
  config.isProd = true;
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const error = new Error('private database details');
  const { body } = await request(errorApp(error)).get('/fail').expect(500);
  expect(body).toEqual({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  expect(JSON.stringify(body)).not.toContain(error.message);
  expect(log).toHaveBeenCalledWith('เกิดข้อผิดพลาดภายใน:', error.message);
});

test('known client errors retain their status and message without server-error logging', async () => {
  config.isProd = true;
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  await request(errorApp(new AppError('ไม่อนุญาต', 403)))
    .get('/fail').expect(403, { error: 'ไม่อนุญาต' });
  expect(log).not.toHaveBeenCalled();
});

test('development errors expose a short stack for debugging and log the full stack', async () => {
  config.isProd = false;
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const error = new AppError('debug failure');
  const { body } = await request(errorApp(error)).get('/fail').expect(500);
  expect(body.stack).toEqual(error.stack.split('\n').slice(0, 3));
  expect(log).toHaveBeenCalledWith('เกิดข้อผิดพลาดภายใน:', error.stack);
});
