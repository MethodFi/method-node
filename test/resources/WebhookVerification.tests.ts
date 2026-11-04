import crypto from 'crypto';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Method, Environments } from '../../index';
import {
  computeWebhookSignature,
  constructWebhookEvent,
  MethodWebhookVerificationError,
  WebhookVerificationErrorCodes,
} from '../../src/resources/Webhook/verify';
import type { IWebhookVerifyOpts } from '../../src/resources/Webhook/verify';

// Offline tests: no API key or network needed.
const HMAC_SECRET = 'whsec_test_secret';
const AUTH_TOKEN = 'test-auth-token';
const NOW = 1730000000;
const PAYLOAD = JSON.stringify({
  webhook_id: 'whk_cSGjA6d9N8y8R',
  id: 'acc_BcRdHNjb9TYKV',
  type: 'account.update',
  op: 'update',
  path: '/accounts/acc_BcRdHNjb9TYKV',
  event: 'evt_knqJgxKUnqDVJ',
  refs: { account: 'acc_BcRdHNjb9TYKV', entity: 'ent_qKNBB68bfHGNA' },
});

// Signature computed independently, exactly as in Method's docs example.
function docsSignature(payload: string, timestamp: number | string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(`${timestamp}:${payload}`).digest('hex');
}

function signedHeaders(overrides: Record<string, string | undefined> = {}): Record<string, string | undefined> {
  return {
    'method-webhook-timestamp': String(NOW),
    'method-webhook-signature': docsSignature(PAYLOAD, NOW, HMAC_SECRET),
    'method-webhook-delivery-id': 'dlv_123',
    authorization: Buffer.from(AUTH_TOKEN).toString('base64'),
    ...overrides,
  };
}

function expectError(opts: IWebhookVerifyOpts, code: string) {
  try {
    constructWebhookEvent(opts);
  } catch (error) {
    expect(error).to.be.instanceOf(MethodWebhookVerificationError);
    expect((error as MethodWebhookVerificationError).code).to.equal(code);
    return;
  }
  throw new Error(`expected a ${code} error`);
}

describe('Webhooks - signature verification', () => {
  it('computes the same signature as the documented recipe', () => {
    expect(computeWebhookSignature(PAYLOAD, NOW, HMAC_SECRET)).to.equal(docsSignature(PAYLOAD, NOW, HMAC_SECRET));
    expect(computeWebhookSignature(Buffer.from(PAYLOAD), String(NOW), HMAC_SECRET)).to.equal(docsSignature(PAYLOAD, NOW, HMAC_SECRET));
  });

  it('returns the parsed event, delivery id and timestamp for a valid request', () => {
    const event = constructWebhookEvent({
      payload: PAYLOAD, headers: signedHeaders(), hmac_secret: HMAC_SECRET, auth_token: AUTH_TOKEN, now: NOW + 10,
    });
    expect(event.payload.type).to.equal('account.update');
    expect(event.payload.refs).to.deep.equal({ account: 'acc_BcRdHNjb9TYKV', entity: 'ent_qKNBB68bfHGNA' });
    expect(event.delivery_id).to.equal('dlv_123');
    expect(event.timestamp).to.equal(NOW);
  });

  it('accepts a Buffer body, mixed-case header names and array header values', () => {
    const headers = signedHeaders();
    const event = constructWebhookEvent({
      payload: Buffer.from(PAYLOAD),
      headers: {
        'Method-Webhook-Timestamp': [headers['method-webhook-timestamp'] as string],
        'METHOD-WEBHOOK-SIGNATURE': headers['method-webhook-signature'],
      },
      hmac_secret: HMAC_SECRET,
      now: NOW,
    });
    expect(event.payload.id).to.equal('acc_BcRdHNjb9TYKV');
    expect(event.delivery_id).to.equal(null);
  });

  it('accepts Fetch API Headers (Next.js, Hono, Workers)', () => {
    const headers = new Map(Object.entries(signedHeaders()) as [string, string][]);
    const event = constructWebhookEvent({
      payload: PAYLOAD, headers: { get: (name: string) => headers.get(name) ?? null }, hmac_secret: HMAC_SECRET, now: NOW,
    });
    expect(event.payload.event).to.equal('evt_knqJgxKUnqDVJ');
  });

  it('verifies with only an auth_token (no hmac_secret registered)', () => {
    const event = constructWebhookEvent({
      payload: PAYLOAD, headers: signedHeaders({ 'method-webhook-signature': undefined }), auth_token: AUTH_TOKEN, now: NOW,
    });
    expect(event.payload.op).to.equal('update');
  });

  it('rejects a tampered body', () => {
    const tampered = PAYLOAD.replace('account.update', 'payment.update');
    expectError({ payload: tampered, headers: signedHeaders(), hmac_secret: HMAC_SECRET, now: NOW }, WebhookVerificationErrorCodes.invalid_signature);
  });

  it('rejects a re-serialized body (the signature covers the raw bytes)', () => {
    const reserialized = JSON.stringify(JSON.parse(PAYLOAD), null, 2);
    expectError({ payload: reserialized, headers: signedHeaders(), hmac_secret: HMAC_SECRET, now: NOW }, WebhookVerificationErrorCodes.invalid_signature);
  });

  it('rejects the wrong secret and a signature of a different length without throwing a RangeError', () => {
    expectError({ payload: PAYLOAD, headers: signedHeaders(), hmac_secret: 'other', now: NOW }, WebhookVerificationErrorCodes.invalid_signature);
    // A bare crypto.timingSafeEqual on these would throw "Input buffers must have the same byte length".
    expectError(
      { payload: PAYLOAD, headers: signedHeaders({ 'method-webhook-signature': 'abc' }), hmac_secret: HMAC_SECRET, now: NOW },
      WebhookVerificationErrorCodes.invalid_signature,
    );
  });

  it('rejects a timestamp that was swapped after signing', () => {
    expectError(
      { payload: PAYLOAD, headers: signedHeaders({ 'method-webhook-timestamp': String(NOW + 1) }), hmac_secret: HMAC_SECRET, now: NOW },
      WebhookVerificationErrorCodes.invalid_signature,
    );
  });

  it('rejects a wrong Authorization header', () => {
    expectError(
      { payload: PAYLOAD, headers: signedHeaders({ authorization: Buffer.from('nope').toString('base64') }), auth_token: AUTH_TOKEN, now: NOW },
      WebhookVerificationErrorCodes.invalid_authorization,
    );
  });

  it('rejects stale and future timestamps outside the tolerance, and allows disabling the check', () => {
    const opts = { payload: PAYLOAD, headers: signedHeaders(), hmac_secret: HMAC_SECRET };
    expectError({ ...opts, now: NOW + 301 }, WebhookVerificationErrorCodes.timestamp_out_of_tolerance);
    expectError({ ...opts, now: NOW - 301 }, WebhookVerificationErrorCodes.timestamp_out_of_tolerance);
    expectError({ ...opts, now: NOW + 61, tolerance_seconds: 60 }, WebhookVerificationErrorCodes.timestamp_out_of_tolerance);
    expect(constructWebhookEvent({ ...opts, now: NOW + 300 }).timestamp).to.equal(NOW);
    expect(constructWebhookEvent({ ...opts, now: NOW + 86400, tolerance_seconds: 0 }).timestamp).to.equal(NOW);
  });

  it('reports missing headers and secrets clearly', () => {
    expectError({ payload: PAYLOAD, headers: signedHeaders(), now: NOW }, WebhookVerificationErrorCodes.missing_secret);
    expectError(
      { payload: PAYLOAD, headers: signedHeaders({ 'method-webhook-timestamp': undefined }), hmac_secret: HMAC_SECRET, now: NOW },
      WebhookVerificationErrorCodes.missing_header,
    );
    expectError(
      { payload: PAYLOAD, headers: signedHeaders({ 'method-webhook-signature': undefined }), hmac_secret: HMAC_SECRET, now: NOW },
      WebhookVerificationErrorCodes.missing_header,
    );
    expectError(
      { payload: PAYLOAD, headers: signedHeaders({ authorization: undefined }), auth_token: AUTH_TOKEN, now: NOW },
      WebhookVerificationErrorCodes.missing_header,
    );
  });

  it('rejects a non-numeric timestamp and a body that is not JSON', () => {
    expectError(
      { payload: PAYLOAD, headers: signedHeaders({ 'method-webhook-timestamp': '2024-10-01T00:00:00Z' }), hmac_secret: HMAC_SECRET, now: NOW },
      WebhookVerificationErrorCodes.invalid_timestamp,
    );
    const body = 'not json';
    expectError(
      { payload: body, headers: signedHeaders({ 'method-webhook-signature': docsSignature(body, NOW, HMAC_SECRET) }), hmac_secret: HMAC_SECRET, now: NOW },
      WebhookVerificationErrorCodes.invalid_payload,
    );
  });

  it('is available on the client as method.webhooks.constructEvent without an API call', () => {
    const method = new Method({ apiKey: 'sk_test_offline', env: Environments.dev });
    const event = method.webhooks.constructEvent({ payload: PAYLOAD, headers: signedHeaders(), hmac_secret: HMAC_SECRET, now: NOW });
    expect(event.payload.webhook_id).to.equal('whk_cSGjA6d9N8y8R');
  });
});
