async function timeoutGuard(
  promise,
  timeoutMs
) {

  const timeoutPromise =
    new Promise((_, reject) => {

      setTimeout(() => {

        reject(
          new Error("TIMEOUT")
        );

      }, timeoutMs);

    });

  return Promise.race([
    promise,
    timeoutPromise
  ]);
}

module.exports =
timeoutGuard;