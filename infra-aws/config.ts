if (process.env.NODE_ENV != "production") {
  console.debug("Loading env var for", process.env.NODE_ENV);
  require("dotenv").config();
}

if (!process.env.AWS_TARGET_ACCOUNT) {
  throw new Error(`AWS_TARGET_ACCOUNT env var is required`);
}
if (!process.env.AWS_TARGET_REGION) {
  throw new Error(`AWS_TARGET_REGION env var is required`);
}

const APP_PREFIX = process.env.APP_PREFIX || "App";
const addPrefix = (name: string) => `${APP_PREFIX}${name}`;

export const config = {
  app: {
    prefix: APP_PREFIX,
    name: addPrefix,
  },
  aws: {
    account: process.env.AWS_TARGET_ACCOUNT,
    region: process.env.AWS_TARGET_REGION,
  },
  website: {
    artifacts: "../artifacts/web-client", // relative to this file
  },
};

export default config;
