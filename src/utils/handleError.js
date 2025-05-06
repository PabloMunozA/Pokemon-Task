const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handleError = async (serviceToExecute, data) => {
  const maxRetries = 3;
  const retryDelay = 500;

  for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
    try {
      const response = await serviceToExecute(data);
      return response;
    } catch (error) {
      if (error.code === 429) {
        console.log(`Rate limit exceeded. Retrying in ${retryDelay}ms...`);
        await sleep(retryDelay);
        continue;
      }

      const formattedError = {
        message: error.body?.message || error.message || 'Unknown error',
        status: error.body?.status || error.code || 500,
        data: data,
      };

      throw formattedError;
    }
  }

  throw {
    message: 'Maximum retries reached',
    status: 500,
    data: data,
  };
};

export { handleError as errorHandle, sleep };
