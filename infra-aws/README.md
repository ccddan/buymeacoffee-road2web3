# Buy Me A Coffee - AWS Infrastructure

## Requirements

- NodeJS >= 16.15.0
- AWS CLI profile with enough permissions for deployment

## Deployment

```bash
$ cp .env.local .env # Update values in .env
$ source .env # load env vars

$ npm run synth
$ npm run cdk -- bootstrap aws://$AWS_TARGET_ACCOUNT/$AWS_TARGET_REGION --toolkit-stack-name $(echo $APP_PREFIX)CDKTooltip --profile cc # Bootstrapping is one time action most of the time, repeat only when required by cdk

$ npm run cdk -- deploy $(echo $APP_PREFIX)WebsiteStack --require-approval never --toolkit-stack-name $(echo $APP_PREFIX)CDKTooltip --profile cc
```
