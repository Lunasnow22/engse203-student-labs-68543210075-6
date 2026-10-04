import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { config } from '../src/config.js';
import { AppError, errorHandler } from '../src/middleware/errorHandler.js';

test('production hides stack; development preserves diagnostic stack', async () => {
  const original = config.isProd;
  const app = express();
  app.get('/error', () => { throw new AppError('Invalid input', 400); });
  app.use(errorHandler);
  try {
    config.isProd = true;
    const production = await request(app).get('/error');
    assert.equal(production.status, 400);
    assert.deepEqual(production.body, { error: 'Invalid input' });
    config.isProd = false;
    const development = await request(app).get('/error');
    assert.ok(Array.isArray(development.body.stack));
  } finally {
    config.isProd = original;
  }
});
