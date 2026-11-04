import crypto from 'crypto';
import type { TWebhookTypes } from './types';

// https://docs.methodfi.com/reference/webhooks/overview#authentication
export const WEBHOOK_SIGNATURE_HEADER = 'method-webhook-signature';
export const WEBHOOK_TIMESTAMP_HEADER = 'method-webhook-timestamp';
export const WEBHOOK_DELIVERY_ID_HEADER = 'method-webhook-delivery-id';
export const DEFAULT_WEBHOOK_TOLERANCE_SECONDS = 300;

export const WebhookVerificationErrorCodes = {
  missing_secret: 'missing_secret',
  missing_header: 'missing_header',
  invalid_authorization: 'invalid_authorization',
  invalid_signature: 'invalid_signature',
  invalid_timestamp: 'invalid_timestamp',
  timestamp_out_of_tolerance: 'timestamp_out_of_tolerance',
  invalid_payload: 'invalid_payload',
} as const;

export type TWebhookVerificationErrorCodes = typeof WebhookVerificationErrorCodes[keyof typeof WebhookVerificationErrorCodes];

export class MethodWebhookVerificationError extends Error {
  code: TWebhookVerificationErrorCodes;

  constructor(code: TWebhookVerificationErrorCodes, message: string) {
    super(message);
    this.name = 'MethodWebhookVerificationError';
    this.code = code;
    Object.setPrototypeOf(this, MethodWebhookVerificationError.prototype);
  }
}

// Node's IncomingHttpHeaders, a plain object, or a Fetch API Headers instance.
export type TWebhookHeaders =
  | Record<string, string | string[] | undefined>
  | { get(name: string): string | null };

export interface IWebhookEventPayload {
  webhook_id: string;
  id: string;
  type: TWebhookTypes;
  op: string;
  path: string;
  event: string;
  refs?: Record<string, string>;
  [key: string]: unknown;
}

export interface IWebhookVerifyOpts {
  /** The raw request body exactly as received. A re-serialized JSON object will not match the signature. */
  payload: string | Buffer;
  headers: TWebhookHeaders;
  /** The `hmac_secret` the webhook was registered with. Verifies `method-webhook-signature`. */
  hmac_secret?: string;
  /** The `auth_token` the webhook was registered with. Verifies the `Authorization` header. */
  auth_token?: string;
  /** Maximum age of `method-webhook-timestamp`, in seconds. Defaults to 300. Set to 0 to skip the check. */
  tolerance_seconds?: number;
  /** Current time in seconds, for testing. Defaults to `Date.now() / 1000`. */
  now?: number;
}

export interface IWebhookEvent {
  /** The parsed webhook event body. */
  payload: IWebhookEventPayload;
  /** `method-webhook-delivery-id`: stable across retries of the same delivery, use it to deduplicate. */
  delivery_id: string | null;
  /** `method-webhook-timestamp`, in seconds. */
  timestamp: number;
}

function getHeader(headers: TWebhookHeaders, name: string): string | null {
  if (typeof (headers as { get?: unknown }).get === 'function') {
    return (headers as { get(name: string): string | null }).get(name);
  }

  const record = headers as Record<string, string | string[] | undefined>;
  const key = Object.keys(record).find((k) => k.toLowerCase() === name);
  if (key === undefined) return null;

  const value = record[key];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

// Hash both sides first so timingSafeEqual always compares equal-length buffers:
// comparing raw strings of different lengths would throw instead of returning false.
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => crypto.createHash('sha256').update(value, 'utf8').digest();
  return crypto.timingSafeEqual(digest(a), digest(b));
}

/**
 * Computes the `method-webhook-signature` value for a payload: an HMAC-SHA256 hex digest
 * of `${timestamp}:${payload}` keyed with the webhook's `hmac_secret`.
 */
export function computeWebhookSignature(payload: string | Buffer, timestamp: string | number, hmac_secret: string): string {
  return crypto
    .createHmac('sha256', hmac_secret)
    .update(`${timestamp}:`, 'utf8')
    .update(payload)
    .digest('hex');
}

/**
 * Verifies that a webhook request came from Method and returns the parsed event.
 *
 * Checks the `Authorization` header when `auth_token` is given, the `method-webhook-signature`
 * HMAC when `hmac_secret` is given (at least one is required), and the age of
 * `method-webhook-timestamp`. Throws a {@link MethodWebhookVerificationError} on failure.
 *
 * @see https://docs.methodfi.com/reference/webhooks/overview#authentication
 */
export function constructWebhookEvent(opts: IWebhookVerifyOpts): IWebhookEvent {
  const { payload, headers, hmac_secret, auth_token } = opts;
  const tolerance = opts.tolerance_seconds ?? DEFAULT_WEBHOOK_TOLERANCE_SECONDS;

  if (!hmac_secret && !auth_token) {
    throw new MethodWebhookVerificationError(
      WebhookVerificationErrorCodes.missing_secret,
      'Provide the webhook hmac_secret and/or auth_token to verify a webhook.',
    );
  }

  const rawTimestamp = getHeader(headers, WEBHOOK_TIMESTAMP_HEADER);
  if (rawTimestamp === null) {
    throw new MethodWebhookVerificationError(WebhookVerificationErrorCodes.missing_header, `Missing ${WEBHOOK_TIMESTAMP_HEADER} header.`);
  }

  const timestamp = Number(rawTimestamp.trim());
  if (!/^\d+$/.test(rawTimestamp.trim()) || !Number.isFinite(timestamp)) {
    throw new MethodWebhookVerificationError(
      WebhookVerificationErrorCodes.invalid_timestamp,
      `${WEBHOOK_TIMESTAMP_HEADER} must be a UNIX timestamp in seconds.`,
    );
  }

  if (auth_token) {
    const authorization = getHeader(headers, 'authorization');
    if (authorization === null) {
      throw new MethodWebhookVerificationError(WebhookVerificationErrorCodes.missing_header, 'Missing Authorization header.');
    }
    const expected = Buffer.from(auth_token, 'utf8').toString('base64');
    if (!safeEqual(authorization.trim(), expected)) {
      throw new MethodWebhookVerificationError(
        WebhookVerificationErrorCodes.invalid_authorization,
        'Authorization header does not match the webhook auth_token.',
      );
    }
  }

  if (hmac_secret) {
    const signature = getHeader(headers, WEBHOOK_SIGNATURE_HEADER);
    if (signature === null) {
      throw new MethodWebhookVerificationError(WebhookVerificationErrorCodes.missing_header, `Missing ${WEBHOOK_SIGNATURE_HEADER} header.`);
    }
    const expected = computeWebhookSignature(payload, rawTimestamp.trim(), hmac_secret);
    if (!safeEqual(signature.trim().toLowerCase(), expected)) {
      throw new MethodWebhookVerificationError(
        WebhookVerificationErrorCodes.invalid_signature,
        `${WEBHOOK_SIGNATURE_HEADER} does not match the payload. Make sure you pass the raw request body.`,
      );
    }
  }

  // Checked after the signature, so an unsigned or tampered request always fails as invalid_signature.
  if (tolerance > 0) {
    const now = opts.now ?? Date.now() / 1000;
    if (Math.abs(now - timestamp) > tolerance) {
      throw new MethodWebhookVerificationError(
        WebhookVerificationErrorCodes.timestamp_out_of_tolerance,
        `${WEBHOOK_TIMESTAMP_HEADER} is more than ${tolerance} seconds from the current time.`,
      );
    }
  }

  let parsed: IWebhookEventPayload;
  try {
    parsed = JSON.parse(typeof payload === 'string' ? payload : payload.toString('utf8'));
  } catch (error) {
    throw new MethodWebhookVerificationError(WebhookVerificationErrorCodes.invalid_payload, 'Webhook payload is not valid JSON.');
  }

  return {
    payload: parsed,
    delivery_id: getHeader(headers, WEBHOOK_DELIVERY_ID_HEADER),
    timestamp,
  };
}
