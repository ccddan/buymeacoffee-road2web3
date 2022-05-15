#!/usr/bin/env node

import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { AppProps, StackProps } from "aws-cdk-lib";

import { WebsiteStack } from "../lib/website";
import config from "../config";

const app = new cdk.App();

const awsConfig: StackProps = {
  env: {
    account: config.aws.account,
    region: config.aws.region,
  },
};
const website = new WebsiteStack(
  app,
  config.app.name("WebsiteStack"),
  awsConfig
);
