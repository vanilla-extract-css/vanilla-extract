type AsyncFunction<T> = () => Promise<T>;

const queue: Array<() => void> = [];
let isProcessingQueue = false;

export async function lock<T>(fn: AsyncFunction<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const queueFn = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        isProcessingQueue = false;
        processQueue();
      }
    };

    queue.push(queueFn);

    if (!isProcessingQueue) {
      processQueue();
    }
  });
}

async function processQueue() {
  if (isProcessingQueue || queue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  const fn = queue.shift()!;

  await fn();
}
