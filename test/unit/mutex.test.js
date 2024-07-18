import Mutex from "../../src/structs/Mutex";

describe("Mutex", () => {
  let mutex;

  beforeEach(() => {
    // Create a new Mutex instance before each test
    mutex = new Mutex();
  });

  test("acquire() resolves immediately when the mutex is not locked", async () => {
    await mutex.acquire();
    expect(mutex.locked).toBe(true);
  });

  test("acquire() waits for the mutex to be released when it is locked", async () => {
    let acquired = false;

    // Start acquiring the mutex (this will be delayed since it's already locked)
    const acquirePromise = mutex.acquire().then(() => {
      acquired = true;
    });

    // Ensure the mutex is still locked while waiting
    expect(mutex.locked).toBe(true);

    // Release the mutex after some time
    setTimeout(() => {
      mutex.release();
    }, 1000);

    // Wait for the acquirePromise to resolve
    await acquirePromise;

    // Ensure that the mutex was acquired after release
    expect(acquired).toBe(true);
  });

  test("release() unlocks the mutex and resolves the next queued acquire() call", async () => {
    let acquired = false;

    // Acquire the mutex (this will be queued)
    const acquirePromise = mutex.acquire().then(() => {
      acquired = true;
    });

    // Release the mutex, which should resolve the acquirePromise
    mutex.release();

    // Wait for the acquirePromise to resolve
    await acquirePromise;

    // Ensure that the mutex was acquired after release
    expect(acquired).toBe(true);
    expect(mutex.locked).toBe(false);
  });

  test("release() unlocks the mutex and does not resolve anything if no acquire() calls are queued", async () => {
    mutex.release();
    expect(mutex.locked).toBe(false);
  });
});
