const queue: Array<() => Promise<void>> = [];
let isRunning = false;

export const lock = async <T>(fn: () => Promise<T>): Promise<T> => {
  const executeNextTask = () => {
    const nextTask = queue.pop();

    if (nextTask) {
      nextTask();
    } else {
      isRunning = false;
    }
  };

  if (!isRunning) {
    isRunning = true;
    const result = await fn();

    executeNextTask();

    return result;
  } else {
    return new Promise((resolve) => {
      queue.push(async () => {
        const result = await fn();

        resolve(result);

        executeNextTask();
      });
    });
  }
};
