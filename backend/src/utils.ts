export const getEnv = (
  envVar: string,
  defaultValue?: any,
  allowNull = false
) => {
  const env = process.env[envVar] || defaultValue;

  if (!env && !allowNull)
    throw new Error(
      `The ${envVar} environment variable is required but was not specified.`
    );

  return env;
};
