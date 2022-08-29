type ValidTransactionError = { message: string; logs?: Array<string> };

const isValidTransactionError = (
  err: unknown
): err is ValidTransactionError => {
  if (!err || typeof err !== "object") return false;
  const { message, logs } = err as any;
  return typeof message === "string" && (!logs || Array.isArray(logs));
};

export const resolveTxError = (err: unknown): ValidTransactionError => {
  if (!isValidTransactionError(err)) {
    console.error(err);
    throw new Error("recieved non-anchor error (see error output above)");
  }
  return err;
};

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
  } catch (e: unknown) {
    const error = resolveTxError(e);
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
  } catch (e: unknown) {
    const error = resolveTxError(e);
    const { message, logs } = error;
    console.error(`${message}\n${(logs || []).join("\n")}`);
    throw new Error(`expected tx to succeeed, but error was thrown`);
  }
};
