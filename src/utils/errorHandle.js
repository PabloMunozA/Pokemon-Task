const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const errorHandle = async (serviceToExecute, data) => {
  const maxRetries = 3;
  const retryDelay = 500;

  for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
    try {
      const response = await serviceToExecute(data);
      return response;
    } catch (error) {
      if (error.code === 429) {
        console.log("Rate limit exceeded. Retrying in " + retryDelay + "ms...");
        await sleep(retryDelay);
        continue;
      }

      if (error.body?.message && error.body?.status)
        throw {
          message: error.body.message,
          status: error.body.status,
          status: error.code,
        };
      throw {
        message: error.message,
        data: data,
        status: error.code,
      };
    }
  }
};

export { errorHandle, sleep };