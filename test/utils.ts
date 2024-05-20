export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type AwaitResultsFn = <T>(fn: () => Promise<T>) => Promise<any>;

export const awaitResults: AwaitResultsFn = async (fn) => {
  let result;
  let retries = 5;
  while (retries > 0) {
    try {
      result = await fn();
      if (result.status === 'completed' || result.status === 'failed') {
        break;
      }
      await sleep(5000);
    } catch (error) {
      console.error('Error occurred while retrieving account balances:', error);
      throw error; // Rethrow the error to fail the test
    }
    retries--;
  };

  return result;
};
