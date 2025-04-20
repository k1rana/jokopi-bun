export const parseArrayFromEnvironment = (
  val: string | undefined,
  defaultValue: unknown = []
) => {
  try {
    return val ? JSON.parse(val) : defaultValue;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return defaultValue;
  }
};

export const parseNumberFromEnvironment = (
  val: string | undefined,
  defaultValue: number = 0
) => {
  try {
    return val ? Number(val) : defaultValue;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return defaultValue;
  }
};

export const checkSecretOrThrowError = (varName: string) => {
  const obj = Bun.env;
  if (!obj[varName]) {
    throw new Error(`Environment Variable ${varName} is missing`);
  }
  return obj[varName];
};

export const env = {
  get: checkSecretOrThrowError,
  parseArray: parseArrayFromEnvironment,
  parseNumber: parseNumberFromEnvironment,
}