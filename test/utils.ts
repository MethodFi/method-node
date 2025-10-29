export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type AwaitResultsFn = <T>(fn: () => Promise<T>) => Promise<any>;

export const awaitResults: AwaitResultsFn = async (fn) => {
  let result;
  let retries = 20;
  while (retries > 0) {
    try {
      result = await fn();
      if (result.status === 'completed' || result.status === 'failed') {
        break;
      }
      await sleep(5000);
    } catch (error) {
      console.error('Error occurred during awaited request:', error);
      throw error; // Rethrow the error to fail the test
    }
    retries--;
  }

  // Throw error if we exhausted retries without getting completed/failed status
  if (result && result.status !== 'completed' && result.status !== 'failed') {
    throw new Error(
      `awaitResults timed out after 10 retries. Final status: ${result.status}`
    );
  }

  return result;
};
