[![https://www.remoteassembly.com](https://www.remoteassembly.com/img/logo_3-bb1a318535.svg)](https://github.com/remoteassembly)

## Installation

1. Install google cloud functions locally (but in the same IP where server runs)
```
npm install -g @google-cloud/functions-emulator
```
or
```
yarn global add @google-cloud/functions-emulator
```

2. Clone project to your "cloudFunctions" directory

## Usage

1. Read info about google cloud functions
Here for example : https://cloud.google.com/functions/docs/writing/

2. Write function according to rules.
Set all params you need in .json file. For example GOOGLE_APPLICATION_CREDENTIALS, DB_HOST,CLOUD_BUCKET or others.

1. In your cloudFunctions directory run dev script. It will starts cloud function emulator, deploy CF locally and re-deploy when you save the changes.

```
npm run dev
```
4. For testing and debug you can create additional script for local run (it useful if you testing some external API). If you have local.js script you can rebuild and run your CF with one command 

```
npm run local
```

5. When you make sure that your CF works well, you can deploy it to Google Cloud Platform:

> before that - in *package.json* change **'helloWorld'** to your function name, in these lines:
> ```
>    "deploy": "npm run rimraf && npm run babel-build && node dist/index.js && gcloud beta functions deploy helloWorld --source=dist --trigger-http --timeout=120s --memory=2048",
>    "deploy-dev": "npm run rimraf && npm run babel-build && cd dist && functions deploy helloWorld --local-path=dist --trigger-http --timeout=120s",
>    "delete": "gcloud beta functions delete helloWorld",
> ```

It should also match a function name exported in index.js file. After that:
```
npm install
npm run deploy
```

> make sure that you add your credentials into gcloud console for this step

## Dependencies
Use [these instructions](https://cloud.google.com/functions/docs/deploying/) to setup global dependencies.
