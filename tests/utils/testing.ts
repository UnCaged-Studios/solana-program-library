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
      error.logs?.some((lg) => lg.includes(sbstr));
    if (pred) {
      // test success
      return;
    }
    const { message, logs } = error;
    console.error(`${message}\n${(logs || []).join("\n")}`);
    throw new Error(`expected tx to throw error that includes '${sbstr}'`);
  }
  throw new Error("expected tx to throw error, but it succeeded");
};

export const shouldSucceed = async (testFn: () => Promise<any>) => {
  try {
    await testFn();
  } catch (error) {
    const { message, logs } = error;
    console.error(`${message}\n${(logs || []).join("\n")}`);
    throw new Error(`expected tx to succeeed, but error was thrown`);
  }
};
