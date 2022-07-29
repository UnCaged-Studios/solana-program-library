import { assert } from "chai";

export const shouldFail = async (
  testFn: () => Promise<void>,
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
    console.error(error.message);
    console.error(error.logs);
    assert.fail(`expected tx to throw error that includes '${sbstr}'`);
  }
  assert.fail("expected tx to throw error, but it succeeded");
};