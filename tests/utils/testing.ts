export const shouldFail = async (
  testFn: () => Promise<any>,
  expectedError:
    | {
        code: string;
        num: number;
      }
    | string
) => {
  try {
    await testFn();
  } catch (error) {
    const sbstr =
      typeof expectedError === "string"
        ? expectedError
        : `Error Code: ${expectedError.code}. Error Number: ${expectedError.num}`;
    const pred =
      error.message.includes(sbstr) ||
      error.logs.some((lg) => lg.includes(sbstr));
    if (pred) {
      // test success
      return;
    }
    console.error("error message: ", error.message);
    console.error("error logs: ", error.logs);
    throw new Error(`expected tx to throw error that includes '${sbstr}'`);
  }
  throw new Error("expected tx to throw error, but it succeeded");
};

export const shouldSucceed = async (testFn: () => Promise<any>) => {
  try {
    await testFn();
  } catch (error) {
    console.error(error.message);
    console.error(error.logs);
    throw new Error(`expected tx to succeeed, but error was thrown`);
  }
};

// export const createSuccessTestFn =
//   (testFn: (...args: any[]) => Promise<any>) =>
//   async (...args: any[]) => {
//     try {
//       await testFn(...args);
//     } catch (error) {
//       console.error(error.message);
//       console.error(error.logs);
//       throw new Error(`expected tx to succeeed, but error was thrown`);
//     }
//   };
