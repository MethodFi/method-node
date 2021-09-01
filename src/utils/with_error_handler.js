// @flow
import ResourceError from '../errors/resource_error';


export async function with_error_handler(fn: Function): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    const is_api_error = error.response
      && error.response.data
      && error.response.data.data
      && error.response.data.data.error;

    if (is_api_error) {
      const idempotency_status = error.response.headers['idem-status'];
      throw new ResourceError({ ...error.response.data.data.error, idempotency_status });
    }

    throw error;
  }
}
