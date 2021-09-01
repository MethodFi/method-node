// @flow
import ResourceError from '../errors/resource_error';

export default async function with_error_handler(fn: Function): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    const is_api_error = error.response
      && error.response.data
      && error.response.data.data
      && error.response.data.data.error;

    if (is_api_error) {
      const resource_error_options = { ...error.response.data.data.error };
      const idempotency_key = error.response.config.headers['Idempotency-Key'];
      const idempotency_status = error.response.headers['idem-status'];
      const should_attach_idempotency = error.response.config.method === 'post'
        && idempotency_key
        && idempotency_status;

      if (should_attach_idempotency) {
        resource_error_options.idempotency_key = idempotency_key;
        resource_error_options.idempotency_status = idempotency_status;
      }

      throw new ResourceError(resource_error_options);
    }

    throw error;
  }
}
